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
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar application_agile_status_1 = __webpack_require__(/*! ../models/application-agile-status */ \"./app/models/application-agile-status.ts\");\nexports.byApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['id_app_agile_status', 'agile_status_value'], sql = \"SELECT ?? FROM light_app_agile_status WHERE id_app=? AND active=1 ORDER BY order_status_value;\";\n        sql_config_1.query(sql, [columns, req.applicationId]).subscribe(function (rows) {\n            var status, statuses = [];\n            rows.forEach(function (row) {\n                status = new application_agile_status_1.ApplicationAgileStatus();\n                status.id = row['id_app_agile_status'];\n                status.statusText = row['agile_status_value'];\n                statuses.push(status);\n            });\n            observer.next(statuses);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/application-agile-status.controller.ts?");

/***/ }),

/***/ "./app/controllers/application.controller.ts":
/*!***************************************************!*\
  !*** ./app/controllers/application.controller.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar application_1 = __webpack_require__(/*! ../models/application */ \"./app/models/application.ts\");\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nexports.byEmployee = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['id_app', 'name_app'], sql = \"SELECT ?? FROM light_app WHERE id_app IN (SELECT id_app FROM light_role_emp WHERE id_employee=? AND active=1 AND id_app!=0) AND active_app!=0 ORDER BY modified_date DESC;\";\n        sql_config_1.query(sql, [columns, req.employeeId]).subscribe(function (rows) {\n            var application, applications = [];\n            rows.forEach(function (app) {\n                application = new application_1.Application();\n                application.id = app['id_app'];\n                application.name = app['name_app'];\n                applications.push(application);\n            });\n            observer.next(applications);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/application.controller.ts?");

/***/ }),

/***/ "./app/controllers/artifact-history.controller.ts":
/*!********************************************************!*\
  !*** ./app/controllers/artifact-history.controller.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar artifact_1 = __webpack_require__(/*! ../models/artifact */ \"./app/models/artifact.ts\");\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nexports.byApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['id_artifact', 'name_artifact'], sql = \"SELECT ?? FROM light_artifact_history WHERE id_app=? ORDER BY modified_date DESC LIMIT 10;\";\n        sql_config_1.query(sql, [columns, req.applicationId]).subscribe(function (rows) {\n            var artifact, artifacts = [];\n            rows.forEach(function (row) {\n                artifact = new artifact_1.Artifact();\n                artifact.id = row['id_artifact'];\n                artifact.name = row['name_artifact'];\n                artifacts.push(artifact);\n            });\n            observer.next(artifacts);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/artifact-history.controller.ts?");

/***/ }),

