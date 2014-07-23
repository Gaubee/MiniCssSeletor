;(function(){
//支持伪类的插件
var $ = (typeof window === "object")?window.$:require("./main");

var _parse_handle_hash_no_relationship = $.phhnr;
_parse_handle_hash_no_relationship[":"] = "PSEUDO";

var _parse_handle_hash = $.phh;

var PARSER = $.PARSER;
var _code = $.handle;
PARSER.PSEUDO = function (str,start_i) {
	var len = str.length;
	var end_i = start_i;
	var type = ":";
	var args = [];

	var pseudo_name_start_i = start_i+1;
	var pseudo_name_end_i;
	var pseudo_arg_start_i;
	var pseudo_arg_end_i;

	var IN_NAME = 1;
	var IN_ARG = 2;
	var AFTER_PSEUDO = 3;

	var STATUS = IN_NAME;
	var c;
	var _parse_handle_name;
	do{
		if (STATUS === IN_ARG) {
			if (c===")") {
				pseudo_arg_end_i = end_i;
				STATUS = AFTER_PSEUDO;
			}
		}else{
			if (_parse_handle_hash[c]) {
				pseudo_name_end_i||(pseudo_name_end_i = end_i);
				STATUS = AFTER_PSEUDO;
			}
			if(STATUS === IN_NAME){
				if (c==="(") {
					pseudo_name_end_i = end_i;
					pseudo_arg_start_i = end_i+1;
					STATUS = IN_ARG;
				}
			}else if(STATUS === AFTER_PSEUDO){
				//最后的解析，有子条件式则解析子条件式，否则直接结束
				//不是关系连接符的情况下，进入子条件式的解析
				if (c!==' '&& c!=='>'&& c!=='+'&& c!=='~'/*!_parse_handle_hash.hasOwnProperty(c)*/) {
					_parse_handle_name = _parse_handle_hash[c];
					var parse_info = PARSER[_parse_handle_name](str,end_i);
					type+=parse_info.type;
					args.push.apply(args,parse_info.args);
					//直接结束解析
					end_i = parse_info.i;
				}
				break;
			}
		}
		//在非参数的情况下
		//如果遇到额外的关系选择符，将结束当前解析
		if (_parse_handle_hash[c]) {
			pseudo_name_end_i||(pseudo_name_end_i = end_i);
		}else
		if (STATUS === AFTER_PSEUDO) {

		}
		c = str.charAt(++end_i);
	}while(end_i<len);

	var arg = [];
	arg.push(str.substring(pseudo_name_start_i,pseudo_name_end_i));
	if (pseudo_arg_start_i) {
		arg.push(str.substring(pseudo_arg_start_i,pseudo_arg_end_i||(end_i-1)));
	}
	args.splice(0,0,arg);
	return {
		type:type,
		args:args,
		i:end_i
	}
};
var _A_before_B = function (nodeA,nodeB) {
	if (nodeA.compareDocumentPosition) {
		_A_before_B = function (nodeA,nodeB) {
			return nodeA.compareDocumentPosition(nodeB) === 4;
		}
	}else{
		_A_before_B = function (nodeA,nodeB) {
			while(nodeA = nodeA.nextSibling){
				if (nodeA==nodeB) {
					return true;
				}
			}
		}
	}
	return _A_before_B(nodeA,nodeB);
};
var _valid_error = SyntaxError("not a valid selector.");
_code[":"] = function (pseudo_name,pseudo_arg) {
	var self = this;
	var content = self.content;
	var parent = self.parent;
	var eles = parent?parent.content:(document.all||document.getElementsByTagName("*"));
	var _avoid_repet = "__"+Math.random().toString(16).substring(2)+"__";
	//不需要参数的
	switch(pseudo_name){
		case "first-of-type":
			var _parent_contains = [];
			for(var i = 0,ele,parent_ele;ele = eles[i];i+=1){
				if (parent_ele = ele.parentNode) {
					var _parent_ele_uuid = parent_ele.getAttribute(_avoid_repet);
					if (_parent_ele_uuid) {
						var nodeB = eles[_parent_ele_uuid];
						if (_A_before_B(ele,nodeB)) {
							parent_ele.setAttribute(_avoid_repet,i);
						}
					}else{
						parent_ele.setAttribute(_avoid_repet,i);
						//这些父级元素等一下需要移除_avoid_repet属性
						_parent_contains.push(parent_ele);
					}
				}else{
					//无父级，独立元素，则是第一个也是最后一个
					content.push(ele);
				}
			}
			for (i = 0;parent_ele = _parent_contains[i]; i+=1) {
				content.push(eles[parent_ele.getAttribute(_avoid_repet)]);
				parent_ele.removeAttribute(_avoid_repet);
			}
			break;
		case "last-of-type":
			var _parent_contains = [];
			for(var i = 0,ele,parent_ele;ele = eles[i];i+=1){
				if (parent_ele = ele.parentNode) {
					var _parent_ele_uuid = parent_ele.getAttribute(_avoid_repet);
					if (_parent_ele_uuid) {
						var nodeA = eles[_parent_ele_uuid];
						if (_A_before_B(nodeA, ele)) {
							parent_ele.setAttribute(_avoid_repet,i);
						}
					}else{
						parent_ele.setAttribute(_avoid_repet,i);
						//这些父级元素等一下需要移除_avoid_repet属性
						_parent_contains.push(parent_ele);
					}
				}else{
					//无父级，独立元素，则是第一个也是最后一个
					content.push(ele);
				}
			}
			for (i = 0;parent_ele = _parent_contains[i]; i+=1) {
				content.push(eles[parent_ele.getAttribute(_avoid_repet)]);
				parent_ele.removeAttribute(_avoid_repet);
			}
			break;
		case "only-of-type":
			var _parent_contains = [];
			for(var i = 0,ele,parent_ele;ele = eles[i];i+=1){
				if (parent_ele = ele.parentNode) {
					var _parent_ele_uuid = parent_ele.getAttribute(_avoid_repet);
					if (_parent_ele_uuid) {
						//有多个匹配的子元素，不是唯一，移除相应属性
						parent_ele.removeAttribute(_avoid_repet);
					}else{
						parent_ele.setAttribute(_avoid_repet,i);
						//这些父级元素等一下需要移除_avoid_repet属性
						_parent_contains.push(parent_ele);
					}
				}else{
					//无父级，独立元素，则是第一个也是最后一个
					content.push(ele);
				}
			}
			for (i = 0;parent_ele = _parent_contains[i]; i+=1) {
				_parent_ele_uuid = parent_ele.getAttribute(_avoid_repet);
				if (_parent_ele_uuid) {
					content.push(eles[_parent_ele_uuid]);
					parent_ele.removeAttribute(_avoid_repet);
				}
			}
			break;
		case "empty":
			for(var i = 0,ele;ele = eles[i];i+=1){
				if (!ele.children.length) {//无子元素
					content.push(ele);
				}
			}
			break;
		case "checked":
			for(var i = 0,ele;ele = eles[i];i+=1){
				if (ele.checked) {//选中状态
					content.push(ele);
				}
			}
			break;
		case "target":
			var _target_id = location.hash.substr(1);
			for(var i = 0,ele;ele = eles[i];i+=1){
				if (ele.id === _target_id) {//选中状态
					content.push(ele);
				}
			}
			break;
		case "enabled":
			var _target_id = location.hash.substr(1);
			for(var i = 0,ele;ele = eles[i];i+=1){
				if (!ele.disabled) {//激活状态
					content.push(ele);
				}
			}
			break;
		case "disabled":
			var _target_id = location.hash.substr(1);
			for(var i = 0,ele;ele = eles[i];i+=1){
				if (ele.disabled) {//激活状态
					content.push(ele);
				}
			}
			break;
		default:
			//需要参数的
			//先检验参数是否不为空，确保合法性
			if (!pseudo_arg) {
				/*格式错误，不可用的伪类选择器*/
				throw _valid_error;
			}
			switch(pseudo_name){
				case "not":
					var selector = $(pseudo_arg);
					selector.parent = parent;
					var filter_eles = selector._run();
					for(var i = 0,ele;ele = filter_eles[i];i+=1){
						ele.setAttribute(_avoid_repet,_avoid_repet);
					}
					for(i = 0,ele;ele = eles[i];i+=1){
						if (ele.getAttribute(_avoid_repet)) {
							ele.removeAttribute(_avoid_repet);
						}else{
							content.push(ele);
						}
					}
					break;
				case "nth-child":
					//参数格式转化
					pseudo_arg = (+pseudo_arg)+1;
					for(var i = 0,ele;ele = eles[i];i+=1){
						ele = ele.children[pseudo_arg];
						ele&&content.push(ele);
					}
					break;
				case "nth-last-child":
					for(var i = 0,ele;ele = eles[i];i+=1){
						//减法时，参数格式自动转化
						ele = ele.children[ele.length-pseudo_arg];
						ele&&content.push(ele);
					}
					break;
			}
			break;
	}
};
_code["and:"] = function (pseudo_name,pseudo_arg) {
	var self = this;
	var mode_env = {
		parent:{
			content:self.content,
			_run:function () {}
		},
		content:[]
	};
	_code[":"].apply(mode_env, arguments)
	self.content = mode_env.content;
};
}());