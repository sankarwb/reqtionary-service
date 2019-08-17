import * as sql from '../../config/sqlconfig-old';
import * as projectDAO from './ProjectDAO';

export const artifactDAO = function (router: any) {
	router.post('/artifacts', function(req: any,res: any) {
		if (req.body.objectId) {
			getArtifacts(req).then(result => res.json(result), err => res.status(500).send('No artifacts found.'));
		} else {
			projectDAO.getAppProject(req).then((projects: any) => {
					if(projects && projects.length > 0){
						req.body.projectId = projects[0];
						getArtifacts(req).then(result => res.json(result), err => res.status(500).send('No artifcats found.'));
					} else {
						res.json(projects);
					}
				}, err => res.status(500).send('No artifacts found.'));
		}
	});
	
	// method to update artifcat details and its attributes, associations
	router.post('/updateArtifact', function(req: any,res: any) {
		var qry = "SET @out_uid=0;SET @out_version=0;SET @out_objcode=0;SET @out_comments=0;"
		+"CALL sp_getArtifactRequirements(?,?,?,?,@out_uid,@out_version,@out_objcode,@out_comments);"
		+"SELECT @out_uid,@out_version,@out_objcode,@out_comments";
		sql.multiQuery(qry,[req.body.orgId,req.body.appId,req.body.artifactId,req.body.objectId],callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				res.status(500).send('Response failed');
			} else if(rows && rows.length > 0) {
				var rowData = rows[rows.length-1], comments = "",
				version = parseInt(rowData[0]['@out_version']),
				promiseReq: any = [];

				console.log("sp_getArtifactRequirements:",rowData[0]);
				console.log("sp_getArtifactRequirements: UID & Version",rowData[0]['@out_uid'],rowData[0]['@out_version']);
				// Create Artifact
				if( req.body.artifactId === 0 ) {
					createArtifact(req,rowData[0]['@out_uid'],rowData[0]['@out_objcode'])
						.then((artifactID)=>{
							req.body.artifactId = artifactID;
							//Create Artifact Status - Obsoleted
							/*if(req.body.statusVO)
								promiseReq.push(saveArtifactStatus(req,version));*/
							//Update Artifact Attributes
							if(req.body.attributes && req.body.attributes.length > 0){
								req.body.attributes.forEach(function(attrVO: any,idx: number){
									if(attrVO.attrVal && attrVO.attrVal !== "")
										promiseReq.push(saveAttributes(req,attrVO,version));
								});
							}
							//Update Associations
							if(req.body.artifactAssociations && req.body.artifactAssociations.length > 0){
								var associationIDs: any = [],deleteAssociationIds: any = [];
								req.body.artifactAssociations.forEach(function(assoc: any,idx: any){
									if(assoc.hasOwnProperty("deleted")) associationIDs.push(assoc.artifactId);
								});
								if(req.body.deleteAssociationIds && req.body.deleteAssociationIds.length > 0){
									req.body.deleteAssociationIds.forEach(function(assoc: any,idx: any){
										deleteAssociationIds.push(assoc.artifactId);
									});
								}
								//promiseReq.push(saveAssociations(req,rowData[0]['@out_version'],associationIDs.toString(),deleteAssociationIds.toString()))
								promiseReq.push(saveAssociations(req,version,req.body.artifactAssociations));
							}
						})
						Promise.all(promiseReq)
						.then(function(result){
								res.json("Artifact created Successfully");
							},function(err){
								console.log("Create Artifact Failed:",err);
								res.status(500).send(`create ${req.body.name} failed`);
							});
				} else { // Update Artifact
					//Update Artifact details
					promiseReq.push(saveArtifactDetails(req,version));
					//Update Artifact Status - Obsoleted
					/*if(req.body.statusVO)
						promiseReq.push(saveArtifactStatus(req,version));*/
					//Update Artifact Attributes
					if(req.body.attributes && req.body.attributes.length > 0){
						req.body.attributes.forEach(function(attrVO: any,idx: any){
							if(attrVO.attrVal && attrVO.attrVal !== "")
								promiseReq.push(saveAttributes(req,attrVO,version));
						});
					}
					//Update Associations
					if(req.body.artifactAssociations && req.body.artifactAssociations.length > 0){
						var associationIDs: any = [],deleteAssociationIds: any = [];
						req.body.artifactAssociations.forEach(function(assoc: any,idx: any){
							if(assoc.hasOwnProperty("deleted"))
							associationIDs.push(assoc.artifactId);
						});
						if(req.body.deleteAssociationIds && req.body.deleteAssociationIds.length > 0){
							req.body.deleteAssociationIds.forEach(function(assoc: any,idx: any){
								deleteAssociationIds.push(assoc.artifactId);
							});
						}
						//promiseReq.push(saveAssociations(req,rowData[0]['@out_version'],associationIDs.toString(),deleteAssociationIds.toString()))
						promiseReq.push(saveAssociations(req,version,req.body.artifactAssociations));
					}
					Promise.all(promiseReq)
					.then(function(result){
							res.json("Artifact Updated Successfully");
						},function(err){
							console.log("Update Artifact Failed:",err);
							res.status(500).send(`updating ${req.body.name} failed`);
						});
				}
			} else {
				console.log("\nartifactDetails response returned empty: ",rows);
				res.status(500).send(`Response ${req.body.id === 0? 'creating':'updating'} ${req.body.name} empty`);
			}
		}		
	});

	/**Route to update artifacts with the projects that are moved into like from Defect->Agile, Backlog->Agile, 
		Agile->Defect,Backlog or other projects excepr permanent documentation**/
	router.post('/artifactsMoveTo',function(req: any,res: any){
		var columns = [],
		qry = "UPDATE light_artifact SET id_project=? WHERE id_org=? AND id_artifact IN("+req.body.artifacts+")";
		sql.query(qry, [req.body.projectId,req.body.orgId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				res.status(500).send('moving artifacts failed');
			} else if(rows) {
				res.json({success: "Updated"});
			}
		}
	})

	router.post('/updateArtifactAgileStatus',function(req: any,res: any){
		var columns = [],
		qry = "UPDATE light_artifact SET status_artifact=? WHERE id_org=? AND id_artifact=?;";
		sql.query(qry, [req.body.artifactStatus,req.body.orgId,req.body.artifactId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				res.status(500).send('artifact status update failed');
			} else if(rows) {
				res.json({success: "Status Updated"});
			}
		}
	})
	router.post('/artifactDetails', function(req: any,res: any) {
		var columns = ['LA.id_artifact','id_object','LP.id_project','type_project','name_project','parent_id_artifact','LA.id_app','LA.id_org',
		'uid_artifact','lock_artifact','html_artifact_name','html_artifact_desc','name_artifact','desc_artifact','LA.version_artifact',
		'effectivedate_artifact','displayseq_artifact','assignedto_artifact','filepath_artifact','comments_artifact','changes_artifact',
		'status_artifact','expected_points_artifact','actual_points_artifact','active_artifact','LA.modified_by','LA.modified_date',
		'id_artifact_attribute','id_app_object_attribute','id_attribute','attribute_value','id_artifacts_association','secondary_id_artifact'],
		qry = "SELECT ?? FROM light_artifact LA LEFT JOIN `light_artifact_attribute` LAA ON LA.id_artifact=LAA.id_artifact LEFT "+
				"JOIN light_artifacts_association LASA ON LA.id_artifact=LASA.primary_id_artifact LEFT JOIN light_project LP ON "+
				"LA.id_project=LP.id_project WHERE LA.id_artifact=?";
		sql.query(qry, [columns, req.body.artifactId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				res.status(500).send('Response failed');
			} else if(rows && rows.length > 0) {
				var rowData = rows[0], artifactVO: any = {},attributes: any = [];
				artifactVO.artifactId = rowData['id_artifact'];
				artifactVO.orgId = rowData['id_org'];
				artifactVO.appId = rowData['id_app'];
				artifactVO.objectId = rowData['id_object'];
				artifactVO.projectId = rowData['id_project'];
				artifactVO.projectName = alterProjectName(parseInt(rowData['type_project']),rowData['name_project']);
				artifactVO.artifactParentId = rowData['parent_id_artifact'];
				artifactVO.artifactUID = rowData['uid_artifact'];

				artifactVO.artifactHtmlName = rowData['html_artifact_name'];//.replace(/&&amd/g, ">").replace(/&amd/g, "<");
				artifactVO.artifactHtmlDesc = rowData['html_artifact_desc'];//.replace(/&&amd/g, ">").replace(/&amd/g, "<");
				artifactVO.artifactName = rowData['name_artifact'];
				artifactVO.artifactDesc = rowData['desc_artifact'];
				
				artifactVO.artifactLock = rowData['artifact_lock']?rowData['artifact_lock']:0;
				artifactVO.artifactEffDate = rowData['effectivedate_artifact'];
				artifactVO.artifactDispSeq = rowData['displayseq_artifact'];
				artifactVO.artifactVersion = rowData['version_artifact'];
				artifactVO.artifactAssignedTo = rowData['assignedto_artifact'];
				artifactVO.artifactFilepath = rowData['filepath_artifact']?rowData['filepath_artifact']:"";
				artifactVO.artifactComments = rowData['comments_artifact']?rowData['comments_artifact']:"";
				artifactVO.artifactChanges = rowData['changes_artifact'];
				artifactVO.artifactStatus = isNaN(parseInt(rowData['status_artifact']))?rowData['status_artifact']:parseInt(rowData['status_artifact']);
				artifactVO.artifactExpectedPoints = rowData['expected_points_artifact'];
				artifactVO.artifactActualPoints = rowData['actual_points_artifact'];
				artifactVO.artifactActive = rowData['active_artifact'];

				artifactVO.artifactLastModified = rowData['modified_date'];
				artifactVO.artifactLastMdBy = rowData['modified_by'];
				rows.forEach(function(row: any,index: number){
					if( row['id_app_object_attribute'] ) {
						var attribute: any = {};
						attribute.artifactAttrId = row['id_artifact_attribute'];
						attribute.appObjAttrId = row['id_app_object_attribute'];
						attribute.attrId = row['id_attribute'];
						attribute.attrVal = row['attribute_value'];
						attributes.push(attribute);
					}
				});
				artifactVO.attributes = attributes;
				artifactVO.artifactAssocId = rowData['id_artifacts_association'];
				artifactVO.artifactSecondaryAssocId = rowData['secondary_id_artifact'];
				var promises = [getArtifactParentList(req),
													getArtifactStatusList(req.body.artifactId),
													getArtifactAssociations(req.body.artifactId,rowData['secondary_id_artifact'])];
				//If not permenant documentation
				if(parseInt(rowData['type_project']) !== -3){
					req.body.projectType = rowData['type_project'];
					promises.push(artifactMoveOptions(req));
				}
				// Artifact News Feed
				promises.push(getArtifactNewsFeed(req));

				var promiseResult = Promise.all(promises);
				promiseResult.then(function(allresult){
					artifactVO.appObjectArtifacts = allresult[0];
					artifactVO.statusList = allresult[1];
					artifactVO.artifactAssociations = allresult[2];
					//If not permenant documentation
					if(parseInt(rowData['type_project']) !== -3)
						artifactVO.artifactMoveOptions = allresult[3];
					artifactVO.newsFeed = allresult[4];
					res.json(artifactVO);
				},function(error){
					res.json(error);
				});
			} else {
				console.log("\nartifactDetails response returned empty: ",rows);
				res.status(500).send(`Response fetching ${req.body.name} empty`);
			}
		}
	});
	
	// Method to get selected object projects & Status items to display in ReqType dashboard screen
	router.post('/getObjectStatusItemsAndProjects', function(req: any,res: any) {
		let statusItems: any = [], projects: any = [];
		//If object type is Defect(-1) or Backlog(-2)
		if(req.body.objectType !== 0){
			getStatusItems(req)
				.then(function(result){
					res.json({status: result});
				});
		}  else {
			res.json({status: undefined});
		}
		/*else {
			Promise.all([getStatusItems(req),getProjects(req)])
				.then(function(result){
					res.json({status: result[0], projects: result[1]});
				});
		}*/
	});

	// artifacts list to create/update an artifact to its parent
	router.post('/getArtifactParentList',function(req: any,res: any) {
		getArtifactParentList(req).then( ( response ) => res.json(response));
	})

	// projects list to move artifact to
	router.post('/artifactMoveOptions',function(req: any,res: any) {
		artifactMoveOptions(req).then( ( response ) => res.json(response));
	})

	/*********** Artifact History ***********/
	router.post('/getArtifactHistory',function(req: any,res: any){
		getArtifactHistory(req).then( (response) => {
			res.json(response);
		}, (err) => res.status(500).send(`Error fetching history`));
	});
};

