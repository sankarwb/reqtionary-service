(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/controllers/application-agile-status.controller.ts":
/*!****************************************************************!*\
  !*** ./app/controllers/application-agile-status.controller.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar application_agile_status_1 = __webpack_require__(/*! ../models/application-agile-status */ \"./app/models/application-agile-status.ts\");\nexports.byApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var sql = \"SELECT id_app_agile_status, agile_status_value FROM light_app_agile_status WHERE id_app=\" + req.applicationId + \" AND active=1 ORDER BY order_status_value;\";\n        sql_config_1.query(sql, null).subscribe(function (rows) {\n            var status, statuses = [];\n            rows.forEach(function (row) {\n                status = new application_agile_status_1.ApplicationAgileStatus();\n                status.id = row['id_app_agile_status'];\n                status.statusText = row['agile_status_value'];\n                statuses.push(status);\n            });\n            observer.next(statuses);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/application-agile-status.controller.ts?");

/***/ }),

/***/ "./app/controllers/application.controller.ts":
/*!***************************************************!*\
  !*** ./app/controllers/application.controller.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar application_1 = __webpack_require__(/*! ../models/application */ \"./app/models/application.ts\");\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nexports.byUser = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['id_app', 'name_app'], sql = \"SELECT ?? FROM light_app WHERE id_app IN (SELECT id_app FROM light_role_emp WHERE id_employee=? AND active=1 AND id_app!=0 AND active_app!=0 ORDER BY id_app)\";\n        sql_config_1.query(sql, [columns, req.userId]).subscribe(function (rows) {\n            var application, applications = [];\n            rows.forEach(function (app) {\n                application = new application_1.Application();\n                application.id = app['id_app'];\n                application.name = app['name_app'];\n                applications.push(application);\n            });\n            observer.next(applications);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/application.controller.ts?");

/***/ }),

/***/ "./app/controllers/artifact-history.controller.ts":
/*!********************************************************!*\
  !*** ./app/controllers/artifact-history.controller.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar artifact_1 = __webpack_require__(/*! ../models/artifact */ \"./app/models/artifact.ts\");\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nexports.byApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var sql = \"SELECT id_artifact, name_artifact FROM light_artifact_history WHERE id_app=\" + req.applicationId + \" ORDER BY modified_date DESC LIMIT 10;\";\n        sql_config_1.query(sql, null).subscribe(function (rows) {\n            var artifact, artifacts = [];\n            rows.forEach(function (row) {\n                artifact = new artifact_1.Artifact();\n                artifact.id = row['id_artifact'];\n                artifact.name = row['name_artifact'];\n                artifacts.push(artifact);\n            });\n            observer.next(artifacts);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/artifact-history.controller.ts?");

/***/ }),

/***/ "./app/controllers/artifact.controller.ts":
/*!************************************************!*\
  !*** ./app/controllers/artifact.controller.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar artifact_1 = __webpack_require__(/*! ../models/artifact */ \"./app/models/artifact.ts\");\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nexports.parentArtifactsByApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var sql = \"SELECT id_artifact, name_artifact FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=\" + req.applicationId + \");\";\n        sql_config_1.query(sql, null).subscribe(function (rows) {\n            var artifact, artifacts = [];\n            rows.forEach(function (row) {\n                artifact = new artifact_1.Artifact();\n                artifact.id = row['id_artifact'];\n                artifact.name = row['name_artifact'];\n                artifacts.push(artifact);\n            });\n            observer.next(artifacts);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\nexports.artifacts = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var sql = \"SELECT id_artifact, name_artifact, status_artifact FROM light_artifact WHERE id_app=\" + req.applicationId + \" AND id_project=\" + req.projectId + \";\";\n        sql_config_1.query(sql, null).subscribe(function (rows) {\n            var artifact, artifacts = [];\n            rows.forEach(function (row) {\n                artifact = new artifact_1.Artifact();\n                artifact.id = row['id_artifact'];\n                artifact.name = row['name_artifact'];\n                artifact.status = row['status_artifact'];\n                artifacts.push(artifact);\n            });\n            observer.next(artifacts);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/artifact.controller.ts?");

/***/ }),

