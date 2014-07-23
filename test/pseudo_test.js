var $ = require("../lib/main");
require("../lib/pseudo");

console.log($(":enabled.name")._stringify());
console.log($(".name:enabled")._stringify());
console.log($(".name:not(.a) li:nth-child(2)")._stringify());
