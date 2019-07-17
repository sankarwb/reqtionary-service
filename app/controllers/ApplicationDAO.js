var sql = require('../config/sqlconfig'),
	ReqTypeDAO = require('./RequirementTypeDAO'),
	RoleDAO = require('./RoleDAO'),
	ReleaseDAO = require('./ReleaseDAO'),
	ProjectDAO = require('./ProjectDAO'),
	ArtifactDAO = require('./ArtifactDAO'),
	AgileDAO = require('./AgileDAO');

var appDAO = function (router) {
	router.post('/getUserApps',function(req,res){
		var columns = ['LA.id_app', 'name_app','LP.id_project','name_project','type_project'], 
		qry = "SELECT ?? FROM light_app LA LEFT JOIN light_project LP ON LA.id_app=LP.id_app WHERE LA.id_app in(SELECT id_app FROM light_role_emp WHERE id_org=? AND id_employee=? AND active=1) AND LA.id_org=? AND active_app=1 ORDER BY LA.id_app;";
		//qry = "SELECT ?? FROM light_app WHERE id_app in(SELECT id_app FROM light_role_emp WHERE id_org=? AND id_employee=? AND active=1) AND id_org=? AND active_app=1 ORDER BY id_app;";
		sql.query(qry, [columns,req.body.orgId,req.body.employeeId,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [], promiseCount = 0;
			if(err){
				console.log("\nget user apps Failed: ",err);
				res.status(500).send('Error in fetching user applications. Please try again.');
			} else if(rows && rows.length > 0){
				let appVO = {}, projectVO = {},promiseAll = [];
				rows.forEach(function(rowData, index) {
					if(appVO.id === rowData['id_app']){
						if(rowData['name_project'] !== null)
							appVO.projects.push({id: rowData['id_project'],name: rowData['name_project'],type: rowData['type_project']});
					} else {
						appVO = {};appVO.projects = [];
						appVO.id = rowData['id_app'];
						appVO.name = rowData['name_app'];
						if(rowData['name_project'] !== null)
							appVO.projects.push({id: rowData['id_project'],name: rowData['name_project'],type: rowData['type_project']});
						promiseAll.push(ArtifactDAO.getArtifactExpectedActuals(req.body.orgId,appVO.id));
						response.push(appVO);
					}
					/*appVO = {};
					appVO.id = rowData['id_app'];
					appVO.name = rowData['name_app'];
					promiseAll.push(ArtifactDAO.getArtifactExpectedActuals(req.body.orgId,appVO.id));
					response.push(appVO);*/
				});
				Promise.all(promiseAll).then( result => {
					if(result.length > 0) {
						result.forEach( (release,idx) => {
							response[idx].releases = release;
						})
					}
					res.json(response);
				},err => res.json(response));
			} else {
				console.log("\nNo user applications found: ",rows);
				res.status(500).send('No applications found.');
			}
		}
	});

	router.post('/getApplications',(req,res)=>{
		var columns = ['LA.id_app','name_app','desc_app','active_app','comments','id_role_emp','LA.id_div','name_div',
		'LA.id_appgrp','name_appgrp','LA.modified_by','LRE.id_role','name_role','LRE.active','LE.id_employee','LE.fname_employee','LE.lname_employee'],
		qry = "SELECT ??,concat(LE1.fname_employee,' ',LE1.lname_employee) as modified FROM light_app LA LEFT JOIN light_appgrp LAG ON "+
				"LA.id_appgrp=LAG.id_appgrp LEFT JOIN light_division LD ON LA.id_div=LD.id_div LEFT JOIN light_role_emp LRE ON LA.id_app=LRE.id_app "+
				"LEFT JOIN light_role LR ON LRE.id_role=LR.id_role LEFT JOIN light_employee LE ON LRE.id_employee=LE.id_employee LEFT "+
				"JOIN light_employee LE1 ON LA.modified_by=LE1.id_employee WHERE LA.id_org=? ORDER BY LA.id_app;";
		sql.query(qry,[columns,req.body.orgId], callback);
		function callback(err,rows,fields) {
			var response = [],appVO = {};
			if(err){
				console.log("\nget apps Failed: ",err);
				res.json("get apps Failed");
			} else if(rows && rows.length > 0){
				let promiseAll = [];
				rows.forEach(function(rowData, index) {
					if(appVO.id === rowData['id_app']){
						if(rowData['name_role'] !== null) appVO.roles.push(RoleDAO.getRoleEmpObj(rowData,'appId',rowData['id_app']));
					} else {
						appVO = {};appVO.roles = [];
						appVO.divId = rowData['id_div'];
						appVO.divName = rowData['name_div'];
						appVO.appGrpId = rowData['id_appgrp'];
						appVO.appGrpName = rowData['name_appgrp'];
						appVO.id = rowData['id_app'];
						appVO.name = rowData['name_app'];
						appVO.desc = rowData['desc_app'];
						appVO.modifiedBy = rowData['modified'];
						appVO.modifiedByID = rowData['modified_by'];
						appVO.active = rowData['active_app'];
						appVO.comments = rowData['comments'];
						if(rowData['name_role'] !== null) appVO.roles.push(RoleDAO.getRoleEmpObj(rowData,'appId',rowData['id_app']));
						promiseAll.push(AgileDAO.getAgileStatusValues(req.body.orgId,appVO.id));
						response.push(appVO);
					}
				});
				Promise.all(promiseAll).then(result => {
					response.forEach( app => {
						app.agileStatusValues = [];
						result.forEach( appAgileStatus => {
							if(appAgileStatus.length > 0 &&  app.id === appAgileStatus[0].appId)
								app.agileStatusValues = appAgileStatus;
						})
					})
					res.json(response);
				}, err => res.json(response));
			} else {
				console.log("\nNo apps found: ",rows);
				res.status(500).send('No applications found.');
			}
		}
	})

	router.post('/updateApp',(req,res) => {
		let qry = "",columns = [req.body.orgId,req.body.divId,req.body.appGrpId,req.body.name,req.body.desc,req.body.comments,req.body.active,req.body.modifiedByID];
		if( req.body.id === 0 )
			qry = "SET @out_status_one=0;SET @out_status_two=0; CALL sp_createNewApplication(?,?,?,?,?,?,?,?,now(),@out_status_one,@out_status_two);"+
					"SELECT @out_status_one,@out_status_two";
		else {
			qry = "SET @out_status=0;CALL sp_updateApplication(?,?,?,?,?,?,?,?,?,now(),@out_status);SELECT @out_status;";
			columns.unshift(req.body.id);
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nApplication failed to update: ",err);
				res.status(500).send(`Failed to ${( req.body.id === 0 ) ? 'create':'update'} application`);
			} else if(rows && rows.length > 0){
				let rowData, rowID;
				if(req.body.id === 0) {
					rowData = rows[rows.length-1];
					rowID = rowData[0]['@out_status_two'];
					if(rowID === null) {
						res.status(500).send(`Duplicate ${req.body.name}`);
						return;
					}
				}
				promiseAll = [
			 		RoleDAO.updateBulkRoleEmp( req, (req.body.id === 0)?rowID:req.body.id, 'appId' ),
				];
				if(req.body.types) {
					promiseAll.push(ReqTypeDAO.updateAppObjAttributes(req));
				}
				if(req.body.agileStatusValues.length > 0) {
				 	req.body.agileStatusValues.forEach( agileStatus => {
				 		promiseAll.push(AgileDAO.updateAgileStatus(agileStatus,req.body.orgId,(req.body.id === 0)?rowID:req.body.id,req.body.modifiedByID));
				 	})
				}	
				if( req.body.id === 0 ) {
				 	promiseAll.push(ReleaseDAO.getSupressedRelease(req.body.orgId,req.body.modifiedByID)
		 						.then( release => 
		 					 		createSupressedProjects(req.body.orgId,release.id,rowID,req.body.modifiedByID)
		 					 	, err => {
		 					 		//TODO: Notify user about the failure
		 					 	}))
				}
				Promise.all(promiseAll).then( resp => {
			 		if( resp )
			 			res.json({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			 		else
			 			res.status(500).send(`${req.body.id === 0? 'create':'update'} types failed`);
			 	}, err => {
			 		console.log(err);
			 		res.status(500).send(`${req.body.id === 0? 'create':'update'} types failed`);
			 	});
			} else {
				console.log("\nApplication update empty: ",rows);
				res.json({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			}
		}
	})
}

function createSupressedProjects(orgId, releaseId, appId, modifiedByID) {
	return new Promise( (resolve,reject) => {
		let date = new Date(), today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
		let defect = {
	 		body: {
	 			id: 0,orgId: orgId,appId: appId,statusId: 1,releaseId: releaseId,phaseId: 1,
	 			name: 'defect123',desc: 'project for defect',code: '0',active: 1,type: '-1',
	 			prodDate: today,startDate: today,endDate: today,modifiedByID: modifiedByID
	 		}
	 	},
	 	backlog = {
	 		body: {
	 			id: 0,orgId: orgId,appId: appId,statusId: 1,releaseId: releaseId,phaseId: 1,
	 			name: 'backlog123',desc: 'project for backlog',code: '0',active: 1,type: '-2',
	 			prodDate: today,startDate: today,endDate: today,modifiedByID: modifiedByID
	 		}
	 	},
	 	permdoc = {
	 		body: {
	 			id: 0,orgId: orgId,appId: appId,statusId: 1,releaseId: releaseId,phaseId: 1,
	 			name: 'perm.doc123',desc: 'project for permenant documentation',code: '0',active: 1,type: '-3',
	 			prodDate: today,startDate: today,endDate: today,modifiedByID: modifiedByID
	 		}
	 	}
	 	Promise.all([ProjectDAO.updateProject(defect),ProjectDAO.updateProject(backlog),ProjectDAO.updateProject(permdoc)])
	 		.then( result => resolve(true), err => reject(err));
	})
}

module.exports = appDAO;