/***/ "./app/controllers/auth.controller.ts":
/*!********************************************!*\
  !*** ./app/controllers/auth.controller.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar tokenization_1 = __webpack_require__(/*! ../utils/tokenization */ \"./app/utils/tokenization.ts\");\nexports.Authenticate = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var token = tokenization_1.sign(), sql = \"SELECT * FROM light_employee WHERE email_employee=? AND password=password(?)\";\n        observer.next({\n            id: 31,\n            uid: 'A010101',\n            type: 1,\n            firstName: 'Sankara',\n            middleName: 'Swaroop',\n            lastName: 'Asapu',\n            email: 'sankarasapu@gmail.com',\n            token: token,\n            expires: 60\n        });\n        observer.complete();\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/auth.controller.ts?");

/***/ }),

/***/ "./app/controllers/employee.controller.ts":
/*!************************************************!*\
  !*** ./app/controllers/employee.controller.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar employee_1 = __webpack_require__(/*! ../models/employee */ \"./app/models/employee.ts\");\nexports.byId = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        observer.next({\n            id: 31,\n            uid: 'A010101',\n            type: 1,\n            firstName: 'Sankara',\n            middleName: 'Swaroop',\n            lastName: 'Asapu',\n            email: 'sankarasapu@gmail.com',\n        });\n        observer.complete();\n    });\n};\nexports.byApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var sql = \"SELECT fname_employee, lname_employee, LE.id_employee FROM light_employee LE LEFT JOIN light_role_emp LRE ON LE.id_employee=LRE.id_employee WHERE id_project IN (SELECT id_project FROM light_project WHERE id_app=\" + req.applicationId + \") GROUP BY id_employee;\";\n        sql_config_1.query(sql, null).subscribe(function (rows) {\n            var employee, employees = [];\n            rows.forEach(function (reqtypeObj) {\n                employee = new employee_1.Employee();\n                employee.id = reqtypeObj['id_employee'];\n                employee.firstName = reqtypeObj['fname_employee'];\n                employee.lastName = reqtypeObj['lname_employee'];\n                employees.push(employee);\n            });\n            observer.next(employees);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/employee.controller.ts?");

/***/ }),

/***/ "./app/controllers/project.controller.ts":
/*!***********************************************!*\
  !*** ./app/controllers/project.controller.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar project_1 = __webpack_require__(/*! ../models/project */ \"./app/models/project.ts\");\nvar release_1 = __webpack_require__(/*! ../models/release */ \"./app/models/release.ts\");\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nexports.byUserAndApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['LPR.id_release', 'name_release', 'active_release', 'active_project', 'type_release', 'type_project', 'LP.id_project', 'LP.name_project', 'LP.active_project'], sql = \"SELECT ?? FROM light_project_release LPR LEFT JOIN light_project LP ON LPR.id_release=LP.id_release LEFT JOIN light_role_emp LRE ON LP.id_project=LRE.id_project WHERE LPR.active_release=1 AND LP.id_app=? AND id_employee=? ORDER BY LPR.id_release,LP.id_project;\";\n        sql_config_1.query(sql, [columns, req.applicationId, req.userId]).subscribe(function (rows) {\n            var project, release, releases = [];\n            rows.forEach(function (row) {\n                if (!release || release.id !== row['id_release']) {\n                    release = new release_1.Release();\n                    release.id = row['id_release'];\n                    release.name = row['name_release'];\n                    release.type = row['type_release'];\n                    release.active = row['active_release'];\n                    release.projects = [];\n                    releases.push(release);\n                }\n                project = new project_1.Project();\n                project.id = row['id_project'];\n                project.name = row['name_project'];\n                project.active = row['active_project'];\n                project.type = row['type_project'];\n                project.active = row['active_project'];\n                release.projects.push(project);\n            });\n            observer.next(releases);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/project.controller.ts?");

/***/ }),

