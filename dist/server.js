!function(t,e){for(var n in e)t[n]=e[n]}(exports,function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=8)}([function(t,e){t.exports=require("express")},function(t,e){t.exports=require("rxjs")},function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))(function(i,o){function a(t){try{c(r.next(t))}catch(t){o(t)}}function u(t){try{c(r.throw(t))}catch(t){o(t)}}function c(t){t.done?i(t.value):new n(function(e){e(t.value)}).then(a,u)}c((r=r.apply(t,e||[])).next())})},i=this&&this.__generator||function(t,e){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=(i=a.trys).length>0&&i[i.length-1])&&(6===o[0]||2===o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=e.call(t,a)}catch(t){o=[6,t],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}},o=this;Object.defineProperty(e,"__esModule",{value:!0});var a=n(20),u=n(1),c=process.env.PROD_MYSQL_PASSWORD,s=a.createPool({connectionLimit:1e3,host:"127.0.0.1",user:process.env.MYSQL_USER,password:c,database:process.env.MYSQL_DB,multipleStatements:!0});e.multiQuery=function(t,e,n){var r=a.createConnection({host:"127.0.0.1",user:process.env.MYSQL_USER,password:c,database:process.env.MYSQL_DB,multipleStatements:!0});return new u.Observable(function(n){var i=r.query(t,e,function(t,e){t?n.error(t):n.next(e),n.complete()});console.log(i.sql),console.log("---------------------------------------------------------------------------------------------------------------------")})},e.query=function(t,e){return new u.Observable(function(n){s.getConnection(function(r,i){if(r)n.error(r),n.complete();else{var o=i.query(t,e,function(t,e){t?n.error(t):n.next(e),i.release(),n.complete()});console.log("---------------------------------------------------------------------------------------------------------------------"),console.log(o.sql)}})})},e.queryAsync=function(t,e){return r(o,void 0,void 0,function(){return i(this,function(n){return s.getConnection(function(n,r){if(n)throw n;var i=r.query(t,e,function(t,e){if(t)throw console.log(t),t;return console.log(e),e});console.log("---------------------------------------------------------------------------------------------------------------------"),console.log(i.sql)}),[2]})})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(){}return Object.defineProperty(t.prototype,"active",{get:function(){return this._active},set:function(t){this._active=!!t},enumerable:!0,configurable:!0}),t}();e.Base=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(12),i=n(13),o=n(14);e.sign=function(){return r.sign({name:"sankara asapu",exp:60},i.secret)},e.valid=o({secret:i.secret})},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r(e,t),e}(n(3).Base);e.Employee=i},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r(e,t),e}(n(3).Base);e.Project=i},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r(e,t),e}(n(3).Base);e.Artifact=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(9);n(10);n(11).config();var o=n(4),a=n(15),u=n(16),c=n(18),s=n(21),p=n(24),f=n(27),l=n(30),_=n(33),d=n(35),b=n(38),y=n(40),v=r();v.use(i.json()),v.use(i.urlencoded({extended:!0})),v.use(function(t,e,n){e.header("Access-Control-Allow-Origin","http://107.170.228.97"),e.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE, OPTIONS"),e.header("Access-Control-Allow-Headers","Content-Type, application/json, Origin, X-Requested-With, Accept, Authorization"),e.header("Access-Control-Allow-Credentials","true"),n()}),v.route("/").get(o.valid,function(t,e,n){t.get("token")?n():e.status(401).json("un authorized")}),v.use("/",u.default),v.use("/employees",c.default),v.use("/applications",p.default),v.use("/projects",s.default),v.use("/requirement-type",f.default),v.use("/attribute",l.default),v.use("/application-agile-status",d.default),v.use("/artifacts",_.default),v.use("/artifact-history",b.default),v.use("/",y.default),v.route("/routes").get(function(t,e,n){v._router.stack.forEach(a.print.bind(null,[])),e.status(200).send(a.getPaths())}),v.use(function(t,e,n,r){t.sqlMessage&&console.error(t.sqlMessage),r(t)}),v.use(function(t,e,n,r){console.error(t.stack),r(t)}),v.use(function(t,e,n,r){"UnauthorizedError"===t.name&&n.status(401).send("Un Authorized"),n.status(500).send("Something went wrong")}),console.log("MySQL User: ",process.env.MYSQL_USER),v.listen(process.env.PORT||3e3,function(){console.log("App is running at http://localhost:%d in %s mode",process.env.PORT,"production")}),t.exports=v},function(t,e){t.exports=require("body-parser")},function(t,e){t.exports=require("cookie-parser")},function(t,e){t.exports=require("dotenv")},function(t,e){t.exports=require("jsonwebtoken")},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.secret="ABCD1234567890"},function(t,e){t.exports=require("express-jwt")},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r="<ul>";e.print=function(t,n){if(n.route)n.route.stack.forEach(e.print.bind(null,t.concat(i(n.route.path))));else if("router"===n.name&&n.handle.stack)n.handle.stack.forEach(e.print.bind(null,t.concat(i(n.regexp))));else if(n.method){var o=t.concat(i(n.regexp)).filter(Boolean).join("/");r+="<li>"+n.method.toUpperCase()+': <a href="http://localhost:'+(process.env.PORT||3e3)+"/"+o+'" target="_blank">/'+o+"</a></li>"}};var i=function(t){if("string"==typeof t)return t.split("/");if(t.fast_slash)return"";var e=t.toString().replace("\\/?","").replace("(?=\\/|$)","$").match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);return e?e[1].replace(/\\(.)/g,"$1").split("/"):"<complex:"+t.toString()+">"};e.getPaths=function(){return r}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(17),o=r.Router();o.post("/authenticate",function(t,e,n){i.Authenticate(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),i=n(4);e.Authenticate=function(t){return new r.Observable(function(t){var e=i.sign();t.next({id:31,uid:"A010101",type:1,firstName:"Sankara",middleName:"Swaroop",lastName:"Asapu",email:"sankarasapu@gmail.com",token:e,expires:60}),t.complete()})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(19),o=r.Router();o.get("/:employeeId",function(t,e,n){i.byId(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/byApplication/:applicationId",function(t,e,n){i.byApplication(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),i=n(2),o=n(5);e.byId=function(t){return new r.Observable(function(t){t.next({id:33,uid:"A010101",type:1,firstName:"Sankara",middleName:"Swaroop",lastName:"Asapu",email:"sankarasapu@gmail.com"}),t.complete()})},e.byApplication=function(t){return new r.Observable(function(e){i.query("SELECT ?? FROM light_employee LE LEFT JOIN light_role_emp LRE ON LE.id_employee=LRE.id_employee WHERE id_app=? GROUP BY id_employee;",[["fname_employee","lname_employee","LE.id_employee"],t.applicationId]).subscribe(function(t){var n,r=[];t.forEach(function(t){(n=new o.Employee).id=t.id_employee,n.firstName=t.fname_employee,n.lastName=t.lname_employee,r.push(n)}),e.next(r)},function(t){return e.error(t)},function(){return e.complete()})})}},function(t,e){t.exports=require("mysql")},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(22),o=r.Router();o.get("/projectsGroupbyRelease/:applicationId",function(t,e,n){i.projectsGroupbyRelease(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(2),i=n(6),o=n(23),a=n(1);e.projectsGroupbyRelease=function(t){return new a.Observable(function(e){r.query("SELECT ??, IFNULL(SUM(expected_points_artifact),0) expected, IFNULL(SUM(actual_points_artifact),0) actual FROM light_project_release LPR LEFT JOIN light_project LP ON LPR.id_release=LP.id_release LEFT JOIN light_artifact LA ON LA.id_project=LP.id_project WHERE LPR.active_release=1 AND LP.id_app=? GROUP BY id_project ORDER BY LPR.id_release,LP.id_project;",[["LPR.id_release","name_release","active_release","active_project","type_release","type_project","LP.id_project","LP.name_project","LP.active_project"],t.applicationId]).subscribe(function(t){var n,r,a=[];t.forEach(function(t){r&&r.id===t.id_release||((r=new o.Release).id=t.id_release,r.name=t.name_release,r.type=t.type_release,r.active=t.active_release,r.projects=[],a.push(r)),(n=new i.Project).id=t.id_project,n.name=t.name_project,n.active=t.active_project,n.type=t.type_project,n.active=t.active_project,n.expected=t.expected,n.actual=t.actual,r.projects.push(n)}),e.next(a)},function(t){return e.error(t)},function(){return e.complete()})})}},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r(e,t),e}(n(6).Project);e.Release=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(25),o=r.Router();o.get("/byEmployee/:employeeId",function(t,e,n){i.byEmployee(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(2),i=n(26),o=n(1);e.byEmployee=function(t){return new o.Observable(function(e){r.query("SELECT ?? FROM light_app WHERE id_app IN (SELECT id_app FROM light_role_emp WHERE id_employee=? AND active=1 AND id_app!=0) AND active_app!=0 ORDER BY modified_date DESC;",[["id_app","name_app"],t.employeeId]).subscribe(function(t){var n,r=[];t.forEach(function(t){(n=new i.Application).id=t.id_app,n.name=t.name_app,r.push(n)}),e.next(r)},function(t){return e.error(t)},function(){return e.complete()})})}},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r(e,t),e}(n(3).Base);e.Application=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(28),o=r.Router();o.get("/byApplication/:applicationId",function(t,e,n){i.byApplication(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),i=n(2),o=n(29);e.byApplication=function(t){return new r.Observable(function(e){i.query("SELECT ?? FROM light_object LO LEFT JOIN light_app_object_attribute LAOA ON LO.id_object=LAOA.id_object WHERE LAOA.id_app=? and LAOA.active=1 group by LO.id_object order by LO.id_object;",[["LO.id_object","name_object","color","code_object"],t.applicationId]).subscribe(function(t){var n,r=[];t.forEach(function(t){(n=new o.RequirementType).id=t.id_object,n.name=t.name_object,n.color=t.color,n.code=t.code_object,r.push(n)}),e.next(r)},function(t){return e.error(t)},function(){return e.complete()})})}},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r(e,t),e}(n(3).Base);e.RequirementType=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(31),o=r.Router();o.get("/byApplication/:applicationId",function(t,e,n){i.byApplication(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/byApplication/:applicationId/:requirementTypeId",function(t,e,n){i.byApplication(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),i=n(2),o=n(32);e.byApplication=function(t){return new r.Observable(function(e){var n="SELECT ?? FROM light_app_object_attribute LAOA LEFT JOIN light_object_attribute LOA ON LAOA.id_object_attribute=LOA.id_object_attribute LEFT JOIN light_attribute LA ON LOA.id_attribute=LA.id_attribute LEFT JOIN light_attribute_value LAV ON LAV.id_attribute=LA.id_attribute WHERE LAOA.id_app=?"+(t.requirementTypeId?" AND LAOA.id_object=?":"")+" AND LAOA.active=1;";i.query(n,[["LA.id_attribute","name_attribute","type_attribute","system_attribute","LAV.value_attribute"],t.applicationId,t.requirementTypeId]).subscribe(function(t){var n,r=[];t.forEach(function(t){t.id_attribute&&(n&&n.id===t.id_attribute||((n=new o.Attribute).id=t.id_attribute,n.name=t.name_attribute,n.type=t.type_attribute,n.system=t.system_attribute,n.values=[],r.push(n)),n.values.push(t.value_attribute||""))}),e.next(r)},function(t){return e.error(t)},function(){return e.complete()})})}},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r(e,t),e}(n(3).Base);e.Attribute=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(34),o=r.Router();o.get("/parent-artifacts/byApplication/:applicationId",function(t,e,n){i.parentArtifacts(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/agile-artifacts/:applicationId/:projectId/:requirementTypeId",function(t,e,n){i.artifacts(t.params,!0).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:parentArtifactId",function(t,e,n){i.artifacts(t.params,!0).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:assignedTo",function(t,e,n){i.artifacts(t.params,!0).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:parentArtifactId/:assignedTo",function(t,e,n){i.artifacts(t.params,!0).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/:applicationId/:projectId/:requirementTypeId",function(t,e,n){i.artifacts(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/:applicationId/:projectId/:requirementTypeId/:parentArtifactId",function(t,e,n){i.artifacts(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/:applicationId/:projectId/:requirementTypeId/:assignedTo",function(t,e,n){i.artifacts(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/:applicationId/:projectId/:requirementTypeId/:parentArtifactId/:assignedTo",function(t,e,n){i.artifacts(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),o.get("/:artifactId",function(t,e,n){i.artifactById(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),e.default=o},function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))(function(i,o){function a(t){try{c(r.next(t))}catch(t){o(t)}}function u(t){try{c(r.throw(t))}catch(t){o(t)}}function c(t){t.done?i(t.value):new n(function(e){e(t.value)}).then(a,u)}c((r=r.apply(t,e||[])).next())})},i=this&&this.__generator||function(t,e){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=(i=a.trys).length>0&&i[i.length-1])&&(6===o[0]||2===o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=e.call(t,a)}catch(t){o=[6,t],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}},o=this;Object.defineProperty(e,"__esModule",{value:!0});var a=n(2),u=n(7),c=n(1),s=n(5);e.parentArtifacts=function(t){return new c.Observable(function(e){var n=["id_artifact","name_artifact"];a.query("SELECT ?? FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=?);",[n,t.applicationId]).subscribe(function(t){e.next(p(n,t))},function(t){return e.error(t)},function(){return e.complete()})})},e.parentArtifactsByApplicationAsync=function(t){return r(o,void 0,void 0,function(){var e,n;return i(this,function(r){switch(r.label){case 0:e=["id_artifact","name_artifact"],n="SELECT ?? FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=?);",r.label=1;case 1:return r.trys.push([1,3,,4]),[4,a.queryAsync(n,[e,t.applicationId])];case 2:return[2,r.sent()];case 3:throw r.sent();case 4:return[2]}})})},e.artifacts=function(t,e){return new c.Observable(function(n){var r=["LA.id_artifact","name_artifact","uid_artifact","agile_status_value","color"],i="";e?(r=r.concat(["expected_points_artifact","actual_points_artifact","fname_employee","lname_employee"]),i="SELECT ?? FROM light_artifact LA LEFT JOIN light_employee LE ON LA.assignedto_artifact=LE.id_employee"):(r=r.concat(["id_attribute","id_app_object_attribute","attribute_value"]),i="SELECT ?? FROM light_artifact LA LEFT JOIN light_artifact_attribute LAA ON LA.id_artifact=LAA.id_artifact"),i+=" LEFT JOIN light_object LO ON LA.id_object=LO.id_object LEFT JOIN light_app_agile_status LAAS ON LA.status_artifact=LAAS.id_app_agile_status WHERE LA.id_app=? AND id_project=? AND LA.id_object=?"+(t.parentArtifactId?" AND parent_id_artifact=?":"")+(t.assignedTo?" AND assignedto_artifact=?":""),a.query(i,[r,t.applicationId,t.projectId,t.requirementTypeId,t.parentArtifactId,t.assignedTo]).subscribe(function(t){var r,i=[];t.forEach(function(t){r&&r.id===t.id_artifact||((r=new u.Artifact).user=new s.Employee,r.id=t.id_artifact,r.name=t.name_artifact,r.UID=t.uid_artifact,r.status=t.agile_status_value,r.color=t.color,e&&(r.actualPoints=t.actual_points_artifact,r.expectedPoints=t.expected_points_artifact,r.user.firstName=t.fname_employee,r.user.lastName=t.lname_employee),i.push(r)),t.id_attribute&&(r[t.id_attribute]=t.attribute_value)}),n.next(i)},function(t){return n.error(t)},function(){return n.complete()})})},e.artifactById=function(t){return new c.Observable(function(e){a.query("SELECT ?? FROM light_artifact WHERE id_artifact=?;",[["id_artifact","id_project","parent_id_artifact","uid_artifact","name_artifact","desc_artifact","effectivedate_artifact","filepath_artifact","displayseq_artifact","comments_artifact","status_artifact","assignedto_artifact","expected_points_artifact","actual_points_artifact"],t.artifactId]).subscribe(function(t){var n=new u.Artifact;if(t.length){var r=t[0];n.id=r.id_artifact,n.projectId=r.id_project,n.parentId=r.parent_id_artifact,n.UID=r.uid_artifact,n.name=r.name_artifact,n.description=r.desc_artifact,n.effectiveDate=r.effectivedate_artifact,n.filePath=r.filepath_artifact,n.displaySequence=r.displayseq_artifact,n.comments=r.comments_artifact,n.status=r.status_artifact,n.assignedTo=r.assignedto_artifact,n.expectedPoints=r.expected_points_artifact,n.actualPoints=r.actual_points_artifact}e.next(n),e.complete()},function(t){return e.error(t)},function(){return e.complete()})})};var p=function(t,e){var n;return e.map(function(e){return n=new u.Artifact,t.forEach(function(t){switch(t){case"id_artifact":n.id=e[t];break;case"name_artifact":n.name=e[t];break;case"status_artifact":n.status=e[t];break;case"expected_points_artifact":n.expectedPoints=e[t];break;case"fname_employee":n.user||(n.user=new s.Employee),n.user.firstName=e[t];break;case"lname_employee":n.user||(n.user=new s.Employee),n.user.lastName=e[t]}}),n})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(36),o=r.Router();o.get("/statuses/byApplication/:applicationId",function(t,e,n){i.byApplication(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),i=n(2),o=n(37);e.byApplication=function(t){return new r.Observable(function(e){i.query("SELECT ?? FROM light_app_agile_status WHERE id_app=? AND active=1 ORDER BY order_status_value;",[["id_app_agile_status","agile_status_value"],t.applicationId]).subscribe(function(t){var n,r=[];t.forEach(function(t){(n=new o.ApplicationAgileStatus).id=t.id_app_agile_status,n.statusText=t.agile_status_value,r.push(n)}),e.next(r)},function(t){return e.error(t)},function(){return e.complete()})})}},function(t,e,n){"use strict";var r=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();Object.defineProperty(e,"__esModule",{value:!0});var i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r(e,t),e}(n(3).Base);e.ApplicationAgileStatus=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(39),o=r.Router();o.get("/recent-activity/byApplication/:applicationId",function(t,e,n){i.byApplication(t.params).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(2),i=n(7),o=n(1);e.byApplication=function(t){return new o.Observable(function(e){r.query("SELECT ?? FROM light_artifact_history WHERE id_app=? ORDER BY modified_date DESC LIMIT 10;",[["id_artifact","name_artifact"],t.applicationId]).subscribe(function(t){var n,r=[];t.forEach(function(t){(n=new i.Artifact).id=t.id_artifact,n.name=t.name_artifact,r.push(n)}),e.next(r)},function(t){return e.error(t)},function(){return e.complete()})})}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),i=n(41),o=r.Router();o.post("/fileupload",function(t,e,n){i.fileUpload(t,e).subscribe(function(t){return e.status(200).json(t)},function(t){return n(t)})}),e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(1),i=n(42),o=i({storage:i.diskStorage({destination:function(t,e,n){n(null,"./uploads/")},filename:function(t,e,n){Date.now();n(null,e.originalname)}})}).single("file");e.fileUpload=function(t,e){return new r.Observable(function(n){o(t,e,function(e){e?n.error(e):n.next(t.file.filename),n.complete()})})}},function(t,e){t.exports=require("multer")}]));