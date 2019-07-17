var sql = require('../config/sqlconfig');
var roleDAO = function (router) {
	//Get all roles for admin settings module
	router.post('/getAllRoles',(req,res) => {
		getAllRoles(req).then(roles => res.json(roles),error => res.json(error))
	});
	// Get roles of given 'type'
	router.post('/getRoles',(req,res) => {
		getRoles(req).then(roles => res.json(roles),error => res.json(error))
	});
	router.post('/updateRole',(req,res) => {
		updateRole(req).then(roles => res.json(roles),error => res.json(error));
	});
}

function getRoles(req){
	return new Promise(function(resolve,reject){
		var columns = ['id_role','name_role','desc_role'],
			qry = "SELECT ?? FROM light_role WHERE id_org=? AND type_role=? AND active_role=1;";
		sql.query(qry, [columns,req.body.orgId,req.body.role], callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget roles Failed: ",err);
				reject("get roles Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var roleVO = {};
					roleVO.roleId = rowData['id_role'];
					roleVO.roleName = rowData['name_role'];
					roleVO.roleDesc = rowData['desc_role'];
					response.push(roleVO);
				});
				resolve(response);	
			} else {
				console.log("\nNo roles found: ",rows);
				resolve({error: "No roles found"});
			}
		}
	});
}
function getEmpRoles(req){
	return new Promise(function(resolve,reject){
		var roles = ['Organization','Division','Application Group','Application','Project','Access'],
		columns = ['id_role_emp','LRE.id_role','fname_employee','lname_employee','name_role'],
		qry = "SELECT ?? FROM light_role_emp LRE LEFT JOIN light_employee LE ON LRE.id_employee=LE.id_employee LEFT JOIN "+
				"light_role LR ON LRE.id_role=LR.id_role WHERE LRE.id_role IN(SELECT id_role FROM `light_role` WHERE "+
				"type_role=? AND id_org=?)",
		params = [columns,req.body.role,req.body.orgId];
		roles.forEach(function(role,idx){
			switch(role){
				case 'Organization':
					break;
				case 'Division':
					if(req.body.role === role)qry += " AND id_div!=0"; else qry += " AND id_div=0";
				break;
				case 'Application Group':
					if(req.body.role === role)qry += " AND id_appgrp!=0"; else qry += " AND id_appgrp=0";
				break;
				case 'Application':
					if(req.body.role === role)qry += " AND id_app!=0"; else qry += " AND id_app=0";
				break;
				case 'Project':
					if(req.body.role === role)qry += " AND id_project!=0"; else qry += " AND id_project=0";
				break;
				case 'Access':
					if(req.body.role === role)qry += " AND id_access!=0"; else qry += " AND id_access=0";
				break;
			}
		});
		qry += " AND active=1;";
		sql.query(qry, params, callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget roles Failed: ",err);
				reject("get user roles Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var roleVO = {};
					roleVO.roleEmpId = rowData['id_role_emp'];
					roleVO.roleId = rowData['id_role'];
					roleVO.roleName = rowData['name_role'];
					roleVO.roleEmpName = rowData['fname_employee']+" "+rowData['lname_employee'];
					response.push(roleVO);
				});
				resolve(response);	
			} else {
				console.log("\nNo roles found: ",rows);
				resolve([]);
			}
		}
	});
}
function getAllRoles(req){
	return new Promise(function(resolve,reject){
		var columns = ['id_role','name_role','desc_role','type_role','active_role','LR.modified_by','fname_employee','lname_employee'],
			qry = "SELECT ?? FROM light_role LR LEFT JOIN light_employee LE ON LR.modified_by=LE.id_employee WHERE LR.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget roles Failed: ",err);
				reject("get roles Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var roleVO = {};
					roleVO.id = rowData['id_role'];
					roleVO.name = rowData['name_role'];
					roleVO.desc = rowData['desc_role'];
					roleVO.type = rowData['type_role'];
					roleVO.active = rowData['active_role'];
					roleVO.modifiedByID = rowData['modified_by'];
					roleVO.modifiedBy = rowData['fname_employee'] + ' ' + rowData['lname_employee'];
					response.push(roleVO);
				});
				resolve(response);	
			} else {
				console.log("\nNo roles found: ",rows);
				resolve({error: "No roles found"});
			}
		}
	});
}
function updateRole(req){
	return new Promise((resolve,reject) => {
		var qry = "",columns = [req.body.orgId,req.body.name,req.body.type,req.body.desc,req.body.active,req.body.modifiedByID];
		if(req.body.id === 0) {
			qry = "SET @out_status=0;CALL sp_createNewRole(?,?,?,?,?,?,now(),@out_status);SELECT @out_status;";
		} else {
			qry = "SET @out_status=0;CALL sp_updateRole(?,?,?,?,?,?,?,now(),@out_status);SELECT @out_status;";
			columns.unshift(req.body.id);
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nRole failed to update: ",err);
				reject({error:"Role failed to update"});
			} else if(rows && rows.length > 0){
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			} else {
				console.log("\nRole created update empty: ",rows);
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			}
		}
	})
}
// updated role employees for Division, App Group, APp, Project etc
// bulk: rows; id: id of div|appGrp|app etc; key: div|appGrp|app etc;
function updateBulkRoleEmp(req, id, key) {
	return new Promise((resolve,reject) => {
		if(!req.body.roles || (req.body.roles && req.body.roles.length === 0) ) {
			resolve(true);
			return;
		}
		let bulkPromise = [];
		req.body.roles.forEach( row => {
			row.orgId = req.body.orgId;
			row[key] = id;
			bulkPromise.push( updateRoleEmpAll( row, req.body.orgId, req.body.modifiedByID ) )
		});
		Promise.all( bulkPromise ).then( resp => resolve(true), err => reject(false) );
	})
}