/***/ "./app/controllers/artifact.controller.ts":
/*!************************************************!*\
  !*** ./app/controllers/artifact.controller.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nvar _this = this;\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar artifact_1 = __webpack_require__(/*! ../models/artifact */ \"./app/models/artifact.ts\");\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar employee_1 = __webpack_require__(/*! ../models/employee */ \"./app/models/employee.ts\");\nexports.parentArtifacts = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['id_artifact', 'name_artifact'], sql = \"SELECT ?? FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=?);\";\n        sql_config_1.query(sql, [columns, req.applicationId]).subscribe(function (rows) {\n            observer.next(processResponse(columns, rows));\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\nexports.parentArtifactsByApplicationAsync = function (req) { return __awaiter(_this, void 0, void 0, function () {\n    var columns, sql, rows, err_1;\n    return __generator(this, function (_a) {\n        switch (_a.label) {\n            case 0:\n                columns = ['id_artifact', 'name_artifact'], sql = \"SELECT ?? FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=?);\";\n                _a.label = 1;\n            case 1:\n                _a.trys.push([1, 3, , 4]);\n                return [4, sql_config_1.queryAsync(sql, [columns, req.applicationId])];\n            case 2:\n                rows = _a.sent();\n                return [2, rows];\n            case 3:\n                err_1 = _a.sent();\n                throw err_1;\n            case 4: return [2];\n        }\n    });\n}); };\nexports.artifacts = function (req, agile) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['LA.id_artifact', 'name_artifact', 'uid_artifact', 'agile_status_value', 'color'], sql = '';\n        if (agile) {\n            columns = columns.concat(['expected_points_artifact', 'actual_points_artifact', 'fname_employee', 'lname_employee']);\n            sql = \"SELECT ?? FROM light_artifact LA LEFT JOIN light_employee LE ON LA.assignedto_artifact=LE.id_employee\";\n        }\n        else {\n            columns = columns.concat(['id_attribute', 'id_app_object_attribute', 'attribute_value']);\n            sql = \"SELECT ?? FROM light_artifact LA LEFT JOIN light_artifact_attribute LAA ON LA.id_artifact=LAA.id_artifact\";\n        }\n        sql += \" LEFT JOIN light_object LO ON LA.id_object=LO.id_object LEFT JOIN light_app_agile_status LAAS ON LA.status_artifact=LAAS.id_app_agile_status WHERE LA.id_app=? AND id_project=? AND LA.id_object=?\" + (req.parentArtifactId ? ' AND parent_id_artifact=?' : '') + (req.assignedTo ? ' AND assignedto_artifact=?' : '');\n        sql_config_1.query(sql, [columns, req.applicationId, req.projectId, req.requirementTypeId, req.parentArtifactId, req.assignedTo]).subscribe(function (rows) {\n            var artifact, artifacts = [];\n            rows.forEach(function (row) {\n                if (!artifact || artifact.id !== row['id_artifact']) {\n                    artifact = new artifact_1.Artifact();\n                    artifact.user = new employee_1.Employee();\n                    artifact.id = row['id_artifact'];\n                    artifact.name = row['name_artifact'];\n                    artifact.UID = row['uid_artifact'];\n                    artifact.status = row['agile_status_value'];\n                    artifact['color'] = row['color'];\n                    if (agile) {\n                        artifact.actualPoints = row['actual_points_artifact'];\n                        artifact.expectedPoints = row['expected_points_artifact'];\n                        artifact.user.firstName = row['fname_employee'];\n                        artifact.user.lastName = row['lname_employee'];\n                    }\n                    artifacts.push(artifact);\n                }\n                if (row['id_attribute']) {\n                    artifact[row['id_attribute']] = row['attribute_value'];\n                }\n            });\n            observer.next(artifacts);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\nexports.artifactById = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['id_artifact', 'id_project', 'parent_id_artifact', 'uid_artifact', 'name_artifact',\n            'desc_artifact', 'effectivedate_artifact', 'filepath_artifact', 'displayseq_artifact', 'comments_artifact',\n            'status_artifact', 'assignedto_artifact', 'expected_points_artifact', 'actual_points_artifact'], sql = 'SELECT ?? FROM light_artifact WHERE id_artifact=?;';\n        sql_config_1.query(sql, [columns, req.artifactId]).subscribe(function (rows) {\n            var artifact = new artifact_1.Artifact();\n            if (rows.length) {\n                var row = rows[0];\n                artifact.id = row['id_artifact'];\n                artifact.projectId = row['id_project'];\n                artifact.parentId = row['parent_id_artifact'];\n                artifact.UID = row['uid_artifact'];\n                artifact.name = row['name_artifact'];\n                artifact.description = row['desc_artifact'];\n                artifact.effectiveDate = row['effectivedate_artifact'];\n                artifact.filePath = row['filepath_artifact'];\n                artifact.displaySequence = row['displayseq_artifact'];\n                artifact.comments = row['comments_artifact'];\n                artifact.status = row['status_artifact'];\n                artifact.assignedTo = row['assignedto_artifact'];\n                artifact.expectedPoints = row['expected_points_artifact'];\n                artifact.actualPoints = row['actual_points_artifact'];\n            }\n            observer.next(artifact);\n            observer.complete();\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\nvar processResponse = function (columns, rows) {\n    var artifact, artifacts = [];\n    return rows.map(function (row) {\n        artifact = new artifact_1.Artifact();\n        columns.forEach(function (column) {\n            switch (column) {\n                case 'id_artifact':\n                    artifact.id = row[column];\n                    break;\n                case 'name_artifact':\n                    artifact.name = row[column];\n                    break;\n                case 'status_artifact':\n                    artifact.status = row[column];\n                    break;\n                case 'expected_points_artifact':\n                    artifact.expectedPoints = row[column];\n                    break;\n                case 'fname_employee':\n                    if (!artifact.user)\n                        artifact.user = new employee_1.Employee();\n                    artifact.user.firstName = row[column];\n                    break;\n                case 'lname_employee':\n                    if (!artifact.user)\n                        artifact.user = new employee_1.Employee();\n                    artifact.user.lastName = row[column];\n                    break;\n            }\n        });\n        return artifact;\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/artifact.controller.ts?");