function createArtifact(req: any,artifactUID: any, objSeqNum: any) {
	return new Promise(function(resolve,reject){
		var qry = "SET @out_status=0;SET @out_artifactId=0;CALL sp_createNewArtifact(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),0,@out_status,@out_artifactId);SELECT @out_status,@out_artifactId;";
		sql.multiQuery(qry, [req.body.orgId,req.body.projectId,req.body.appId,req.body.objectId,req.body.artifactParentId,
			req.body.artifactLock,artifactUID,0,req.body.artifactName,req.body.artifactHtmlName,req.body.artifactDesc,req.body.artifactHtmlDesc,
			req.body.artifactEffDate,req.body.artifactFilepath,req.body.artifactDispSeq,req.body.artifactComments,req.body.artifactChanges,
			req.body.artifactAssignedTo,req.body.artifactStatus,req.body.artifactExpectedPoints,req.body.artifactActualPoints,1,req.body.artifactLastMdBy], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in creating artifact: ",err);
				reject(err);
			} else if(rows && rows.length > 0){
				var rowData = rows[rows.length-1];
				//console.log(rowData[0]['@out_artifactId']);
				updateObjectSeqNumber(rowData[0]['@out_artifactId'], req.body.objectId, objSeqNum).then((artifactID)=>resolve(artifactID));
			} else {
				console.log("\ncreate artifact failed: ",rows);
				reject("Create Artifact Failed");
			}
		}
	});
}