// Update role for all other than employee
function updateRoleEmpAll(req, orgId, modifiedByID){
	return new Promise((resolve,reject) => {
		let qry = "",columns = [req.roleEmpId,req.roleId,req.empId,orgId,req.divId,req.appGrpId,req.appId,req.accessId,req.projectId,modifiedByID];
		if(req.roleEmpId === 0) {
			qry = "CALL sp_createEmployeeRole(?,?,?,?,?,?,?,?,?,now());";
			columns.shift();
		} else {
			qry = "CALL sp_updateEmpRole(?,?,?,?,?,?,?,?,?,"+req.active+",?,now());";
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nrole failed to update: ",err);
				reject({error:"role failed to update"});
			} else if(rows && rows.length > 0){
				resolve(true);
			} else {
				console.log("\nrole update empty: ",rows);
				resolve(true);
			}
		}
	})
}

// Update role for employees only
function updateRoleEmployee(req){
	return new Promise(function(resolve,reject){
		var qry = "SET @status=0;CALL sp_updateEmployeeRole(?,?,?,?,?,1,?,now(),@status);SELECT @status;";
		sql.multiQuery(qry, [req.body.id,req.body.orgId,req.body.name,req.body.type,req.body.desc,req.body.active,req.body.modifiedByID], callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nrole failed to update: ",err);
				reject({error:"role failed to update"});
			} else if(rows && rows.length > 0){
				resolve({success:rowData[0]['@status']});
			} else {
				console.log("\nrole failed to update: ",rows);
				resolve({error:"role failed to update"});
			}
		}
	})
}

function getRoleEmpObj(rowData,key,id) {
	let roleEmpVO = {
		roleEmpId: rowData['id_role_emp'],
		roleId: rowData['id_role'],
		empId: rowData['id_employee'],
		orgId: rowData['id_org'],
		divId: 0,
		appGrpId: 0,
		appId: 0,
		accessId: 0,
		projectId: 0,
		roleName: rowData['name_role'],
		empName: rowData['fname_employee'] + ' ' + rowData['lname_employee'],
		active: rowData['active'],
		modifiedByID: rowData['modified_by']
	};
	roleEmpVO[key] = id;
	return roleEmpVO;
}
module.exports = {roleDAO, getEmpRoles, getRoleEmpObj, updateBulkRoleEmp};