/***/ "./app/controllers/requirement-type.controller.ts":
/*!********************************************************!*\
  !*** ./app/controllers/requirement-type.controller.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar requirement_type_1 = __webpack_require__(/*! ../models/requirement-type */ \"./app/models/requirement-type.ts\");\nexports.byApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var sql = \"SELECT LO.id_object, name_object, color, code_object FROM light_object LO LEFT JOIN light_app_object_attribute LAOA ON LO.id_object=LAOA.id_object WHERE LAOA.id_app=\" + req.applicationId + \" and LAOA.active=1 group by LO.id_object order by LO.id_object;\";\n        sql_config_1.query(sql, null).subscribe(function (rows) {\n            var reqtype, reqtypes = [];\n            rows.forEach(function (reqtypeObj) {\n                reqtype = new requirement_type_1.RequirementType();\n                reqtype.id = reqtypeObj['id_object'];\n                reqtype.name = reqtypeObj['name_object'];\n                reqtype.color = reqtypeObj['color'];\n                reqtype.code = reqtypeObj['code_object'];\n                reqtypes.push(reqtype);\n            });\n            observer.next(reqtypes);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/requirement-type.controller.ts?");

/***/ }),

/***/ "./app/middleware/app-routes.ts":
/*!**************************************!*\
  !*** ./app/middleware/app-routes.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar paths = '<ul>';\nexports.print = function (path, layer) {\n    if (layer.route) {\n        layer.route.stack.forEach(exports.print.bind(null, path.concat(split(layer.route.path))));\n    }\n    else if (layer.name === 'router' && layer.handle.stack) {\n        layer.handle.stack.forEach(exports.print.bind(null, path.concat(split(layer.regexp))));\n    }\n    else if (layer.method) {\n        var route = path.concat(split(layer.regexp)).filter(Boolean).join('/');\n        paths += \"<li>\" + layer.method.toUpperCase() + \": <a href=\\\"http://localhost:3000/\" + route + \"\\\" target=\\\"_blank\\\">/\" + route + \"</a></li>\";\n    }\n};\nvar split = function (thing) {\n    if (typeof thing === 'string') {\n        return thing.split('/');\n    }\n    else if (thing.fast_slash) {\n        return '';\n    }\n    else {\n        var match = thing.toString()\n            .replace('\\\\/?', '')\n            .replace('(?=\\\\/|$)', '$')\n            .match(/^\\/\\^((?:\\\\[.*+?^${}()|[\\]\\\\\\/]|[^.*+?^${}()|[\\]\\\\\\/])*)\\$\\//);\n        return match\n            ? match[1].replace(/\\\\(.)/g, '$1').split('/')\n            : '<complex:' + thing.toString() + '>';\n    }\n};\nexports.getPaths = function () {\n    return paths;\n};\n\n\n//# sourceURL=webpack:///./app/middleware/app-routes.ts?");

/***/ }),

/***/ "./app/models/application-agile-status.ts":
/*!************************************************!*\
  !*** ./app/models/application-agile-status.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar base_model_1 = __webpack_require__(/*! ./base.model */ \"./app/models/base.model.ts\");\nvar ApplicationAgileStatus = (function (_super) {\n    __extends(ApplicationAgileStatus, _super);\n    function ApplicationAgileStatus() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    return ApplicationAgileStatus;\n}(base_model_1.Base));\nexports.ApplicationAgileStatus = ApplicationAgileStatus;\n\n\n//# sourceURL=webpack:///./app/models/application-agile-status.ts?");

/***/ }),

/***/ "./app/models/application.ts":
/*!***********************************!*\
  !*** ./app/models/application.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar base_model_1 = __webpack_require__(/*! ./base.model */ \"./app/models/base.model.ts\");\nvar Application = (function (_super) {\n    __extends(Application, _super);\n    function Application() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    return Application;\n}(base_model_1.Base));\nexports.Application = Application;\n\n\n//# sourceURL=webpack:///./app/models/application.ts?");

/***/ }),

/***/ "./app/models/artifact.ts":
/*!********************************!*\
  !*** ./app/models/artifact.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar base_model_1 = __webpack_require__(/*! ./base.model */ \"./app/models/base.model.ts\");\nvar Artifact = (function (_super) {\n    __extends(Artifact, _super);\n    function Artifact() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    return Artifact;\n}(base_model_1.Base));\nexports.Artifact = Artifact;\n\n\n//# sourceURL=webpack:///./app/models/artifact.ts?");

/***/ }),