//method to update object squence number after an artifact is created
function updateObjectSeqNumber(artifactID: any,objectId: any,objSeqNum: any) {
	return new Promise((resolve,reject)=>{
		var columns = ['id_artifact','name_artifact'],
		qry = "UPDATE light_object SET seqnum_object =? WHERE id_object=?;";
		sql.query(qry,[objSeqNum+1,objectId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				reject(err);
			} else if(rows && rows.length > 0) {				
				resolve(artifactID);
			} else {
				console.log("\nupdateObjectSeqNumber updated: ",rows);				
				resolve(artifactID);
			}
		}
	})
}

function saveArtifactDetails(req: any,version: any,comments?: any) {
	return new Promise(function(resolve,reject){
		var qry = "SET @out_status=0;CALL sp_updateArtifact(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@out_status);SELECT @out_status;";
		sql.multiQuery(qry, [req.body.orgId,req.body.artifactId,req.body.projectId,req.body.appId,req.body.objectId,req.body.artifactParentId,
			req.body.artifactLock,version,req.body.artifactName,req.body.artifactHtmlName,req.body.artifactDesc,req.body.artifactHtmlDesc,
			req.body.artifactEffDate,req.body.artifactFilepath,req.body.artifactDispSeq,req.body.artifactComments,req.body.artifactChanges,req.body.artifactAssignedTo,
			req.body.artifactStatus,req.body.artifactExpectedPoints,req.body.artifactActualPoints,1,req.body.artifactLastMdBy], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in updating artifact: ",err);
				reject(err);
			} else if(rows && rows.length > 0){
				var rowData = rows[rows.length-1];
				console.log(rowData[0]['@out_status']);
				resolve(rowData[0]['@out_status']);
			} else {
				console.log("\nUpdate failed: ",rows);
				reject("Artifact Update Failed");
			}
		}
	});
}

