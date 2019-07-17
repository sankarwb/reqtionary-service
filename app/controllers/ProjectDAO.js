var sql = require('../config/sqlconfig'),
	RoleDAO = require('./RoleDAO');

function projectDAO(router) {
	router.post('/getAllProjects', (req,res) => {
		getAllProjects(req).then(result => res.json(result),error => res.json({error: "No sprints found"}));
	});
	router.post('/getProjectDetails', (req,res) => {
		getAppProject(req).then(result => res.json(result),error => res.json({error: "No sprints found"}));
	});
	router.post('/updateProject', (req,res) => {
		updateProject(req).then(result => res.json(result),error => res.json({error: error}));
	});
}

function updateProject(req){
	return new Promise(function(resolve,reject){
		var qry = "",columns = [req.body.orgId,req.body.appId,req.body.statusId,req.body.releaseId,req.body.phaseId,
			req.body.name,req.body.desc,req.body.code,req.body.active,req.body.type,req.body.prodDate,req.body.startDate,
			req.body.endDate,req.body.modifiedByID];
		if(req.body.id === 0) {
			qry = "SET @out_status=0;CALL sp_createNewProject(?,?,?,?,?,?,?,?,?,?,STR_TO_DATE(?,'%Y-%m-%d'),STR_TO_DATE(?,'%Y-%m-%d'),STR_TO_DATE(?,'%Y-%m-%d'),?,now(),@out_status);SELECT @out_status;";
		} else {
			qry = "SET @out_status=0;CALL sp_updateProject(?,?,?,?,?,?,?,?,?,?,STR_TO_DATE(?,'%Y-%m-%d'),STR_TO_DATE(?,'%Y-%m-%d'),STR_TO_DATE(?,'%Y-%m-%d'),?,now(),@out_status);SELECT @out_status;";
			columns.splice(0,1);
			columns.unshift(req.body.id);
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nProject failed to update: ",err);
				reject({error:"Project failed to update"});
			} else if(rows && rows.length > 0){
				let rowData;
				if(req.body.id === 0) rowData = rows[rows.length-1];
				RoleDAO.updateBulkRoleEmp( req, (req.body.id === 0)?rowData[0]['@out_status']:req.body.id, 'projectId' )
						.then( resp => resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`}) );
			} else {
				console.log("\nProject created/update: ",rows);
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			}
		}
	})
}

function getAllProjects(req) {
	return new Promise((resolve,reject) => {
		var columns = ['LP.id_project','LP.id_app','LP.id_release','LP.id_status','LP.id_phase','LRE.id_role_emp','LRE.id_role',
		'LRE.id_employee','name_role','LRE.active','name_project','desc_project','pcode_project','active_project','type_project','production_date',
		'start_date','end_date','name_release','name_app','name_status','color','LE.fname_employee','LE.lname_employee','LRE.modified_by'],
			qry = "SELECT ??,CONCAT(LE1.fname_employee,' ',LE1.lname_employee) modified FROM light_project LP LEFT JOIN light_project_release LPR "+
					"ON LP.id_release=LPR.id_release LEFT JOIN light_app LA ON LP.id_app=LA.id_app LEFT JOIN light_status LS ON "+
					"LP.id_status=LS.id_status LEFT JOIN light_role_emp LRE ON LP.id_project=LRE.id_project LEFT JOIN light_role LR ON "+
					"LRE.id_role=LR.id_role LEFT JOIN light_employee LE ON LRE.id_employee=LE.id_employee LEFT JOIN light_employee LE1 ON "+
					"LP.modified_by=LE1.id_employee WHERE LP.id_org=? AND type_project=0 ORDER BY LP.id_project;";
		//qry = "SELECT ?? FROM light_project LP LEFT JOIN light_project_release LPR ON LP.id_release=LPR.id_release LEFT JOIN light_app LA ON LP.id_app=LA.id_app LEFT JOIN light_status LS ON LP.id_status=LS.id_status LEFT JOIN light_employee LE ON LP.modified_by=LE.id_employee WHERE LP.id_org=?";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nerror in Projects: ",err);
				reject({error:"error in Projects"});
			} else if(rows && rows.length > 0){
				let response = [],projectVO = {};
				rows.forEach((rowData, index) => {
					if(projectVO.id === rowData['id_project']){
						if(rowData['name_role'] !== null) projectVO.roles.push( RoleDAO.getRoleEmpObj(rowData,'projectId',rowData['id_project']) );
					} else {
						projectVO = {};projectVO.roles = [];
						projectVO.id = rowData['id_project'];
						projectVO.appId = rowData['id_app'];
						projectVO.releaseId = rowData['id_release'];
						projectVO.statusId = rowData['id_status'];
						projectVO.phaseId = rowData['id_phase'];
						projectVO.name = rowData['name_project'];
						projectVO.desc = rowData['desc_project'];
						projectVO.code = rowData['pcode_project'];
						projectVO.active = rowData['active_project'];
						projectVO.type = rowData['type_project'];
						projectVO.prodDate = new Date(rowData['production_date']).toISOString().slice(0,10);
						projectVO.startDate = new Date(rowData['start_date']).toISOString().slice(0,10);
						projectVO.endDate = new Date(rowData['end_date']).toISOString().slice(0,10);
						projectVO.releaseName = rowData['name_release'];
						projectVO.appName = rowData['name_app'];
						projectVO.status = rowData['name_status'];
						projectVO.color = rowData['color'];
						projectVO.modifiedBy = rowData['modified'];
						if(rowData['name_role'] !== null) projectVO.roles.push( RoleDAO.getRoleEmpObj(rowData,'projectId',rowData['id_project']) );
						response.push(projectVO);
					}
				});
				resolve(response);
			} else {
				console.log("\nProject failed to update: ",rows);
				resolve({error:"Project failed to update"});
			}
		}
	})
}

function getAppProject(req){
	return new Promise(function(resolve,reject) {
		var columns = ['id_project'],
		qry = "SELECT ?? FROM `light_project` WHERE id_org=? AND id_app=?",
		params = [columns, req.body.orgId, req.body.appId];
		if (req.body.projectType) {
			qry += " AND type_project=?;";
			params.push(req.body.projectType);
		}
		sql.query(qry, params, callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err) {
				reject(err);
			} else if(rows && rows.length > 0) {
				rows.forEach(function(rowData, index){
					response.push(rowData.id_project);
				});
				resolve(response);
			} else {
				console.log("\n ProjectDAO: No projects found: ",rows);
				resolve(response);
			}
		}
	})
}

function getProjectDetails(req){
	return new Promise(function(resolve,reject){
		var columns = ['LP.id_project','name_project','desc_project','pcode_project','active_project','type_project',
					'production_date','start_date','end_date','LP.modified_by','LP.id_app','id_status','id_release',
					'id_phase'],
		qry = "SELECT ??,CONCAT(LE1.fname_employee,' ',LE1.lname_employee) as modified FROM light_project LP LEFT JOIN "+
				"light_role_emp LRE ON LP.id_project=LRE.id_project AND active=1 LEFT JOIN light_role LR ON "+
				"LRE.id_role=LR.id_role LEFT JOIN light_employee LE ON LRE.id_employee=LE.id_employee LEFT JOIN "+
				"light_employee LE1 ON LP.modified_by=LE1.id_employee WHERE LP.id_project=?;";
		sql.query(qry, [columns,req.body.projectId], callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget projects details Failed: ",err);
				reject("get projects details Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var projectVO = {};
					projectVO.projectId = rowData['id_project'];
					projectVO.projectName = rowData['name_project'];
					projectVO.projectDesc = rowData['desc_project'];
					projectVO.projectCode = rowData['pcode_project'];
					projectVO.projectActive = rowData['active_project'];
					projectVO.projectType = rowData['type_project'];
					projectVO.productionDate = rowData['production_date'];
					projectVO.projectStartDate = rowData['start_date'];
					projectVO.projectEndDate = rowData['end_date'];
					projectVO.appId = rowData['id_app'];
					projectVO.statusId = rowData['id_status'];
					projectVO.releaseId = rowData['id_release'];
					projectVO.phaseId = rowData['id_phase'];
					projectVO.projectModifiedBY = rowData['modified'];
					projectVO.projectModifiedBYID = rowData['modified_by'];
					response.push(projectVO);
				});
				resolve(response);
			} else {
				console.log("\nNo project details found: ",rows);
				resolve({error: "No projects details found"});
			}
		}
	})
}
module.exports = {projectDAO, updateProject, getAppProject};