/***/ }),

/***/ "./app/controllers/attribute.controller.ts":
/*!*************************************************!*\
  !*** ./app/controllers/attribute.controller.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar attribute_1 = __webpack_require__(/*! ../models/attribute */ \"./app/models/attribute.ts\");\nexports.byApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['LA.id_attribute', 'name_attribute', 'type_attribute', 'system_attribute'], sql = \"SELECT ?? FROM light_app_object_attribute LAOA LEFT JOIN light_object_attribute LOA ON LAOA.id_object_attribute=LOA.id_object_attribute LEFT JOIN light_attribute LA ON LOA.id_attribute=LA.id_attribute WHERE LAOA.id_app=?\" + (req.requirementTypeId ? ' AND LAOA.id_object=?' : '') + \" AND LAOA.active=1;\";\n        sql_config_1.query(sql, [columns, req.applicationId, req.requirementTypeId]).subscribe(function (rows) {\n            var attribute, attributes = [];\n            rows.forEach(function (row) {\n                if (row['id_attribute']) {\n                    attribute = new attribute_1.Attribute();\n                    attribute.id = row['id_attribute'];\n                    attribute.name = row['name_attribute'];\n                    attribute.type = row['type_attribute'];\n                    attribute.system = row['system_attribute'];\n                    attributes.push(attribute);\n                }\n            });\n            observer.next(attributes);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/attribute.controller.ts?");

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
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar employee_1 = __webpack_require__(/*! ../models/employee */ \"./app/models/employee.ts\");\nexports.byId = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        observer.next({\n            id: 33,\n            uid: 'A010101',\n            type: 1,\n            firstName: 'Sankara',\n            middleName: 'Swaroop',\n            lastName: 'Asapu',\n            email: 'sankarasapu@gmail.com',\n        });\n        observer.complete();\n    });\n};\nexports.byApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['fname_employee', 'lname_employee', 'LE.id_employee'], sql = \"SELECT ?? FROM light_employee LE LEFT JOIN light_role_emp LRE ON LE.id_employee=LRE.id_employee WHERE id_app=? GROUP BY id_employee;\";\n        sql_config_1.query(sql, [columns, req.applicationId]).subscribe(function (rows) {\n            var employee, employees = [];\n            rows.forEach(function (reqtypeObj) {\n                employee = new employee_1.Employee();\n                employee.id = reqtypeObj['id_employee'];\n                employee.firstName = reqtypeObj['fname_employee'];\n                employee.lastName = reqtypeObj['lname_employee'];\n                employees.push(employee);\n            });\n            observer.next(employees);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/employee.controller.ts?");

/***/ }),

/***/ "./app/controllers/project.controller.ts":
/*!***********************************************!*\
  !*** ./app/controllers/project.controller.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar project_1 = __webpack_require__(/*! ../models/project */ \"./app/models/project.ts\");\nvar release_1 = __webpack_require__(/*! ../models/release */ \"./app/models/release.ts\");\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nexports.projectsGroupbyRelease = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['LPR.id_release', 'name_release', 'active_release', 'active_project', 'type_release', 'type_project', 'LP.id_project', 'LP.name_project', 'LP.active_project'], sql = \"SELECT ??, IFNULL(SUM(expected_points_artifact),0) expected, IFNULL(SUM(actual_points_artifact),0) actual FROM light_project_release LPR LEFT JOIN light_project LP ON LPR.id_release=LP.id_release LEFT JOIN light_artifact LA ON LA.id_project=LP.id_project WHERE LPR.active_release=1 AND LP.id_app=? GROUP BY id_project ORDER BY LPR.id_release,LP.id_project;\";\n        sql_config_1.query(sql, [columns, req.applicationId]).subscribe(function (rows) {\n            var project, release, releases = [];\n            rows.forEach(function (row) {\n                if (!release || release.id !== row['id_release']) {\n                    release = new release_1.Release();\n                    release.id = row['id_release'];\n                    release.name = row['name_release'];\n                    release.type = row['type_release'];\n                    release.active = row['active_release'];\n                    release.projects = [];\n                    releases.push(release);\n                }\n                project = new project_1.Project();\n                project.id = row['id_project'];\n                project.name = row['name_project'];\n                project.active = row['active_project'];\n                project.type = row['type_project'];\n                project.active = row['active_project'];\n                project.expected = row['expected'];\n                project.actual = row['actual'];\n                release.projects.push(project);\n            });\n            observer.next(releases);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/project.controller.ts?");

