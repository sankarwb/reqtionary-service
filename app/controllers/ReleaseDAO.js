var sql = require('../config/sqlconfig');

var releaseDAO = function (router) {

	router.post('/getReleases',(req,res) => {
		getReleases(req).then(result => res.json(result), err => res.json({error:err}));
	});
	// Route to get releases and projects of each release for a selected application
	router.post('/getReleasesProjects',(req,res) => {
		var columns = ['id_project','LP.id_release','name_project','name_release'], 
		qry = "SELECT ?? FROM `light_project` LP LEFT JOIN light_project_release LPR ON LP.id_release=LPR.id_release WHERE LP.id_org=? "+
				"AND id_app=? AND type_project>=0";
		/*if( req.body.projectType === 0 ) qry += " AND type_project>=?;";
		else if( req.body.projectType === 0 ) qry += " AND type_project=?;";*/
		sql.query(qry, [columns,req.body.orgId,req.body.appId], callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nget releases and projects Failed: ",err);
			} else if(rows && rows.length > 0){
				var response = [], releaseVO = {};
				rows.forEach(function(rowData, index) {
					if(releaseVO.releaseId == rowData['id_release']) {
						var projectVO = {};
						projectVO.projectId = rowData['id_project'];
						projectVO.projectName = rowData['name_project'];
						releaseVO.projects.push(projectVO);
					} else {
						releaseVO = {};releaseVO.projects = [];
						releaseVO.releaseId = rowData['id_release'];
						releaseVO.releaseName = rowData['name_release'];
						var projectVO = {};
						projectVO.projectId = rowData['id_project'];
						projectVO.projectName = rowData['name_project'];
						releaseVO.projects.push(projectVO);
						response.push(releaseVO);
					}
				});
				res.json(response);	
			} else {
				console.log("\nNo releases and projects found: ",rows);
				res.json({error:"No releases and projects found"});
			}
		}
	});

	router.post('/updateRelease',(req,res) => {
		updateRelease(req).then(results => res.json(results),error => res.json({error:error}))
	});
}

function updateRelease(req){
	return new Promise(function(resolve,reject){
		let columns = [req.body.orgId,req.body.name,req.body.desc,req.body.date,req.body.active,req.body.type,req.body.modifiedByID], 
			qry = "";
		if(req.body.id === 0) {
			qry = "SET @out_status=0;CALL sp_createNewRelease(?,?,?,STR_TO_DATE(?,'%Y-%m-%d'),?,?,?,now(),@out_status);SELECT @out_status;";
		} else {
			qry = "SET @out_status=0;CALL sp_updateRelease(?,?,?,?,STR_TO_DATE(?,'%Y-%m-%d'),?,?,?,now(),@out_status);SELECT @out_status;";
			columns.unshift(req.body.id);
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nStatus failed to update: ",err);
				reject({error:"Release failed to create/update"});
			} else if(rows && rows.length > 0){
				let row;
				if(req.body.id === 0) row = rows[rows.length-1];
				resolve({success:`${req.body.name} ${(req.body.id===0)?'created':'updated'} successfully`, 
					id: (req.body.id === 0) ? row[0]['@out_status'] : req.body.id});
			} else {
				console.log("\nrelease created/update empty: ",rows);
				resolve({success:`${req.body.name} ${(req.body.id===0)?'created':'updated'} successfully`});
			}
		}
	})
}

function getReleases(req){
	return new Promise(function(resolve,reject){
		var columns = ['id_release','name_release','description_release','date_release','active_release','type_release',
						'LPR.modified_by','fname_employee','lname_employee'],
		qry = "SELECT ?? FROM light_project_release LPR LEFT JOIN light_employee LE ON LPR.modified_by=LE.id_employee WHERE LPR.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget releases Failed: ",err);
				reject({error:"get releases Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var releaseVO = {};
					releaseVO.id = rowData['id_release'];
					releaseVO.name = rowData['name_release'];
					releaseVO.desc = rowData['description_release'];
					releaseVO.date = new Date(rowData['date_release']).toISOString().slice(0,10);
					releaseVO.active = rowData['active_release'];
					releaseVO.type = rowData['type_release'];
					releaseVO.modifiedBy = rowData['fname_employee'] +' '+ rowData['lname_employee'];
					releaseVO.modifiedByID = rowData['modified_by'];
					response.push(releaseVO);
				});
				resolve(response);
			} else {
				console.log("\nNo releases found: ",rows);
				resolve({error: "No releases found"});
			}
		}
	})
}

function getSupressedRelease(orgId, modifiedByID){
	return new Promise((resolve,reject) => {
		var columns = ['id_release','name_release','description_release','date_release','active_release','type_release'],
		qry = "SELECT ?? FROM light_project_release WHERE id_org=? AND type_release=-1;";
		sql.query(qry, [columns,orgId], callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nget releases Failed: ",err);
				reject({error:"get releases Failed"});
			} else if(rows && rows.length > 0){
				let releaseVO = {};
				rows.forEach(function(rowData, index) {
					releaseVO.id = rowData['id_release'];
					releaseVO.name = rowData['name_release'];
					releaseVO.desc = rowData['description_release'];
					releaseVO.date = rowData['date_release'];
					releaseVO.active = rowData['active_release'];
					releaseVO.type = rowData['type_release'];
				});
				resolve(releaseVO);
			} else {
				console.log("\nNo supressed releases found: ",rows);
				updateRelease({
					body:{
						orgId: orgId,id: 0,name: 'release123',desc: 'description of release123',date: null,active: 1,type: -1,modifiedByID: modifiedByID
					}
				}).then( release => {
					resolve({id: release.id});
				})
			}
		}
	})
}

module.exports = {releaseDAO,getSupressedRelease};