/***/ "./app/models/base.model.ts":
/*!**********************************!*\
  !*** ./app/models/base.model.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Base = (function () {\n    function Base() {\n    }\n    Object.defineProperty(Base.prototype, \"active\", {\n        get: function () {\n            return this._active;\n        },\n        set: function (value) {\n            this._active = !!value;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    return Base;\n}());\nexports.Base = Base;\n\n\n//# sourceURL=webpack:///./app/models/base.model.ts?");

/***/ }),

/***/ "./app/models/employee.ts":
/*!********************************!*\
  !*** ./app/models/employee.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar base_model_1 = __webpack_require__(/*! ./base.model */ \"./app/models/base.model.ts\");\nvar Employee = (function (_super) {\n    __extends(Employee, _super);\n    function Employee() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    return Employee;\n}(base_model_1.Base));\nexports.Employee = Employee;\n\n\n//# sourceURL=webpack:///./app/models/employee.ts?");

/***/ }),

/***/ "./app/models/project.ts":
/*!*******************************!*\
  !*** ./app/models/project.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar base_model_1 = __webpack_require__(/*! ./base.model */ \"./app/models/base.model.ts\");\nvar Project = (function (_super) {\n    __extends(Project, _super);\n    function Project() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    return Project;\n}(base_model_1.Base));\nexports.Project = Project;\n\n\n//# sourceURL=webpack:///./app/models/project.ts?");

/***/ }),

/***/ "./app/models/release.ts":
/*!*******************************!*\
  !*** ./app/models/release.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar project_1 = __webpack_require__(/*! ./project */ \"./app/models/project.ts\");\nvar Release = (function (_super) {\n    __extends(Release, _super);\n    function Release() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    return Release;\n}(project_1.Project));\nexports.Release = Release;\n\n\n//# sourceURL=webpack:///./app/models/release.ts?");

/***/ }),

/***/ "./app/models/requirement-type.ts":
/*!****************************************!*\
  !*** ./app/models/requirement-type.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar base_model_1 = __webpack_require__(/*! ./base.model */ \"./app/models/base.model.ts\");\nvar RequirementType = (function (_super) {\n    __extends(RequirementType, _super);\n    function RequirementType() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    return RequirementType;\n}(base_model_1.Base));\nexports.RequirementType = RequirementType;\n\n\n//# sourceURL=webpack:///./app/models/requirement-type.ts?");

/***/ }),

/***/ "./app/routes/application-agile-status.route.ts":
/*!******************************************************!*\
  !*** ./app/routes/application-agile-status.route.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar application_agile_status_controller_1 = __webpack_require__(/*! ../controllers/application-agile-status.controller */ \"./app/controllers/application-agile-status.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/statuses/byApplication/:applicationId', function (req, res, next) {\n    application_agile_status_controller_1.byApplication(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/application-agile-status.route.ts?");

/***/ }),

/***/ "./app/routes/application.route.ts":
/*!*****************************************!*\
  !*** ./app/routes/application.route.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar application_controller_1 = __webpack_require__(/*! ../controllers/application.controller */ \"./app/controllers/application.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/byUser/:userId', function (req, res, next) {\n    application_controller_1.byUser(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/application.route.ts?");

/***/ }),

/***/ "./app/routes/artifact-history.route.ts":
/*!**********************************************!*\
  !*** ./app/routes/artifact-history.route.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar artifact_history_controller_1 = __webpack_require__(/*! ../controllers/artifact-history.controller */ \"./app/controllers/artifact-history.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/recent-activity/byApplication/:applicationId', function (req, res, next) {\n    artifact_history_controller_1.byApplication(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/artifact-history.route.ts?");

/***/ }),

/***/ "./app/routes/artifact.route.ts":
/*!**************************************!*\
  !*** ./app/routes/artifact.route.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar artifact_controller_1 = __webpack_require__(/*! ../controllers/artifact.controller */ \"./app/controllers/artifact.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/parent/byApplication/:applicationId', function (req, res, next) {\n    artifact_controller_1.parentArtifactsByApplication(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/:applicationId/:projectId', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/:applicationId/:projectId/:parentArtifactId', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/:applicationId/:projectId/:assignedTo', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/:applicationId/:projectId/:parentArtifactId/:assignedTo', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/artifact.route.ts?");