function saveArtifactStatus(req: any,version: any) {
	return new Promise(function(resolve,reject){
		var columns = [], 
		qry = "SET @statusId=0;CALL sp_createArtifactStatus(?,?,?,?,?,?,@statusId);SELECT @statusId;";
		sql.multiQuery(qry, [req.body.orgId,req.body.artifactId,version,req.body.statusVO.status,req.body.statusVO.assignedTo,req.body.statusVO.comments], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in updating artifact status: ",err);
				reject(err);
			} else if(rows && rows.length > 0){
				var rowData = rows[rows.length-1];
				console.log(rowData[0]['@statusId']);
				resolve(rowData[0]['@statusId']);
			} else {
				console.log("\nUpdate artifact status failed: ",rows);
				reject("Artifact status Update Failed");
			}
		}
	});
}
function saveAttributes(req: any,attrVO: any,version: any) {
	return new Promise(function(resolve,reject){
		var columns = [], 
		qry = "";
		if(attrVO.artifactAttrId === 0){
			columns = [req.body.orgId,req.body.appId,attrVO.appObjAttrId,req.body.artifactId,attrVO.attrId,attrVO.attrVal,version];
			qry = "CALL sp_createArtifactAttribute(?,?,?,?,?,?,?)";
		}else{
			columns = [attrVO.artifactAttrId,attrVO.attrVal,version];
			qry = "CALL sp_updateArtifactAttribute(?,?,?);";
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in updating artifact attributes: ",err);
				reject(err);
			} else if(rows){
				console.log("Update Attributes: affectedRows",rows.affectedRows);
				resolve("SUCCESS");
			}/* else {
				console.log("\nUpdate attributes failed: ",rows);
				reject("Artifact attributes Update Failed");
			}*/
		}
	});
}
function saveAssociations(req: any,version: any,associations: any) {//secondaryArtifactIds,deleteAssociationIds
	return new Promise(function(resolve,reject){
		//console.log("Save associations start:",secondaryArtifactIds);
		var allFindPromises: any = [], allSavePromises: any = [], secondaryArtifactIds: any = [];
		// for each association
		associations.forEach(function(assoc: any,idx: number){
			// if association is not deleted
			if(!assoc.hasOwnProperty("deleted") || assoc.deleted == false){
				secondaryArtifactIds.push(assoc.artifactId);
				//if association isn't added yet (ie., no primaryArtifactId)
				if(!assoc.hasOwnProperty("primaryArtifactId"))
					allFindPromises.push(findAssociation("add",assoc.artifactId,req.body.artifactId));
			} else {
				allFindPromises.push(findAssociation("delete",assoc.artifactId,req.body.artifactId));
			}
		});
		allFindPromises.push(findAssociation("updatePrimary",req.body.artifactId,secondaryArtifactIds.toString()));
		/*if(secondaryArtifactIds && secondaryArtifactIds !== ""){
			var artifactIDs = secondaryArtifactIds.split(",");
			artifactIDs.forEach(function(id,idx){
				//console.log("find secondary association start:",id);
				allFindPromises.push(findAssociation(id,req.body.artifactId));
			});
		}
		if(deleteAssociationIds && deleteAssociationIds.length > 0){
			var artifactIDs = deleteAssociationIds.split(",");
			artifactIDs.forEach(function(id,idx){
				//console.log("find secondary association start:",id);
				allFindPromises.push(findAssociation(id,req.body.artifactId,true));
			});
		}*/
		var promiseAll = Promise.all(allFindPromises);
		promiseAll.then(
			function(result: any){
				console.log("All associations result:",result);
				result.forEach(function(eachResult: any,idx: number){
					if(eachResult.result !== -1)//0->Create,-1->already exists do nothing, -2->delete and update, others->update
						allSavePromises.push(createUpdateAssociation(eachResult.result,req,version,eachResult.primaryArtifactId,eachResult.secondaryArtifactId));	
				});
				var promises = Promise.all(allSavePromises);
				promises.then(function(result){
					resolve(result);
				},function(error){
					reject(error);
				});
			},
			function(error){
				console.log("All associations error:",error);
				reject(error);
		});
	});
}
function createUpdateAssociation(result: any,req: any,version: any,primaryArtifactId: any,secondaryArtifactId: any) {
	return new Promise(function(resolve,reject){
		console.log("Start "+((result === 'add')?'create':'update')+" associations:",result,primaryArtifactId,secondaryArtifactId);
		var columns = [req.body.orgId,primaryArtifactId,secondaryArtifactId,version,req.body.artifactLastMdBy],
		qryCreate = "SET @out_status=0;CALL sp_createNewArtifactAssociate(?,?,?,0,0,?,?,now(),@out_status);SELECT @out_status;",
		qryUpdate = "SET @out_status=0;CALL sp_updateArtifactAssociate(?,?,?,0,0,?,?,now(),@out_status);SELECT @out_status;";
		if(result === "add"){
			console.log("create association query:",qryCreate);
			sql.multiQuery(qryCreate, columns, callback);
		} else {
			console.log("update association query:",qryUpdate);
			sql.multiQuery(qryUpdate, columns, callback);
		}
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in "+(result === 0)?'create':'update'+" association: ",err);
				reject(err);
			} else if(rows && rows.length > 0){
				var rowData = rows[0];
				console.log(rowData);
				resolve(0);
			} else {
				console.log("\n"+(result === 0)?'created':'updated'+" association: ",rows);
				resolve(0);
			}
		}
	});
}
function findAssociation(action: any,primaryArtifactId: any,secondaryArtifactId: any) {
	return new Promise(function(resolve,reject){
		var columns = ['id_artifacts_association','secondary_id_artifact'],
		qry = "SELECT ?? FROM light_artifacts_association WHERE primary_id_artifact=?";
		sql.query(qry, [columns,primaryArtifactId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in finding association: ",err);
				reject(err);
			} else if(rows && rows.length > 0){
				var rowData = rows[0],
				rowSecondaryIds = (rowData['secondary_id_artifact'] === "")?[]:rowData['secondary_id_artifact'].split(",");
				if(action === "updatePrimary"){
					resolve({result:"update",primaryArtifactId:primaryArtifactId,secondaryArtifactId:secondaryArtifactId});
				} else if(action === "add"){
					rowSecondaryIds.push(secondaryArtifactId);
					resolve({result:"update",primaryArtifactId:primaryArtifactId,secondaryArtifactId:rowSecondaryIds.toString()});
				} else if(action === "delete"){
					if(rowSecondaryIds && rowSecondaryIds.length > 0)
						rowSecondaryIds.splice(rowSecondaryIds.indexOf(secondaryArtifactId),1);
					resolve({result:action,primaryArtifactId:primaryArtifactId,secondaryArtifactId:rowSecondaryIds.toString()});
				}
			} else {
				console.log("\nNo association found: ",rows);
				resolve({result:'add',primaryArtifactId:primaryArtifactId,secondaryArtifactId:secondaryArtifactId});
			}
		}
	});
}
/*function findAssociation(primaryArtifactId,secondaryArtifactId,doDelete=false) {
	return new Promise(function(resolve,reject){
		var columns = ['id_artifacts_association','secondary_id_artifact'],
		qry = "SELECT ?? FROM light_artifacts_association WHERE primary_id_artifact=?";
		sql.query(qry, [columns,primaryArtifactId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in finding association: ",err);
				reject(err);
			} else if(rows && rows.length > 0){
				var rowData = rows[0],rowSecondaryIds = rowData['secondary_id_artifact'];
				if(doDelete && rowSecondaryIds.indexOf(secondaryArtifactId) !== -1) {
					var secondaryIds = rowSecondaryIds.split(",");
					secondaryIds.splice(secondaryIds.indexOf(secondaryArtifactId),1);
					resolve({result : rowData['id_artifacts_association'], primaryArtifactId : primaryArtifactId,
						secondaryArtifactId : secondaryIds.length > 0 ? secondaryIds.toString() : secondaryArtifactId });
				} else if(rowSecondaryIds.indexOf(secondaryArtifactId) == -1) {
					resolve({result:rowData['id_artifacts_association'],primaryArtifactId:primaryArtifactId,
						secondaryArtifactId:rowSecondaryIds !== ""?rowSecondaryIds+","+secondaryArtifactId:secondaryArtifactId});
				} else {
					resolve({result:-1,primaryArtifactId:primaryArtifactId,secondaryArtifactId:secondaryArtifactId});
				}
			} else {
				console.log("\nNo association found: ",rows);
				resolve({result:0,primaryArtifactId:primaryArtifactId,secondaryArtifactId:secondaryArtifactId});
			}
		}
	});
}*/
function getStatusItems(req: any){
	return new Promise(function(resolve,reject){
		var columns = ['LAV.id_attribute', 'id_attribute_value', 'value_attribute', 'default_attribute','name_attribute'],
		qry = "SELECT ?? FROM light_attribute_value LAV LEFT JOIN light_attribute LA ON LAV.id_attribute=LA.id_attribute "+
		"WHERE LAV.active=1 AND LAV.id_attribute = (SELECT LA.id_attribute FROM light_object_attribute LOA LEFT JOIN "+
		"light_attribute LA ON LOA.id_attribute=LA.id_attribute WHERE id_object="+
		"(SELECT LAOA.id_object FROM light_app_object_attribute LAOA LEFT JOIN light_object LO ON "
		+"LAOA.id_object=LO.id_object WHERE LAOA.id_org=? AND LAOA.id_app=? AND LO.type_object=? GROUP BY LO.id_object) AND "+
		"system_attribute=-1) ORDER BY order_value_attribute;";
		sql.query(qry, [columns,req.body.orgId,req.body.appId,req.body.objectType], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				reject(err);
			} else if(rows && rows.length > 0) {
				let statusItems: any = [];
				rows.forEach(function(rowData: any, index: number){
					var attrVO: any = {};
					attrVO.attributeId = rowData['id_attribute'];
					attrVO.attrValueId = rowData['id_attribute_value'];
					attrVO.attrValue = rowData['value_attribute'];
					attrVO.attrDefault = rowData['default_attribute'];
					attrVO.attrName = rowData.name_attribute.replace(/\s/g,'');
					statusItems.push(attrVO);
				})
				resolve(statusItems);
			} else {
				console.log("\nNo Status attributes found: ",rows);
				resolve({error: "No Status attribute found"});
			}
		}
	});
}

