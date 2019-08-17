import * as sql from '../../config/sqlconfig-old';

export var agileDAO = (router: any) => {
	router.post('/getReleasesProjectsArtifacts',(req: any,res: any) => {
		var response: any = {};
		getReleases(req)
			.then((releasesResult: any) => {
				response.releases = releasesResult;
				if(releasesResult && releasesResult.length > 0){
					getProjects({orgId:req.body.orgId, releaseId: releasesResult[0].releaseId, appId: req.body.appId})
						.then(function(projectResult: any){
							if (projectResult && projectResult.length > 0) {
								response.projects = projectResult;
								var projectId = projectResult.map((each: any) => {
									return each.projectId;
								});
								Promise.all([getAgileArtifacts({orgId:req.body.orgId, projectId: projectResult[0].projectId, appId: req.body.appId}),
											getAgileRequirementTypes({orgId:req.body.orgId, projectId: projectResult[0].projectId, appId: req.body.appId})])
									.then(function(result){
										response.artifacts = result[0];
										response.requirementTypes = result[1];
										res.json(response);
									});
							} else {
								res.json(response);
							}
						});
				} else {
					res.json(response);
				}
			});
	});

	router.post('/getAgileStatusValues',function(req: any,res: any){
		getAgileStatusValues(req.body.orgId, req.body.appId).then(result => res.json(result), err => res.status(500).send(err));
	});

	// This route is no longer in use.
	router.post('/getReleases',function(req: any,res: any){
		getReleases(req)
			.then(function(result){
				res.json(result);
			}, function(err){
				res.json({status: "FAILED",error: err});
			});
	});

	router.post('/getReleaseProjects',function(req: any,res: any){
		getProjects(req.body)
			.then(function(result){
				res.json(result);
			}, function(err){
				res.json({status: "FAILED",error: err});
			});
	});

	router.post('/getProjectArtifacts',function(req: any,res: any){
		getAgileArtifacts({orgId: req.body.orgId, appId: req.body.appId, projectId: req.body.projectId})
			.then(function(result){
				res.json(result);
			}, function(err){
				res.json({status: "FAILED",error: err});
			});
	});
}

export function updateAgileStatus(req: any, orgId: any, appId: any, modifiedByID: any){
	return new Promise((resolve,reject) => {
		let qry = "",columns = [req.name,req.order,req.active,modifiedByID];
		if(req.id === 0) {
			qry = "INSERT INTO light_app_agile_status(id_org,id_app,agile_status_value,order_status_value,active,modified_by,modified_date) "+
					"values (?,?,?,?,?,?,now());";
			columns.unshift(appId);		
			columns.unshift(orgId);		
		} else {
			qry = "UPDATE light_app_agile_status SET agile_status_value=?,order_status_value=?,active=?,modified_by=?,modified_date=now() "+
					"WHERE id_app_agile_status=?;";
			columns.push(req.id);
		}
		sql.query(qry, columns, callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nagile status failed to update: ",err);
				reject({error:"agile status failed to update"});
			} else if(rows && rows.length > 0){
				resolve(true);
			} else {
				console.log("\nagile status update empty: ",rows);
				resolve(true);
			}
		}
	})
}

export function getAgileStatusValues(orgId: any,appId: any){
	return new Promise((resolve,reject) => {
		var columns = ['id_app_agile_status','id_app','agile_status_value','order_status_value','active'], 
		qry = "SELECT ?? FROM `light_app_agile_status` WHERE id_org=? AND id_app=? ORDER BY order_status_value;";
		sql.query(qry, [columns,orgId,appId], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [];
			if(err){
				console.log("\nget agile status values failed: ",err);
				reject("get agile status values failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData: any, index: number) {
					let vo: any = {};
					vo.id = rowData['id_app_agile_status'];
					vo.appId = rowData['id_app'];
					vo.name = rowData['agile_status_value'];
					vo.order = rowData['order_status_value'];
					vo.active = rowData['active'];
					response.push(vo);
				});
				resolve(response);	
			} else {
				console.log("\nNo agile status values: ",rows);
				resolve([]);
			}
		}
	});
}

function getReleases(req: any){
	return new Promise(function(resolve,reject){
		var columns = ['id_release', 'name_release'], 
		qry = "SELECT ?? FROM `light_project_release` WHERE id_release IN (SELECT id_release FROM `light_project` WHERE id_org=? "+
				"AND id_app=? AND type_project >= 0 GROUP By id_release) ORDER BY modified_date DESC;";
		sql.query(qry, [columns,req.body.orgId,req.body.appId], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [], promiseCount = 0;
			if(err){
				console.log("\nget user app releases Failed: ",err);
				reject("get user app releases Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData: any, index: number) {
					var releaseVO: any = {};
					releaseVO.releaseId = rowData['id_release'];
					releaseVO.releaseName = rowData['name_release'];
					response.push(releaseVO);
				});
				resolve(response);	
			} else {
				console.log("\nNo user application releases: ",rows);
				resolve({error:"No user application releases"});
			}
		}
	});
}