/***/ }),

/***/ "./app/routes/auth.route.ts":
/*!**********************************!*\
  !*** ./app/routes/auth.route.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar auth_controller_1 = __webpack_require__(/*! ../controllers/auth.controller */ \"./app/controllers/auth.controller.ts\");\nvar router = express_1.Router();\nrouter.post('/authenticate', function (req, res, next) {\n    auth_controller_1.Authenticate(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/auth.route.ts?");

/***/ }),

/***/ "./app/routes/employee.route.ts":
/*!**************************************!*\
  !*** ./app/routes/employee.route.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar employee_controller_1 = __webpack_require__(/*! ../controllers/employee.controller */ \"./app/controllers/employee.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/:id', function (req, res, next) {\n    employee_controller_1.byId(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/byApplication/:applicationId', function (req, res, next) {\n    employee_controller_1.byApplication(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/employee.route.ts?");

/***/ }),

/***/ "./app/routes/project.route.ts":
/*!*************************************!*\
  !*** ./app/routes/project.route.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar project_controller_1 = __webpack_require__(/*! ../controllers/project.controller */ \"./app/controllers/project.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/byApplication/:userId/:applicationId', function (req, res, next) {\n    project_controller_1.byUserAndApplication(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/project.route.ts?");

/***/ }),

/***/ "./app/routes/requirement-type.route.ts":
/*!**********************************************!*\
  !*** ./app/routes/requirement-type.route.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar requirement_type_controller_1 = __webpack_require__(/*! ../controllers/requirement-type.controller */ \"./app/controllers/requirement-type.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/byApplication/:applicationId', function (req, res, next) {\n    requirement_type_controller_1.byApplication(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/requirement-type.route.ts?");

/***/ }),

/***/ "./app/utils/tokenization.ts":
/*!***********************************!*\
  !*** ./app/utils/tokenization.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nvar secret_1 = __webpack_require__(/*! ../../config/secret */ \"./config/secret.ts\");\nvar expressJWT = __webpack_require__(/*! express-jwt */ \"express-jwt\");\nexports.sign = function () {\n    var token = jwt.sign({ name: 'sankara asapu', exp: 60 }, secret_1.secret);\n    return token;\n};\nexports.valid = expressJWT({\n    secret: secret_1.secret\n});\n\n\n//# sourceURL=webpack:///./app/utils/tokenization.ts?");

/***/ }),

/***/ "./config/secret.ts":
/*!**************************!*\
  !*** ./config/secret.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.secret = 'ABCD1234567890';\n\n\n//# sourceURL=webpack:///./config/secret.ts?");

/***/ }),

/***/ "./config/sql.config.ts":
/*!******************************!*\
  !*** ./config/sql.config.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar mysql_1 = __webpack_require__(/*! mysql */ \"mysql\");\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar pool = mysql_1.createPool({\n    connectionLimit: 1000,\n    host: '127.0.0.1',\n    user: 'root',\n    password: 'Sowjanya$123',\n    database: 'light_insurance',\n    multipleStatements: true\n});\nexports.multiQuery = function (sqlQuery, params, callback) {\n    var conn = mysql_1.createConnection({\n        host: '127.0.0.1',\n        user: 'root',\n        password: 'Sowjanya$123',\n        database: 'light_insurance',\n        multipleStatements: true\n    });\n    return new rxjs_1.Observable(function (observer) {\n        var q = conn.query(sqlQuery, params, function (err, rows) {\n            if (err) {\n                observer.error(err);\n            }\n            else {\n                observer.next(rows);\n            }\n            observer.complete();\n        });\n        console.log(q.sql);\n        console.log(\"---------------------------------------------------------------------------------------------------------------------\");\n    });\n};\nexports.query = function (sqlQuery, params) {\n    return new rxjs_1.Observable(function (observer) {\n        pool.getConnection(function (err, conn) {\n            if (err) {\n                observer.error(err);\n                observer.complete();\n            }\n            else {\n                var q = conn.query(sqlQuery, params, function (err, rows) {\n                    if (err) {\n                        observer.error(err);\n                    }\n                    else {\n                        observer.next(rows);\n                    }\n                    conn.release();\n                    observer.complete();\n                });\n                console.log(\"---------------------------------------------------------------------------------------------------------------------\");\n                console.log(q.sql);\n            }\n        });\n    });\n};\n\n\n//# sourceURL=webpack:///./config/sql.config.ts?");