function getProjects(req: any){
	return new Promise(function(resolve,reject){
		var columns = ['id_project', 'name_project', 'active_project'],
		qry = "SELECT ?? FROM light_project WHERE id_project in (SELECT id_project FROM light_artifact WHERE id_app=? GROUP BY id_project) AND type_project > -1;";
		sql.query(qry, [columns, req.body.appId, req.body.objectId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				reject(err);
			} else if(rows && rows.length > 0) {
				let projects: any = [];
				rows.forEach(function(rowData: any, index: number){
					var projectVO: any = {};
					projectVO.projectId = rowData['id_project'];
					projectVO.projectName = rowData['name_project'];
					projectVO.projectActive = rowData['active_project'];
					projects.push(projectVO);
				})
				resolve(projects);
			} else {
				console.log("\nNo Projects found: ",rows);
				resolve({error:'No Projects found'});
			}
		}
	});
}
function getArtifactParentList(req: any) {
	return new Promise(function(resolve, reject){
		var columns = ['id_artifact','name_artifact'],
		qry = "SELECT ?? FROM light_artifact WHERE id_org=? AND id_app=? AND id_object=? AND id_artifact != ? ORDER BY id_artifact;";
		sql.query(qry,[columns,req.body.orgId, req.body.appId, req.body.objectId, req.body.artifactId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				reject(err);
			} else if(rows && rows.length > 0) {
				var artifactList: any = [];
				rows.forEach(function(rowData: any, index: any){
					var artifact: any = {};
					artifact.artifactId = rowData['id_artifact'];
					artifact.artifactName = rowData['name_artifact'];
					artifactList.push(artifact);
				});
				resolve(artifactList);
			} else {
				console.log("\ngetArtifactParentList empty: ",rows);				
				resolve({error:"getArtifactParentList empty"});
			}
		}
	});
}
function getArtifactStatusList(artifactID: any) {
	return new Promise(function(resolve, reject){
		var columns = ['id_status','version_artifact','status_artifact',"CONCAT(fname_employee,' ',lname_employee) assignedto_artifact",'comments_status','LAS.modified_date'],
		qry = "SELECT id_status,version_artifact,status_artifact,CONCAT(fname_employee,' ',lname_employee) assignedto_artifact,comments_status,LAS.modified_date FROM light_artifact_status LAS LEFT JOIN light_employee LE ON LAS.assignedto_artifact=LE.id_employee WHERE id_artifact=?;";
		sql.query(qry,[artifactID], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				reject(err);
			} else if(rows && rows.length > 0) {
				var statusList: any = [], status: any = {};
				rows.forEach(function(rowData: any, index: number){
					status = {};
					status.status = rowData['status_artifact'];
					status.assignedTo = rowData['assignedto_artifact'];
					status.comment = rowData['comments_status'];
					status.modifiedDate = rowData['modified_date'];
					statusList.push(status);
				});
				resolve(statusList);
			} else {
				console.log("\ngetAttributeItems empty: ",rows);				
				resolve({error:"getAttributeItems empty"});
			}
		}
	});
}
function getArtifactAssociations(artifactID: any,secondaryArtifactIds: any) {
	return new Promise(function(resolve, reject){
		if(!secondaryArtifactIds || secondaryArtifactIds == null || secondaryArtifactIds == ""){
			resolve({error:"associations empty"});
		} else {
			var columns = ['id_artifact','uid_artifact','name_artifact'],
			qry = "SELECT ?? FROM light_artifact WHERE id_artifact in ("+secondaryArtifactIds+")";
			sql.query(qry, [columns,secondaryArtifactIds], callback);
			function callback(err: any, rows: any, fields: any) {
				if(err) {
					reject(err);
				} else if(rows && rows.length > 0) {
					var artifactsList: any = [], artifactVO: any = {};
					rows.forEach(function(rowData: any, index: number){
						artifactVO = {};
						artifactVO.primaryArtifactId = artifactID;
						artifactVO.artifactId = rowData['id_artifact'];
						artifactVO.artifactUID = rowData['uid_artifact'];
						artifactVO.artifactName = rowData['name_artifact'];
						artifactsList.push(artifactVO);
					});
					resolve(artifactsList);
				} else {
					console.log("\nassociations empty: ",rows);
					resolve({error:'No associations found'});
				}
			}
		}
	});
}
export function getArtifacts(req: any){
	return new Promise(function(resolve,reject){
		var columns = ['id_artifact','parent_id_artifact','id_object','id_project','uid_artifact','name_artifact','desc_artifact',
					'active_artifact','status_artifact','assignedto_artifact'],
			params = [columns,req.body.orgId,req.body.appId],
		qry = "select ?? from light_artifact where id_org=? AND id_app=?";
		if(req.body.objectId){
			qry += " AND id_object IN("+req.body.objectId+")";
			//params.push(req.body.objectId);
		}
		if(req.body.projectId){
			qry += " AND id_project IN("+req.body.projectId+")";
			//params.push(req.body.projectId);
		};
		qry += " AND uid_artifact not like 'UCS%' order by displayseq_artifact;";
		sql.query(qry, params, callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [];
			if(err){
				console.log("\nError in loading artifacts: ",err);
				reject("Error in loading artifacts");
			} else if(rows && rows.length > 0){
				var attributePromise: any = [];
				rows.forEach(function(rowData: any, index: any) {
					var artifactVO: any = {};
					artifactVO.artifactId = rowData['id_artifact'];
					artifactVO.artifactParentId = rowData['parent_id_artifact'];
					artifactVO.objectId = rowData['id_object'];
					artifactVO.projectId = rowData['id_project'];
					artifactVO.artifactUID = rowData['uid_artifact'];
					artifactVO.artifactName = rowData['name_artifact'];
					artifactVO.artifactDesc = rowData['desc_artifact'];
					artifactVO.artifactStatus = rowData['status_artifact'];
					artifactVO.artifactActive = rowData['active_artifact'];
					artifactVO.artifactAssignedTo = rowData['assignedto_artifact'];
					attributePromise.push(getArtifactAttributes(artifactVO.artifactId));
					response.push(artifactVO);
				});
				Promise.all(attributePromise)
						.then((result) => {
							if(result){
								result.forEach((eachResult,idx)=>{
									response[idx] = Object.assign(response[idx],eachResult,{Priority:''});
								});
							}
							resolve(response);
						});
			} else {
				console.log("\nNo artifacts found: ",rows);
				resolve({error: "No artifacts found"});
			}
		}
	});
}
function getArtifactAttributes(artifactId: any) {
	return new Promise(function(resolve,reject){
		var columns = ['id_artifact_attribute','LAA.id_attribute','id_app_object_attribute','name_attribute','attribute_value'], 
		qry = "SELECT ?? FROM light_artifact_attribute LAA LEFT JOIN light_attribute LAT ON LAA.id_attribute=LAT.id_attribute where id_artifact=?;";
		sql.query(qry, [columns,artifactId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in fetching attributes: ",err);
				reject(err);
			} else if(rows && rows.length > 0){
				var attributes = [],keys = [], attr: any = {};
				rows.forEach(function(rowData: any, index: number) {
					
					attr[rowData['name_attribute'].replace(/\s/g,'')] = rowData['attribute_value'];
					
					//keys.push(rowData['name_attribute'].replace(' ',''));
					//attributes.push(rowData['attribute_value']);
					//attributes.push(attr);
				});
				console.log("Attributes of "+artifactId+" : ", attr);
				//resolve({attributes: attributes, keys : keys});
				resolve(attr);
			} else {
				console.log("\nNo Attributes found: ",rows);
				resolve([]);
			}
		}
	});
}
// function to get the available options to move back from current project
function artifactMoveOptions(req: any) {
	return new Promise(function(resolve, reject) {
		var columns = ['id_project', 'name_project', 'type_project'], qry;
		if (parseInt(req.body.projectType) === -2) {// Backlog
			qry = "SELECT ?? FROM light_project WHERE id_org=? AND id_app=? AND active_project=1 AND type_project NOT IN (-1,-3);";
		} else if (parseInt(req.body.projectType) === -1) {//Defect
			qry = "SELECT ?? FROM light_project WHERE id_org=? AND id_app=? AND active_project=1 AND type_project NOT IN (-2,-3);";
		} else if (parseInt(req.body.projectType) === -3) {//Perm.doc
			qry = "SELECT ?? FROM light_project WHERE id_org=? AND id_app=? AND active_project=1 AND type_project=-3;";
		} else {
			qry = "SELECT ?? FROM light_project WHERE id_org=? AND id_app=? AND active_project=1 AND type_project!=-3;";
		}
		sql.query(qry, [columns,req.body.orgId,req.body.appId,req.body.projectId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in fetching projects: ",err);
				reject(err);
			} else if(rows && rows.length > 0){
				var response: any = [];
				rows.forEach(function(rowData: any, index: number) {
					var projectVO: any = {};
					projectVO.projectId = rowData['id_project'];
					projectVO.projectName = alterProjectName(parseInt(rowData['type_project']),rowData['name_project']);
					response.push(projectVO);
				});
				resolve(response);
			} else {
				console.log("\nNo projects found: ",rows);
				reject(false);
			}
		}
	})
}

