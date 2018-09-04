!function(e,t){for(var n in t)e[n]=t[n]}(exports,function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=require("express")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),o=n(2),s=n(3),r=n(4),a=n(7),u=n(9),c=n(11),l=n(13);o.config();var d=i();d.set("port",process.env.PORT||3e3),d.use(s.json()),d.use(s.urlencoded({extended:!0})),d.use(function(e,t,n){t.header("Access-Control-Allow-Origin","*"),t.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"),n()}),d.get("/",function(e,t,n){e.get("token")?n():t.status(401).json("un authorized")}),d.use("/",r.default),d.use("/employees",a.default),d.use("/applications",c.default),d.use("/projects",u.default),d.use("/artifacts",l.default),d.listen(d.get("port"),function(){console.log("App is running at http://localhost:%d in %s mode",d.get("port"),d.get("env"))}),e.exports=d},function(e,t){e.exports=require("dotenv")},function(e,t){e.exports=require("body-parser")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),o=n(5),s=i.Router();s.get("/authenticate",o.Authenticate),t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(6);t.Authenticate=function(e,t){t.setHeader("token",i.token),t.status(200).json({id:18,uid:"A010101",type:1,firstName:"Sankara",middleName:"Swaroop",lastName:"Asapu",email:"sankarasapu@gmail.com"})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.token="ABCD1234567890"},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),o=n(8),s=i.Router();s.get("/list",o.list),s.get("/create",o.create),s.get("/edit/:id",o.edit),s.get("/delete/:id",o.deletee),s.get("/:id",o.byId),t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.list=function(e,t){t.json({message:"Applications"})},t.create=function(e,t){t.json({message:"Create Application"})},t.edit=function(e,t){t.json({message:"Edit Application"})},t.deletee=function(e,t){t.json({message:"Delete Application"})},t.byId=function(e,t){t.status(200).json({id:31,uid:"A010101",type:1,firstName:"Sankara",middleName:"Swaroop",lastName:"Asapu",email:"sankarasapu@gmail.com"})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),o=n(10),s=i.Router();s.get("/list",o.list),s.get("/create",o.create),s.get("/edit/:id",o.edit),s.get("/delete/:id",o.deletee),s.get("/byApplication/:applicationId",o.byApplication),t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.list=function(e,t){t.json({message:"Applications"})},t.create=function(e,t){t.json({message:"Create Application"})},t.edit=function(e,t){t.json({message:"Edit Application"})},t.deletee=function(e,t){t.json({message:"Delete Application"})},t.byApplication=function(e,t){console.log(e);e.params.userId;t.status(200).json([{id:11,name:"Sprint 1"},{id:12,name:"Sprint 2"}])}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),o=n(12),s=i.Router();s.get("/list",o.list),s.get("/create",o.create),s.get("/edit/:id",o.edit),s.get("/delete/:id",o.deletee),s.get("/byUser/:userId",o.byUser),t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.list=function(e,t){t.json({message:"Applications"})},t.create=function(e,t){t.json({message:"Create Application"})},t.edit=function(e,t){t.json({message:"Edit Application"})},t.deletee=function(e,t){t.json({message:"Delete Application"})},t.byUser=function(e,t){console.log(e);e.params.userId;t.status(200).json([{id:16,name:"WindBricks"},{id:19,name:"Functional Test"}])}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),o=n(14),s=i.Router();s.get("/list",o.list),s.get("/create",o.create),s.get("/edit/:id",o.edit),s.get("/delete/:id",o.deletee),t.default=s},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.list=function(e,t){t.json({message:"Artifacts"})},t.create=function(e,t){t.json({message:"Create Artifact"})},t.edit=function(e,t){t.json({message:"Edit Artifact"})},t.deletee=function(e,t){t.json({message:"Delete Artifact"})}}]));