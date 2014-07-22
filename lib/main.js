;(function(){
var doc_by_id = function (id) {
	return document.getElementById(id);
};
var doc_by_class = function (className) {
	return document.getElementsByClassName(className);
};
var doc_by_tag = function (tagName) {
	return document.getElementsByTagName(tagName)
};
// var ele_by_id = function (ele, id) {
// 	return document.getElementById(id);
// };
var ele_by_class = function (ele, className) {
	return ele.getElementsByClassName(className);
};
var ele_by_tag = function (ele, tagName) {
	return ele.getElementsByTagName(tagName)
};
var has_attr = function (ele,attr_name) {
	has_attr = ele.hasAttribute?function (ele,attr_name) {
		return ele.hasAttribute(attr_name);
	}:function (ele,attr_name) {//Fuck IE
		return ele.getAttribute(attr_name)!==null;
	};
	has_attr(ele,attr_name);
};
var get_attr = function (ele,attr_name) {
	//字符串化
	return ele.getAttribute(attr_name)||"";
};

function tool_trim(str) {
    str = String(str).replace(/^\s\s*/, '')
    var ws = /\s/,
        i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
};
function tool_push(arr,item) {
	arr[arr.length] = item;
};
function tool_push_apply(arr,likeArray) {
	for (var i = 0,arr_len = arr.length,len = likeArray.length;i<len; i+=1) {
		arr[arr_len+i] = likeArray[i];
	};
};
var _code = {
	"*":function (argument) {
		var self = this;
		var content = self.content;
		var parent = self.parent;
		/*
		if (parent) {
			tool_push_apply(content,parent.content)
		}else{
			tool_push_apply(content,document.all||doc_by_tag("*"));
		}
		*/
		tool_push_apply(content,parent?parent.content:(document.all||doc_by_tag("*")));
	},
	"#":function (id) {
		var self = this;
		var content = self.content;
		var parent = self.parent;
		if (parent) {
			for(var i = 0,ele;ele = parent.content[i];i+=1){
				if (ele.id === id) {
					tool_push(content,ele);
				}
			}
		}else{
			var ele = doc_by_id(id);
			if (ele) {
				tool_push(content,ele);
			}
		}
	},
	".":function (className) {
		var self = this;
		var content = self.content;
		var parent = self.parent;
		if (parent) {
			for(var i = 0,ele;ele = parent.content[i];i+=1){
				if ((" "+ele.className+" ").indexOf(" "+className+" ")!==-1) {
					tool_push(content,ele);
				}
			}
		}else{
			tool_push_apply(content,doc_by_class(className));
		}
	},
	"E":function (tagName) {
		var self = this;
		var content = self.content;
		var parent = self.parent;
		if (parent) {
			tagName = tagName.toUpperCase();
			for(var i = 0,ele;ele = parent.content[i];i+=1){
				if (ele.tagName === tagName) {
					tool_push(content,ele);
				}
			}
		}else{
			tool_push_apply(content,doc_by_tag(tagName));
		}
	},
	"and#":function (id) {
		var self = this;
		var content = self.content;
		var new_content = [];
		for (var i = 0,ele;ele=content[i];i+=1) {
			if (ele.id === id) {
				tool_push(new_content,ele);
			}
		};
		self.content = new_content;
	},
	"and.":function (className) {
		var self = this;
		var content = self.content;
		var new_content = [];
		for (var i = 0,ele;ele=content[i];i+=1) {
			if ((" "+ele.className+" ").indexOf(" "+className+" ")!==-1) {
				tool_push(new_content,ele);
			}
		};
		self.content = new_content;
	},
	"and*":function (argument) {
		/*
		 * NO THING TODO
		 */
	},
	"andE":function (tagName) {
		var self = this;
		var content = self.content;
		var new_content = [];
		for (var i = 0,ele;ele=content[i];i+=1) {
			if (ele.tagName === tagName) {
				tool_push(new_content,ele);
			}
		};
		self.content = new_content;
	},
	//属性的过滤
	"[":function (name,handle,value) {
		var self = this;
		var content = self.content;
		var parent = self.parent;
		var eles = parent?parent.content:parent?parent.content:(document.all||doc_by_tag("*"));
		if (handle === "") {
			for(var i = 0,ele;ele = eles[i];i+=1){
				if (has_attr(ele,name)) {
					tool_push(content,ele);
				}
			}
		}else{
			//处理引号包裹的字符串参数
			var first_char = value.charAt(0);
			if((first_char === "'"||first_char === '"')&&(first_char===value.charAt(value.length-1))){
				value = value.substring(1,value.length-1);
			}

			if(handle === "="){
				for(var i = 0,ele;ele = eles[i];i+=1){
					if (get_attr(ele,name)===value) {
						tool_push(content,ele);
					}
				}
			}else if(handle === "~="){
				//含有并用" "分隔的值
				for(var i = 0,ele;ele = eles[i];i+=1){
					if ((" "+get_attr(ele,name)+" ").indexOf(" "+value+" ")!==-1) {
						tool_push(content,ele);
					}
				}
			}else if(handle === "^="){
				//开头的值
				for(var i = 0,ele;ele = eles[i];i+=1){
					if (!get_attr(ele,name).indexOf(value)/*===0*/) {
						tool_push(content,ele);
					}
				}
			}else if(handle === "$="){
				//结尾的值
				for(var i = 0,ele,attr_value;ele = eles[i];i+=1){
					attr_value = get_attr(ele,name);
					if (attr_value.indexOf(value)===attr_value.length-value.length) {
						tool_push(content,ele);
					}
				}
			}else if(handle === "*="){
				//含有的值
				for(var i = 0,ele;ele = eles[i];i+=1){
					if (get_attr(ele,name).indexOf(value)!==-1) {
						tool_push(content,ele);
					}
				}
			}else if(handle === "|="){
				//含有并用"-"分隔的值
				for(var i = 0,ele;ele = eles[i];i+=1){
					if (("-"+get_attr(ele,name)+"-").indexOf("-"+value+"-")!==-1) {
						tool_push(content,ele);
					}
				}
			}

		}
	},
	"and[":function (name,handle,value) {
		var self = this;
		var mode_env = {
			parent:{
				content:self.content
			},
			content:[]
		};
		_code["["].apply(mode_env, arguments)
		self.content = mode_env.content;
	},
	//所有子节点
	" ":function () {
		var self = this;
		var content = self.content;
		var parent_content = self.parent.content;
		for(var i=0,ele;ele = parent_content[i];i+=1){
			tool_push_apply(content,ele_by_tag(ele,"*"));
		}
	},
	//一级子节点
	">":function () {
		var self = this;
		var content = self.content;
		var parent_content = self.parent.content;
		for(var i=0,ele;ele = parent_content[i];i+=1){
			//children：非标准属性，它返回指定元素的只返回HTML节点集合。绝大部分浏览器支持，哪些不支持还不知道
			//标准的childNodes还会返回text、comment节点
			tool_push_apply(content,ele.children);
		}
	},
	//节点后面的节点
	"+":function () {
		var self = this;
		var content = self.content;
		var parent_content = self.parent.content;
		for(var i=0,ele;ele = parent_content[i];i+=1){
			do{
				ele = ele.nextSibling;
				if (ele&&ele.nodeType===1) {
					break;
				}
			}while(ele)
			ele&&tool_push(content,ele);
		}
	},
	//节点后面的所有节点
	"~":function () {
		var self = this;
		var content = self.content;
		var parent_content = self.parent.content;
		//用来标志元素避免重复;
		var _avoid_repet = "__"+Math.random().toString(16).substring(2)+"__";
		for(var i=0,ele;ele = parent_content[i];i+=1){
			do{
				ele = ele.nextSibling;
				if (ele&&ele.nodeType===1) {
					if (get_attr(ele,_avoid_repet)) {
						//已经受过标记，说明它后面的兄弟节点都已经在容器中
						break;
					}
					ele.setAttribute(_avoid_repet,_avoid_repet);
					tool_push(content,ele);
				}
			}while(ele)
		}
		for(var i = 0,ele;ele = content[i];i+=1){
			//移除标记
			ele.removeAttribute(_avoid_repet);
		}
	}
};

function Seletor (type,args) {
	this.content = [];
	//# . > ' ' [ ] ~
	this.type = type;
	this.args = args;
	this.parent = null;
};
Seletor.prototype._link_child = function (type,args) {
	var seletor = this;
	if (!seletor.type) {
		seletor.type = type;
		seletor.args = args;
	}else{
		var seletor = new Seletor(type,args);
		seletor.parent = this;
	}
	return seletor;
};
Seletor.prototype._run = function () {
	var seletor = this;
	var type = seletor.type;
	if (seletor.parent) {
		seletor.parent._run();
	}
	if (type) {
		//起始式
		_code[type.charAt(0)].apply(this, this.args[0])
		for(var i = 1,c;c = type.charAt(i);i+=1){
			_code["and"+c].apply(this,this.args[i]);
		}
	}
	return seletor.content;
};
Seletor.prototype._stringify = function () {
	var seletor = this;
	var result = ""
	do{
		result="'"+seletor.type+"' => ("+seletor.args.join(")(")+") ; "+result
	}while(seletor = seletor.parent);
	return result+"\n";
};

//状态机
//重点：重点在于空白字符的过滤
var PARSER = {};
function _base_parser_builder (name,prefix) {
	PARSER[name] = function (str,start_i) {
		var len = str.length;
		var end_i = start_i;
		var type = prefix;

		var arg_start_i = start_i+1;
		var arg_end_i;
		var c;
		var _parse_handle_hash = {
			"#":"ID",
			".":"CLASS",
			"[":"ATTR",
			"*":"ALL"
		};
		var _parse_handle_name;

		var parse_info;
		var args = [];
		var _tobe_end;
		var _end_loop;
		do{
			if (_tobe_end) {//> +
				break;
			}
			c = str.charAt(++end_i);
			_parse_handle_name = _parse_handle_hash[c];
			if (_parse_handle_name) {
				if (!arg_end_i) {
					arg_end_i = end_i;
					// console.log("开始解析子条件式");
					parse_info = PARSER[_parse_handle_name](str,end_i);
					type+=parse_info.type;
					//因为会运行一次++end_i，所以需要-1，来获取正确的返回字符
					end_i = parse_info.i-1;
					// console.log("parse_info.i",end_i);
					args.push.apply(args,parse_info.args);
				}
			}else{
				//如果是关系选择符，则结束这次解析单元
				// console.log(c);
				if (c===">"||c==="+"||c===" "||c==="~") {
					arg_end_i||(arg_end_i = end_i);
					//遇到空白无用字符，准备结束ID的解析，只留一个空白字符
					_tobe_end = true;
				}
			}
		}while(end_i<len);
		//如不是单条件选择语句的话（附带className、Attribute判断）
		var arg = str.substring(arg_start_i,arg_end_i||end_i);
		args.splice(0,0,[arg]);

		return {
			type:type,
			args:args,
			i:end_i
		}
	};
};
_base_parser_builder("ID","#");
_base_parser_builder("CLASS",".");
_base_parser_builder("ALL","*");

PARSER.EMPTY = function (str,start_i) {
	return {
		type:" ",
		args:[[]],
		i:start_i+1
	}
};
PARSER.CHILD = function (str,start_i) {
	return {
		type:">",
		args:[[]],
		i:start_i+1
	}
};
PARSER.ADJACENT = function (str,start_i) {
	return {
		type:"+",
		args:[[]],
		i:start_i+1
	}
};
PARSER.BROTHER = function (str,start_i) {
	return {
		type:"~",
		args:[[]],
		i:start_i+1
	}
};
_base_parser_builder("_TAG","E");
PARSER.TAG = function (str,start_i) {
	return PARSER._TAG(str,start_i-1);
};
PARSER.ATTR = function (str,start_i) {
	var len = str.length;
	var end_i = start_i;
	var type = "[";
	var args = [];

	var attr_name_start_i = start_i+1;
	var attr_name_end_i;
	var attr_handle_start_i;
	var attr_handle_end_i;
	var attr_value_start_i;
	var attr_value_end_i;

	var IN_NAME = 1;
	var IN_HANDLE = 2;
	var IN_VALUE = 3;
	var AFTER_ATTR = 4;

	var STATUS = IN_NAME;
	var c;
	var _parse_handle_hash = {
		"#":"ID",
		".":"CLASS",
		"[":"ATTR"
	};
	var _parse_handle_name;

	do{
		c = str.charAt(++end_i);
		//||IN_VALUE
		if (c === "]") {
			attr_name_end_i||(attr_name_end_i = end_i);
			attr_value_end_i = end_i;
			STATUS = AFTER_ATTR;
		}else if (STATUS === IN_NAME) {
			if (c==="="||c==="~"||c==="^"||c==="$"||c==="*"||c==="|") {
				attr_name_end_i = end_i;
				attr_handle_start_i = end_i;
				STATUS = IN_HANDLE;
			}
		}else if(STATUS === IN_HANDLE){
			if (c!=="="&&c!=="~"&&c!=="^"&&c!=="$"&&c!=="*"&&c!=="|") {
				attr_handle_end_i = end_i;
				attr_value_start_i = end_i;
				STATUS = IN_VALUE;
			}
		}else if(STATUS === AFTER_ATTR){
			//最后的解析，有志条件式则解析子条件式，否则直接结束
			//不是关系连接符的情况下，进入子条件式的解析
			if (c!==' '&& c!=='>'&& c!=='+'&& c!=='~') {
				var parse_info = (c==="."?PARSER.CLASS:PARSER.ID)(str,end_i);
				type+=parse_info.type;
				args.push.apply(args,parse_info.args);
				//直接结束解析
				end_i = parse_info.i;
			}
			break;
		}

	}while(end_i<len);

	var arg = [];
	// attr_name
	arg.push(str.substring(attr_name_start_i,attr_name_end_i));
	//attr_handle
	if (attr_handle_start_i) {
		arg.push(str.substring(attr_handle_start_i,attr_handle_end_i));
	}
	if(attr_value_start_i){
		//attr_value
		//松散的解析，运行不写最后一个字符]
		arg.push(str.substring(attr_value_start_i,attr_value_end_i||end_i/*意外（不规范）结束的属性值*/));
	}
	args.splice(0,0,arg);
	return {
		type:type,
		args:args,
		i:end_i
	}
};
function $(str) {
	/*
	 * 格式化选择字符串，使其标准化，方便解析
	 */
	//过滤两边的空白字符
	str = tool_trim(str);
	var quotedString = /"(?:\.|(\\\")|[^\""\n])*"|'(?:\.|(\\\')|[^\''\n])*'/g;
	var str_cache = [];
	var str_placeholder = Math.random().toString(16).substr(2);
	//备份字符串，可能是属性值
	str = str.replace(quotedString,function (matchStr) {
		str_cache.push(matchStr);
		return str_placeholder;
	});
	// console.log(str);
	//过滤联系的无用空白字符
	str = str.replace(/[\s]{2,}/g,' ');
	str = str.replace(/\s\>\s/g,'>');
	str = str.replace(/\s\+\s/g,'+');
	str = str.replace(/\s\~\s/g,'~');
	str = str.replace(/\s\(\s/g,'(');
	str = str.replace(/\s\)/g,')');
	str = str.replace(/\[\s/g,'[');
	str = str.replace(/\s\]/g,']');
	// console.log(str);
	//还原字符串
	str = str.replace(RegExp(str_placeholder, "g"),function () {
		return str_cache.shift();
	});
	console.log(str);

	/*
	 * 格式化完毕，开始正式解析
	 */

	var result = new Seletor;

	var _parse_handle_hash = {
"#":"ID",
".":"CLASS",
" ":"EMPTY",
">":"CHILD",
"+":"ADJACENT",
"~":"BROTHER",
"[":"ATTR",
"*":"ALL"
	};
	var _parse_handle_name;

	for(var i = 0,c,parse_info;c = str[i];/*i+=1*/){
		// console.log(c);
		_parse_handle_name = _parse_handle_hash[c];
		parse_info = PARSER[_parse_handle_name||"TAG"](str,i);
		i = parse_info.i;
		result = result._link_child(parse_info.type,parse_info.args)
	}
	return result;
}
(typeof module === "object")&&(module.exports = $);
(typeof window === "object")&&(window.$ = $);
}());