/***/ }),

/***/ "./app/controllers/requirement-type.controller.ts":
/*!********************************************************!*\
  !*** ./app/controllers/requirement-type.controller.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar sql_config_1 = __webpack_require__(/*! ../../config/sql.config */ \"./config/sql.config.ts\");\nvar requirement_type_1 = __webpack_require__(/*! ../models/requirement-type */ \"./app/models/requirement-type.ts\");\nexports.byApplication = function (req) {\n    return new rxjs_1.Observable(function (observer) {\n        var columns = ['LO.id_object', 'name_object', 'color', 'code_object'], sql = \"SELECT ?? FROM light_object LO LEFT JOIN light_app_object_attribute LAOA ON LO.id_object=LAOA.id_object WHERE LAOA.id_app=? and LAOA.active=1 group by LO.id_object order by LO.id_object;\";\n        sql_config_1.query(sql, [columns, req.applicationId]).subscribe(function (rows) {\n            var reqtype, reqtypes = [];\n            rows.forEach(function (reqtypeObj) {\n                reqtype = new requirement_type_1.RequirementType();\n                reqtype.id = reqtypeObj['id_object'];\n                reqtype.name = reqtypeObj['name_object'];\n                reqtype.color = reqtypeObj['color'];\n                reqtype.code = reqtypeObj['code_object'];\n                reqtypes.push(reqtype);\n            });\n            observer.next(reqtypes);\n        }, function (err) { return observer.error(err); }, function () { return observer.complete(); });\n    });\n};\n\n\n//# sourceURL=webpack:///./app/controllers/requirement-type.controller.ts?");

/***/ }),

/***/ "./app/middleware/app-routes.ts":
/*!**************************************!*\
  !*** ./app/middleware/app-routes.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar paths = '<ul>';\nexports.print = function (path, layer) {\n    if (layer.route) {\n        layer.route.stack.forEach(exports.print.bind(null, path.concat(split(layer.route.path))));\n    }\n    else if (layer.name === 'router' && layer.handle.stack) {\n        layer.handle.stack.forEach(exports.print.bind(null, path.concat(split(layer.regexp))));\n    }\n    else if (layer.method) {\n        var route = path.concat(split(layer.regexp)).filter(Boolean).join('/');\n        paths += \"<li>\" + layer.method.toUpperCase() + \": <a href=\\\"http://localhost:\" + (process.env.PORT || 3000) + \"/\" + route + \"\\\" target=\\\"_blank\\\">/\" + route + \"</a></li>\";\n    }\n};\nvar split = function (thing) {\n    if (typeof thing === 'string') {\n        return thing.split('/');\n    }\n    else if (thing.fast_slash) {\n        return '';\n    }\n    else {\n        var match = thing.toString()\n            .replace('\\\\/?', '')\n            .replace('(?=\\\\/|$)', '$')\n            .match(/^\\/\\^((?:\\\\[.*+?^${}()|[\\]\\\\\\/]|[^.*+?^${}()|[\\]\\\\\\/])*)\\$\\//);\n        return match\n            ? match[1].replace(/\\\\(.)/g, '$1').split('/')\n            : '<complex:' + thing.toString() + '>';\n    }\n};\nexports.getPaths = function () {\n    return paths;\n};\n\n\n//# sourceURL=webpack:///./app/middleware/app-routes.ts?");

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

/***/ "./app/models/attribute.ts":
/*!*********************************!*\
  !*** ./app/models/attribute.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    }\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar base_model_1 = __webpack_require__(/*! ./base.model */ \"./app/models/base.model.ts\");\nvar Attribute = (function (_super) {\n    __extends(Attribute, _super);\n    function Attribute() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    return Attribute;\n}(base_model_1.Base));\nexports.Attribute = Attribute;\n\n\n//# sourceURL=webpack:///./app/models/attribute.ts?");

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
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar application_controller_1 = __webpack_require__(/*! ../controllers/application.controller */ \"./app/controllers/application.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/byEmployee/:employeeId', function (req, res, next) {\n    application_controller_1.byEmployee(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/application.route.ts?");

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
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar artifact_controller_1 = __webpack_require__(/*! ../controllers/artifact.controller */ \"./app/controllers/artifact.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/parent-artifacts/byApplication/:applicationId', function (req, res, next) {\n    artifact_controller_1.parentArtifacts(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/agile-artifacts/:applicationId/:projectId/:requirementTypeId', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params, true).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:parentArtifactId', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params, true).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:assignedTo', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params, true).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/agile-artifacts/:applicationId/:projectId/:requirementTypeId/:parentArtifactId/:assignedTo', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params, true).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/:applicationId/:projectId/:requirementTypeId', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/:applicationId/:projectId/:requirementTypeId/:parentArtifactId', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/:applicationId/:projectId/:requirementTypeId/:assignedTo', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/:applicationId/:projectId/:requirementTypeId/:parentArtifactId/:assignedTo', function (req, res, next) {\n    artifact_controller_1.artifacts(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/:artifactId', function (req, res, next) {\n    artifact_controller_1.artifactById(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/artifact.route.ts?");

