var $ = require("../lib/main");


// console.log($("#name")._stringify());
// console.log($("#name ")._stringify());
// console.log($("#name   ")._stringify());
// console.log($("#name.c1.c2.c3   ")._stringify());
// console.log($("#name .cc.ccc")._stringify());
// console.log($(".name   .cc.ccc")._stringify());
// console.log($("#name.c1.c2.c3 .cc.ccc")._stringify());
console.log($("name#c1.c2.c3 .cc.ccc")._stringify());
console.log($("name#c1.c2.c3>.cc.ccc")._stringify());
console.log($("[name='Gaub  ee'   ] >  a")._stringify());
console.log($("a[   name='Gaub  ee'   ].hehe[href] >  a")._stringify());
console.log($("a[   name='Gaub  ee'   ].hehe[href a*=aa")._stringify());
console.log($("*.a")._stringify());
console.log($("div~")._stringify());