/***/ }),

/***/ "./server.ts":
/*!*******************!*\
  !*** ./server.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express = __webpack_require__(/*! express */ \"express\");\nvar bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\nvar cookieParser = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\nvar tokenization_1 = __webpack_require__(/*! ./app/utils/tokenization */ \"./app/utils/tokenization.ts\");\nvar app_routes_1 = __webpack_require__(/*! ./app/middleware/app-routes */ \"./app/middleware/app-routes.ts\");\nvar auth_route_1 = __webpack_require__(/*! ./app/routes/auth.route */ \"./app/routes/auth.route.ts\");\nvar employee_route_1 = __webpack_require__(/*! ./app/routes/employee.route */ \"./app/routes/employee.route.ts\");\nvar project_route_1 = __webpack_require__(/*! ./app/routes/project.route */ \"./app/routes/project.route.ts\");\nvar application_route_1 = __webpack_require__(/*! ./app/routes/application.route */ \"./app/routes/application.route.ts\");\nvar requirement_type_route_1 = __webpack_require__(/*! ./app/routes/requirement-type.route */ \"./app/routes/requirement-type.route.ts\");\nvar artifact_route_1 = __webpack_require__(/*! ./app/routes/artifact.route */ \"./app/routes/artifact.route.ts\");\nvar application_agile_status_route_1 = __webpack_require__(/*! ./app/routes/application-agile-status.route */ \"./app/routes/application-agile-status.route.ts\");\nvar artifact_history_route_1 = __webpack_require__(/*! ./app/routes/artifact-history.route */ \"./app/routes/artifact-history.route.ts\");\nvar app = express();\napp.set('port', process.env.PORT || 3000);\napp.use(bodyParser.json());\napp.use(bodyParser.urlencoded({ extended: true }));\napp.use(function (req, res, next) {\n    res.header(\"Access-Control-Allow-Origin\", \"*\");\n    res.header(\"Access-Control-Allow-Headers\", \"Origin, X-Requested-With, Content-Type, Accept, Authorization\");\n    next();\n});\napp.route('/').get(tokenization_1.valid, function (req, res, next) {\n    var token = req.get('token');\n    if (!token) {\n        res.status(401).json('un authorized');\n    }\n    else {\n        next();\n    }\n});\napp.use('/', auth_route_1.default);\napp.use('/employees', employee_route_1.default);\napp.use('/applications', application_route_1.default);\napp.use('/projects', project_route_1.default);\napp.use('/requirement-type', requirement_type_route_1.default);\napp.use('/application-agile-status', application_agile_status_route_1.default);\napp.use('/artifacts', artifact_route_1.default);\napp.use('/artifact-history', artifact_history_route_1.default);\napp.route('/routes').get(function (req, res, next) {\n    app._router.stack.forEach(app_routes_1.print.bind(null, []));\n    res.status(200).send(app_routes_1.getPaths());\n});\napp.use(function (err, req, res, next) {\n    if (err.sqlMessage) {\n        console.error(err.sqlMessage);\n    }\n    next(err);\n});\napp.use(function (err, req, res, next) {\n    console.error(err.stack);\n    next(err);\n});\napp.use(function (err, req, res, next) {\n    if (err.name === 'UnauthorizedError') {\n        res.status(401).send('Un Authorized');\n    }\n    res.status(500).send('Something went wrong');\n});\napp.listen(app.get('port'), function () {\n    console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));\n});\nmodule.exports = app;\n\n\n//# sourceURL=webpack:///./server.ts?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cookie-parser\");\n\n//# sourceURL=webpack:///external_%22cookie-parser%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-jwt":
/*!******************************!*\
  !*** external "express-jwt" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-jwt\");\n\n//# sourceURL=webpack:///external_%22express-jwt%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mysql\");\n\n//# sourceURL=webpack:///external_%22mysql%22?");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"rxjs\");\n\n//# sourceURL=webpack:///external_%22rxjs%22?");

/***/ })

/******/ })));