/***/ }),

/***/ "./app/routes/attribute.route.ts":
/*!***************************************!*\
  !*** ./app/routes/attribute.route.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar attribute_controller_1 = __webpack_require__(/*! ../controllers/attribute.controller */ \"./app/controllers/attribute.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/byApplication/:applicationId', function (req, res, next) {\n    attribute_controller_1.byApplication(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/byApplication/:applicationId/:requirementTypeId', function (req, res, next) {\n    attribute_controller_1.byApplication(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/attribute.route.ts?");

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
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar employee_controller_1 = __webpack_require__(/*! ../controllers/employee.controller */ \"./app/controllers/employee.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/:employeeId', function (req, res, next) {\n    employee_controller_1.byId(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nrouter.get('/byApplication/:applicationId', function (req, res, next) {\n    employee_controller_1.byApplication(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/employee.route.ts?");

/***/ }),

/***/ "./app/routes/project.route.ts":
/*!*************************************!*\
  !*** ./app/routes/project.route.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __webpack_require__(/*! express */ \"express\");\nvar project_controller_1 = __webpack_require__(/*! ../controllers/project.controller */ \"./app/controllers/project.controller.ts\");\nvar router = express_1.Router();\nrouter.get('/projectsGroupbyRelease/:applicationId', function (req, res, next) {\n    project_controller_1.projectsGroupbyRelease(req.params).subscribe(function (response) { return res.status(200).json(response); }, function (err) { return next(err); });\n});\nexports.default = router;\n\n\n//# sourceURL=webpack:///./app/routes/project.route.ts?");

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
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nvar _this = this;\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar mysql_1 = __webpack_require__(/*! mysql */ \"mysql\");\nvar rxjs_1 = __webpack_require__(/*! rxjs */ \"rxjs\");\nvar pool = mysql_1.createPool({\n    connectionLimit: 1000,\n    host: '127.0.0.1',\n    user: 'root',\n    password: 'Sowjanya$123',\n    database: 'light_insurance',\n    multipleStatements: true\n});\nexports.multiQuery = function (sqlQuery, params, callback) {\n    var conn = mysql_1.createConnection({\n        host: '127.0.0.1',\n        user: 'root',\n        password: 'Sowjanya$123',\n        database: 'light_insurance',\n        multipleStatements: true\n    });\n    return new rxjs_1.Observable(function (observer) {\n        var q = conn.query(sqlQuery, params, function (err, rows) {\n            if (err) {\n                observer.error(err);\n            }\n            else {\n                observer.next(rows);\n            }\n            observer.complete();\n        });\n        console.log(q.sql);\n        console.log(\"---------------------------------------------------------------------------------------------------------------------\");\n    });\n};\nexports.query = function (sqlQuery, params) {\n    return new rxjs_1.Observable(function (observer) {\n        pool.getConnection(function (err, conn) {\n            if (err) {\n                observer.error(err);\n                observer.complete();\n            }\n            else {\n                var q = conn.query(sqlQuery, params, function (err, rows) {\n                    if (err) {\n                        observer.error(err);\n                    }\n                    else {\n                        observer.next(rows);\n                    }\n                    conn.release();\n                    observer.complete();\n                });\n                console.log(\"---------------------------------------------------------------------------------------------------------------------\");\n                console.log(q.sql);\n            }\n        });\n    });\n};\nexports.queryAsync = function (sqlQuery, params) { return __awaiter(_this, void 0, void 0, function () {\n    return __generator(this, function (_a) {\n        pool.getConnection(function (err, conn) {\n            if (err) {\n                throw err;\n            }\n            else {\n                var q = conn.query(sqlQuery, params, function (err, rows) {\n                    if (err) {\n                        console.log(err);\n                        throw err;\n                    }\n                    else {\n                        console.log(rows);\n                        return rows;\n                    }\n                    conn.release();\n                });\n                console.log(\"---------------------------------------------------------------------------------------------------------------------\");\n                console.log(q.sql);\n            }\n        });\n        return [2];\n    });\n}); };\n\n\n//# sourceURL=webpack:///./config/sql.config.ts?");

