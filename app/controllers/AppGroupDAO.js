var sql = require('../config/sqlconfig');
var RoleDAO = require('./RoleDAO');

var appgrpDAO = function (router) {
	router.post('/getAppGroups',(req,res) => {
		req.body.role = "Application Group";
		getAppGroups(req).then(results => res.json(results),error => res.json({error:error}));
	});

	router.post('/updateAppGroup',(req,res) => {
		updateAppGroup(req).then(results =>res.json(results),error => res.json({error:error}))
	});
}

function updateAppGroup(req){
	return new Promise((resolve,reject) => {
		let qry = "", columns = [req.body.divId,req.body.name,req.body.desc,req.body.active,req.body.modifiedByID];
		if(req.body.id === 0) {
			qry = "SET @out_status_one=0;SET @out_status_two=0; CALL sp_createNewAppGroup(?,?,?,?,?,?,now(),@out_status_one,@out_status_two);"+
					"SELECT @out_status_one,@out_status_two";
			columns.shift();
			columns.unshift(req.body.orgId);
		} else {
			qry = "SET @status=0;CALL sp_updateAppGroup(?,?,?,?,?,?,now(),@status);SELECT @status;";
			columns.unshift(req.body.id);
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nApp group failed to update: ",err);
				reject({error:"App group failed to update"});
			} else if(rows && rows.length > 0){
				let row = rows[rows.length-1];
				RoleDAO.updateBulkRoleEmp( req, (req.body.id === 0)?row[0]['@out_status_two']:req.body.id, 'appGrpId' )
						.then( resp => resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`}) );
			} else {
				console.log("\nApp group failed to update: ",rows);
				resolve({error:"App group failed to update"});
			}
		}
	})
}

function getAppGroups(req){
	return new Promise((resolve,reject) => {
		var columns = ['LAG.id_org','LAG.id_div','id_role_emp','LAG.id_appgrp','name_appgrp','desc_appgrp','active_appgrp','LAG.modified_by',
						'LRE.id_role','name_role','LRE.active','LE.id_employee','LE.fname_employee','LE.lname_employee'],
		qry = "SELECT ??,CONCAT(LE1.fname_employee,' ',LE1.lname_employee) as modified FROM light_appgrp LAG LEFT JOIN "+
				"light_role_emp LRE ON LAG.id_appgrp=LRE.id_appgrp LEFT JOIN light_role LR ON "+
				"LRE.id_role=LR.id_role LEFT JOIN light_employee LE ON LRE.id_employee=LE.id_employee LEFT JOIN "+
				"light_employee LE1 ON LE1.id_employee=LAG.modified_by WHERE LAG.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [],appgrpVO = {};
			if(err){
				console.log("\nget appgrps Failed: ",err);
				reject("get appgrps Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					if(appgrpVO.id === rowData['id_appgrp']){
						if(rowData['name_role'] !== null) appgrpVO.roles.push( RoleDAO.getRoleEmpObj( rowData,'appGrpId',rowData['id_appgrp'] ) );
					} else {
						appgrpVO = {};appgrpVO.roles = [];
						appgrpVO.divId = rowData['id_div'];
						appgrpVO.id = rowData['id_appgrp'];
						appgrpVO.name = rowData['name_appgrp'];
						appgrpVO.desc = rowData['desc_appgrp'];
						appgrpVO.modifiedBy = rowData['modified'];
						appgrpVO.modifiedBYID = rowData['modified_by'];
						appgrpVO.active = rowData['active_appgrp'];
						if(rowData['name_role'] !== null) appgrpVO.roles.push( RoleDAO.getRoleEmpObj( rowData,'appGrpId',rowData['id_appgrp'] ) );
						response.push(appgrpVO);
					}
				});
				resolve(response);
			} else {
				console.log("\nNo appgrps found: ",rows);
				resolve({error: "No appgrps found"});
			}
		}
	});
}
module.exports = appgrpDAO;