function alterProjectName(projectType: any,projectName: any){
	switch(projectType){
		case -3: return 'Permanent Documentation';
		case -2: return 'Backlog';
		case -1: return 'Defects';
		default: return projectName;
	}
}

function findObject(req: any){
	return new Promise(function(resolve,reject) {
		var columns = ['LO.id_object'],
		qry = "SELECT ?? FROM light_app_object_attribute LAOA LEFT JOIN light_object LO ON LAOA.id_object=LO.id_object "+
				"WHERE LAOA.id_org=? AND LAOA.id_app=?",
		params = [columns, req.body.orgId, req.body.appId];
		if (req.body.objectType) {
			qry += " AND LO.type_object=?";
			params.push(req.body.objectType);
		}
		sql.query(qry, params, callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [];
			if(err) {
				reject(err);
			} else if(rows && rows.length > 0) {
				rows.forEach(function(rowData: any, index: number){
					response.push(rowData.id_object);
				});
				resolve(response);
			} else {
				console.log("\nArtifactDAO: No objects found: ",rows);
				resolve({error: "No objects found"});
			}
		}
	})
}
/********************** Artifact News Feed **********************/
function getArtifactNewsFeed(req: any) {
	return new Promise( ( resolve,reject ) => {
		let columns = ['version_artifact','uid_artifact','name_artifact','desc_artifact','comments_artifact','expected_points_artifact',
						'actual_points_artifact','filepath_artifact','status_artifact','fname_employee'], 
		qry = "SELECT ??,DATE_FORMAT(LAH.modified_date,'%M %d %Y') modifiedDate FROM `light_artifact_history` LAH LEFT JOIN light_employee LE ON LAH.modified_by=LE.id_employee WHERE id_artifact=? ORDER BY version_artifact DESC LIMIT 11;";
		sql.query(qry, [columns,req.body.artifactId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in fetching artifact versions: ",err);
				resolve({message:"Error fetching news feed"});
			} else if( rows && rows.length > 0 ) {
				let news = [],versions: any = [],iv,next;
				rows.forEach( ( rowData: any,index: number ) => {
					versions.push({
						version:rowData['version_artifact'],
						UID:rowData['uid_artifact'],
						name:rowData['name_artifact'],
						desc:rowData['desc_artifact'],
						comment:rowData['comments_artifact'],
						expected:rowData['expected_points_artifact'],
						actual:rowData['actual_points_artifact'],
						files:rowData['filepath_artifact'],
						status:rowData['status_artifact'],
						modifiedBy:rowData['fname_employee'],
						modifiedDate:rowData['modifiedDate']
					})
				});
				for( var i = 0 ; i < versions.length ; ++i ) {
					news.push(versionFindDiff(versions[i],(i === versions.length-1)?undefined:versions[i+1]));
				}
				resolve(news);
			} else {
				console.log("\nNo Artifact versions found: ",rows);
				resolve({message:"No News Feed"});
			}
		}
	});
}