function getProjects(req: any){
	return new Promise(function(resolve,reject){
		var columns = ['id_project','name_project','type_project'], 
		qry = "SELECT ?? FROM light_project WHERE id_org=? AND id_release=? AND id_app=? ORDER BY id_project DESC;";
		sql.query(qry, [columns,req.orgId,req.releaseId,req.appId], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [], promiseCount = 0;
			if(err){
				console.log("\nget user release projects Failed: ",err);
				reject("get user release projects Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData: any, index: any) {
					var projectVO: any = {};
					projectVO.projectId = rowData['id_project'];
					projectVO.projectName = rowData['name_project'];
					projectVO.projectType = rowData['type_project'];
					response.push(projectVO);
				});
				resolve(response);	
			} else {
				console.log("\nNo user release projects: ",rows);
				resolve({error:"No user release projects"});
			}
		}
	});
}

function getAgileArtifacts(req: any){
	return new Promise(function(resolve,reject){
		var columns = ['LA.id_object','id_artifact','uid_artifact','name_artifact','status_artifact','color'], 
		/*qry = "SELECT ?? FROM light_artifact WHERE id_org=? AND id_project=? AND id_object IN(SELECT LO.id_object FROM "+
		"light_app_object_attribute LAOA LEFT JOIN light_object LO ON LAOA.id_object=LO.id_object WHERE LAOA.id_org=? AND "+
		"LAOA.id_app=? AND LO.type_object<0 GROUP BY LO.id_object);";*/
		qry = "SELECT ?? FROM light_artifact LA LEFT JOIN light_object LO ON LA.id_object=LO.id_object "+
				"WHERE LA.id_org=? AND LA.id_app=? AND id_project=?";
		sql.query(qry, [columns,req.orgId,req.appId,req.projectId], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [];
			if(err){
				console.log("\nget user project artifacts Failed: ",err);
				reject("get user project artifacts Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData: any, index: any) {
					var artifactVO: any = {};
					artifactVO.objectId = rowData['id_object'];
					artifactVO.artifactId = rowData['id_artifact'];
					artifactVO.artifactUID = rowData['uid_artifact'];
					artifactVO.artifactName = rowData['name_artifact'];
					artifactVO.artifactStatus = rowData['status_artifact'];
					artifactVO.color = rowData['color'];
					response.push(artifactVO);
				});
				/*getAgileRequirementTypes(req)
					.then(function(result){
						resolve({artifacts: response,requirementTypes: result});
					}, function(err){
						resolve({artifacts: response,requirementTypes: {error: err}});
					});*/
				resolve(response);
			} else {
				console.log("\nNo user project artifacts: ",rows);
				resolve({error:"No user project artifacts"});
			}
		}
	});
}

function getAgileRequirementTypes(req: any){
	return new Promise(function(resolve,reject){
		var columns = ['id_object', 'name_object', 'code_object', 'color', 'seqnum_object'],
		/*qry = "SELECT ?? FROM light_object WHERE id_object IN(SELECT id_object FROM light_artifact WHERE id_org=?"+
				" AND id_app=? AND id_project IN("+req.projectId+") GROUP BY id_object) AND id_org=?";*/
		// query without project will filter all requirement types without UCS & permenant documentation object
		qry = "SELECT ?? FROM light_object WHERE id_object IN(SELECT id_object FROM light_app_object_attribute WHERE id_org=?"+
				" AND id_app=?) AND type_object < 0 AND id_org=?";
		sql.query(qry, [columns,req.orgId,req.appId,req.orgId], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [];
			if(err){
				console.log("\nget user project RequirementTypes Failed: ",err);
				reject("get user project RequirementTypes Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData: any, index: any) {
					var objectVO: any = {};
					objectVO.objectId = rowData['id_object'];
					objectVO.objectName = rowData['name_object'];
					objectVO.objectCode = rowData['code_object'];
					objectVO.objectColor = rowData['color'];
					objectVO.objectSeqnum = rowData['seqnum_object'];
					response.push(objectVO);
				});
				resolve(response);	
			} else {
				console.log("\nNo user project RequirementTypes: ",rows);
				resolve({error:"No user project RequirementTypes"});
			}
		}
	});
}