/***/ }),

/***/ "./server.ts":
/*!*******************!*\
  !*** ./server.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express = __webpack_require__(/*! express */ \"express\");\nvar bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\nvar cookieParser = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\nvar tokenization_1 = __webpack_require__(/*! ./app/utils/tokenization */ \"./app/utils/tokenization.ts\");\nvar app_routes_1 = __webpack_require__(/*! ./app/middleware/app-routes */ \"./app/middleware/app-routes.ts\");\nvar auth_route_1 = __webpack_require__(/*! ./app/routes/auth.route */ \"./app/routes/auth.route.ts\");\nvar employee_route_1 = __webpack_require__(/*! ./app/routes/employee.route */ \"./app/routes/employee.route.ts\");\nvar project_route_1 = __webpack_require__(/*! ./app/routes/project.route */ \"./app/routes/project.route.ts\");\nvar application_route_1 = __webpack_require__(/*! ./app/routes/application.route */ \"./app/routes/application.route.ts\");\nvar requirement_type_route_1 = __webpack_require__(/*! ./app/routes/requirement-type.route */ \"./app/routes/requirement-type.route.ts\");\nvar attribute_route_1 = __webpack_require__(/*! ./app/routes/attribute.route */ \"./app/routes/attribute.route.ts\");\nvar artifact_route_1 = __webpack_require__(/*! ./app/routes/artifact.route */ \"./app/routes/artifact.route.ts\");\nvar application_agile_status_route_1 = __webpack_require__(/*! ./app/routes/application-agile-status.route */ \"./app/routes/application-agile-status.route.ts\");\nvar artifact_history_route_1 = __webpack_require__(/*! ./app/routes/artifact-history.route */ \"./app/routes/artifact-history.route.ts\");\nvar app = express();\napp.set('port', process.env.PORT || 3000);\napp.use(bodyParser.json());\napp.use(bodyParser.urlencoded({ extended: true }));\napp.use(function (req, res, next) {\n    res.header(\"Access-Control-Allow-Origin\", \"*\");\n    res.header(\"Access-Control-Allow-Headers\", \"Origin, X-Requested-With, Content-Type, Accept, Authorization\");\n    next();\n});\napp.route('/').get(tokenization_1.valid, function (req, res, next) {\n    var token = req.get('token');\n    if (!token) {\n        res.status(401).json('un authorized');\n    }\n    else {\n        next();\n    }\n});\napp.use('/', auth_route_1.default);\napp.use('/employees', employee_route_1.default);\napp.use('/applications', application_route_1.default);\napp.use('/projects', project_route_1.default);\napp.use('/requirement-type', requirement_type_route_1.default);\napp.use('/attribute', attribute_route_1.default);\napp.use('/application-agile-status', application_agile_status_route_1.default);\napp.use('/artifacts', artifact_route_1.default);\napp.use('/artifact-history', artifact_history_route_1.default);\napp.route('/routes').get(function (req, res, next) {\n    app._router.stack.forEach(app_routes_1.print.bind(null, []));\n    res.status(200).send(app_routes_1.getPaths());\n});\napp.use(function (err, req, res, next) {\n    if (err.sqlMessage) {\n        console.error(err.sqlMessage);\n    }\n    next(err);\n});\napp.use(function (err, req, res, next) {\n    console.error(err.stack);\n    next(err);\n});\napp.use(function (err, req, res, next) {\n    if (err.name === 'UnauthorizedError') {\n        res.status(401).send('Un Authorized');\n    }\n    res.status(500).send('Something went wrong');\n});\napp.listen(app.get('port'), function () {\n    console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));\n});\nmodule.exports = app;\n\n\n//# sourceURL=webpack:///./server.ts?");

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