function versionFindDiff(iv: any,next: any) {

	if ( next && iv.name !== next.name ) {
		return `${iv.modifiedBy} changed the name of the ${iv.UID} on ${iv.modifiedDate}`;
	} else if ( next && iv.status !== next.status ) {
		return `${iv.modifiedBy} changed the status of the ${iv.UID} on ${iv.modifiedDate}`;
	} else if ( next && iv.files !== next.files ) {
		return `${iv.modifiedBy} added an attachment and other changes were made on ${iv.modifiedDate}`;
	} else if ( next && iv.desc !== next.desc ) {
		return `${iv.modifiedBy} changed the description of the ${iv.UID} on ${iv.modifiedDate}`;
	} else if ( next && iv.expected !== next.expected ) {
		return `${iv.modifiedBy} added the estimate points of the ${iv.UID} on ${iv.modifiedDate}`;
	} else if ( next && iv.actual !== next.actual ) {
		return `${iv.modifiedBy} changed the actual points of the ${iv.UID} on ${iv.modifiedDate}`;
	} else if ( next && iv.comment !== next.comment ) {
		return `${iv.modifiedBy} added a comment to the ${iv.UID} on ${iv.modifiedDate}`;
	} else if( iv.version === 0 || !next ) {
		return `${iv.modifiedBy} created this ${iv.UID} on ${iv.modifiedDate}`; 
	}
}


/********************** Artifact History **********************/
function getArtifactHistoryOld(req: any){
	return new Promise( ( resolve,reject ) => {
		let columns = ['LAH.id_artifact','name_project','LA.name_artifact','LAH.version_artifact','LAH.name_artifact',
						'LAH.desc_artifact','LAH.effectivedate_artifact','LAH.filepath_artifact','LAH.displayseq_artifact',
						'LAH.comments_artifact','LAH.assignedto_artifact','LAH.status_artifact','LAH.active_artifact',
						'LAH.modified_by','LAH.modified_date'], 
		qry = "SELECT ?? FROM light_artifact_history LAH LEFT JOIN light_artifact LA ON LAH.parent_id_artifact=LA.id_artifact LEFT JOIN light_project LP ON LAH.id_project=LP.id_project WHERE LAH.id_artifact=?;";
		sql.query(qry, [columns,req.body.artifactId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in fetching artifact versions: ",err);
				reject(err);
			} else if( rows && rows.length > 0 ) {
				let versions: any = [],version: any,artifact: any;
				rows.forEach( ( rowData: any,index: number ) => {
					version = {},artifact = {};
					version.version = rowData['version_artifact'];
					version.modifiedDate = rowData['modified_date'];
					version.artifact = artifact;

					artifact.projectName = rowData['name_project'];
					artifact.parent = rowData['LA.name_artifact'];
					artifact.name = rowData['LAH.name_artifact'];
					artifact.desc = rowData['desc_artifact'];
					artifact.effectivedate = rowData['effectivedate_artifact'];
					artifact.filepath = rowData['filepath_artifact'];
					artifact.displayseq = rowData['displayseq_artifact'];
					artifact.comments = rowData['comments_artifact'];
					artifact.assignedTo = rowData['assignedto_artifact'];
					artifact.status = rowData['status_artifact'];
					artifact.active = rowData['active_artifact'];
					artifact.modifiedBy = rowData['modified_by'];
					artifact.visible = ( index === 0 ) ? true : false;
					artifact.selected = false;
					
					versions.push( version );
				});
				getArtifactAttributeHistory(req).then( (attributes: any) => {
					versions.forEach( (artifact: any) => {
						attributes.forEach( (attributes: any) => {
							if(artifact.version === attributes[0].version)
								artifact.attributes = attributes;
						})
					},
					(err: any)=>console.log( err ));
					resolve( versions );
				}); 				
			} else {
				console.log("\nNo Artifact versions found: ",rows);
				reject({error:"No Artifact versions found"});
			}
		}
	});
}

function getArtifactHistory(req: any){
	return new Promise( ( resolve,reject ) => {
		let columns = ['LAH.id_artifact','name_project','LA.name_artifact','LAH.version_artifact',
						'LAH.desc_artifact','LAH.effectivedate_artifact','LAH.filepath_artifact','LAH.displayseq_artifact',
						'LAH.comments_artifact','LAH.assignedto_artifact','LAH.expected_points_artifact','LAH.actual_points_artifact',
						'LAH.status_artifact','LAH.active_artifact','LAH.modified_by','LAH.modified_date'], 
		qry = "SELECT ??,LAH.name_artifact as artifactName FROM light_artifact_history LAH LEFT JOIN light_artifact LA ON LAH.parent_id_artifact=LA.id_artifact LEFT JOIN light_project LP ON LAH.id_project=LP.id_project WHERE LAH.id_artifact=?;";
		sql.query(qry, [columns,req.body.artifactId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in fetching artifact versions: ",err);
				reject(err);
			} else if( rows && rows.length > 0 ) {
				let history: any = [],artifact: any,keys=['name','desc','projectName','parent','effectivedate','filepath','displayseq','comments','assignedTo','status','active'],
				titles=[{
					key: 'version', value: 'Version'
				},{
					key: 'name', value: 'Name'
				},{
				    key: 'desc', value: 'Description', type: 'html'
				},{
				    key: 'projectName', value: 'Iteration/Sprint'
				},{
				    key: 'parent', value: 'Parent Artifact'
				},{
				    key: 'effectivedate', value: 'Effective Date', type: 'date'
				},{
				    key: 'filepath', value: 'Files'
				},{
				    key: 'displayseq', value: 'Display Sequence'
				},{
				    key: 'comments', value: 'Comments'
				},{
				    key: 'assignedTo', value: 'Assigned To'
				},{
				    key: 'expected', value: 'Expected Points'
				},{
				    key: 'actuals', value: 'Actual Points'
				},{
				    key: 'status', value: 'Status'
				},{
				    key: 'active', value: 'Active'
				}];
				rows.forEach( ( rowData: any,index: number ) => {
					artifact = {};
					artifact.version = rowData['version_artifact'];
					artifact.modifiedDate = rowData['modified_date'];
					//version.artifact = artifact;

					artifact.projectName = rowData['name_project'];
					artifact.parent = rowData['LA.name_artifact'];
					artifact.name = rowData['artifactName'];
					artifact.desc = rowData['desc_artifact'];
					artifact.effectivedate = rowData['effectivedate_artifact'];
					artifact.filepath = rowData['filepath_artifact'];
					artifact.displayseq = rowData['displayseq_artifact'];
					artifact.comments = rowData['comments_artifact'];
					artifact.assignedTo = rowData['assignedto_artifact'];
					artifact.expected = rowData['expected_points_artifact'];
					artifact.actuals = rowData['actual_points_artifact'];
					artifact.status = rowData['status_artifact'];
					artifact.active = rowData['active_artifact'];
					artifact.modifiedBy = rowData['modified_by'];
					artifact.visible = ( index === 0 ) ? true : false;
					artifact.selected = false;
					
					history.push( artifact );
				});
				getArtifactAttributeHistory(req).then( (attributesHistory: any) => {
					history.forEach( (artifactVersion: any) => {
						attributesHistory.forEach( (attributeVersion: any) => {
							if(artifactVersion.version === attributeVersion.version) {
								attributeVersion.keys.forEach( (key: any) => {
									if(keys.indexOf(key.key) === -1) {
										keys.push(key.key);
										titles.push({key:key.key,value:key.name})
									}	
									artifactVersion[key.key] = attributeVersion.history[key.key];
								})
							}
						})
					},
					(err: any)=>console.log( err ));
					resolve({titles:titles, history: history});
				}); 				
			} else {
				console.log("\nNo Artifact versions found: ",rows);
				reject("No Artifact versions");
			}
		}
	});
}

function getArtifactAttributeHistory( req: any ){
	return new Promise( ( resolve,reject ) => {
		var columns = ['LAAH.id_attribute','name_attribute','attribute_value','version_artifact'], 
		qry = "SELECT ?? FROM light_artifact_attribute_history LAAH LEFT JOIN light_attribute LA ON LAAH.id_attribute=LA.id_attribute WHERE id_artifact=?;";
		sql.query(qry, [columns,req.body.artifactId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in fetching artifact attribute versions: ",err);
				reject(err);
			} else if(rows && rows.length > 0){
				let versions: any = [],version: any = {},attributes: any = {},keys: any = [];
				rows.forEach( ( rowData: any, index: number ) => {
					/*if( version.version !== rowData['version_artifact'] ) {						
						version = {};attributes = [];versions.push( attributes );
						version._id = rowData['id_attribute'];
						version.key = rowData['name_attribute'].replace(/\s/g,'');
						version.name = rowData['name_attribute'];
						version.value = rowData['attribute_value'];
						version.version = rowData['version_artifact'];
						attributes.push( version );
					} else {
						version = {};
						version._id = rowData['id_attribute'];
						version.key = rowData['name_attribute'].replace(/\s/g,'');
						version.name = rowData['name_attribute'];
						version.value = rowData['attribute_value'];
						version.version = rowData['version_artifact'];
						attributes.push( version );
					}*/

					if( version.version !== rowData['version_artifact'] ) {						
						version = {},attributes = {},keys = [];
						keys.push({key:rowData['name_attribute'].replace(/\s/g,''),name:rowData['name_attribute']});
						attributes[rowData['name_attribute'].replace(/\s/g,'')] = rowData['attribute_value'];
						version.version = rowData['version_artifact'];
						version.keys = keys;
						version.history = attributes;
						versions.push(version);
					} else {
						keys.push({key:rowData['name_attribute'].replace(/\s/g,''),name:rowData['name_attribute']});
						attributes[rowData['name_attribute'].replace(/\s/g,'')] = rowData['attribute_value'];
					}

				});
				resolve( versions );
			} else {
				console.log("\nNo Artifact attribute versions found: ",rows);
				resolve([]);
			}
		}
	});
}

export function getArtifactExpectedActuals( orgId: any, appId: any ){
	return new Promise( ( resolve,reject ) => {
		var columns = ['LP.id_release','name_release','name_project'], 
		qry = "SELECT ??,SUM(expected_points_artifact) expected,SUM(actual_points_artifact) actuals FROM "+
				"light_project LP LEFT JOIN light_project_release LPR on LP.id_release=LPR.id_release LEFT JOIN "+
				"light_artifact LA ON LP.id_project=LA.id_project WHERE LP.id_org=? AND LP.id_app=? AND "+
				"LP.type_project >= 0 GROUP BY LP.id_project;";
		sql.query(qry, [columns,orgId,appId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nError in fetching artifact expected and actuals: ",err);
				reject(err);
			} else if(rows && rows.length > 0){
				let totals: any = [],release: any = {};
				rows.forEach( ( rowData: any, index: number ) => {
					if( release.releaseId !== rowData['id_release'] ) {						
						release = {};release.projects = [];
						release.releaseId = rowData['id_release'];
						release.releaseName = rowData['name_release'];
						release.projects.push({
							projectName:rowData['name_project'],
							expected:rowData['expected'],
							actuals:rowData['actuals']
						});
						totals.push(release);
					} else {
						release.projects.push({
							projectName:rowData['name_project'],
							expected:rowData['expected'],
							actuals:rowData['actuals']
						});
					}

				});
				resolve( totals );
			} else {
				console.log("\nNo Artifact expected and actuals found: ",rows);
				resolve([]);
			}
		}
	});
}