var sql = require('../config/sqlconfig'),
	attributeDAO = require('./AttributeDAO'),
	artifactDAO = require('./ArtifactDAO'),
	projectDAO = require('./ProjectDAO');


var reqtypeDAO = function (router) {
	router.post('/updateRequirementType',(req,res) => {
		let params = [req.body.orgId,req.body.name,req.body.desc,req.body.code,req.body.color,req.body.type,req.body.modifiedByID], qry = "";
		if (req.body.id === 0)
			qry = "SET @out_status_one=0;SET @out_status_two=0;CALL sp_createNewObject(?,?,?,?,?,?,?,now(),@out_status_one,@out_status_two);SELECT @out_status_one,@out_status_two;";
		else {
			qry = "SET @out_status=0;CALL sp_updateObject(?,?,?,?,?,?,?,?,now(),@out_status);SELECT @out_status;";
			params.unshift(req.body.id);
		}
		sql.multiQuery(qry, params, callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nError in saving object: ",err);
				res.status(500).send('Error in saving object');
			} else if(rows && rows.length > 0){
				let promiseAll = [], rowData;
				if( req.body.id === 0) {
					rowData = rows[rows.length-1];
					//create status attribute & status attribute values
					attributeDAO.updateAttribute(req.body.orgId,(req.body.id === 0)?rowData[0]['@out_status_two']:req.body.id,req.body.statusAttr,req.body.values,req.body.modifiedByID);
				}
				if(req.body.attributes.length > 0)
					req.body.attributes.forEach(item => promiseAll.push(attributeDAO.updateObjectAttributes(req.body.orgId,(req.body.id === 0)?rowData[0]['@out_status_two']:req.body.id,item,req.body.modifiedByID)));
				if(req.body.values.length > 0)
					req.body.values.forEach(item => promiseAll.push(attributeDAO.updateAttributeValues(req.body.orgId,(req.body.id === 0)?rowData[0]['@out_status_two']:req.body.statusAttr.id,item,req.body.modifiedByID)));
				Promise.all(promiseAll).then( result => res.json({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`}),
					err => res.json({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`}));
			} else {
				console.log("\nObject created/updated: ",rows);
				res.json({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			}
		}
	})

	router.post('/getObjectDetails',(req,res) => {
		getObjectDetails(req).then(result => res.json(result), err => res.json({error:err}));
	});
	// Get objects, artifacts, attributes of a given application of a project
	router.post('/getAppObjectsArtifactsAttributes',function(req,res){
		let projectResult = [];
		// get App projects 
		/*projectDAO.getAppProject(req)
			.then(function(projectResult){
				if(projectResult && projectResult.length > 0) {
					req.body.projectId = projectResult[0];*/
					// get each project requirement types
					getAppRequirementTypes(req)
						.then(result => {
							if (result && result.length > 0) {
								req.body.objectId = req.body.objectId || result[0].objectId;
								// get first requirement type artifacts & attributes
								Promise.all([attributeDAO.getObjectAttributes(req),artifactDAO.getArtifacts(req)])
									.then(results => res.json({projectDetails:projectResult,requirementTypes: result, attributes: results[0], 
											artifacts: results[1]}),error => res.json({projectDetails:projectResult,requirementTypes: result, attributes: [], artifacts: []}))
							} else {
								res.json({projectDetails:projectResult,requirementTypes: [], attributes: {attrIds:[], appObjAttrIds:[], keys: [], values: [], types: [], attrItems: []}, artifacts: []});
							}					
						},error => res.json({projectDetails:projectResult,requirementTypes: [], attributes: {attrIds:[], appObjAttrIds:[], keys: [], values: [], types: [], attrItems: []}, artifacts: []}));
				/*} else {
					res.json({error: "No projects found"});
				}
			},function(error){
				res.json(error);
			})*/
	});

	router.post('/getObjectArtifacts',function(req,res){
		var columns = [], 
		qry = "CALL sp_getAppObjectArtifacts(?,?);";
		sql.multiQuery(qry, [req.body.appId,req.body.objectId], callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nError in fetching objects artifacts: ",err);
			} else if(rows && rows.length > 0){
				var row = rows[0];
				row.forEach(function(rowData, index) {
					var artifactVO = {};
					artifactVO.selected = false;
					artifactVO.artifactId = rowData['id_artifact'];
					artifactVO.parentUID = rowData['parentUID'];
					artifactVO.artifactUID = rowData['uid_artifact'];
					artifactVO.artifactName = rowData['name_artifact'];
					artifactVO.artifactDesc = rowData['desc_artifact'];
					response.push(artifactVO);
				});
				res.json(response);
			} else {
				console.log("\nempty object artifacts: ",rows);
				res.status(500).send('empty objects artifacts');
			}
		}
	});
	//Objects for association
	router.post('/getAssociateObjects',function(req,res){
		getAssociatedRequirementTypes(req).then(result => res.json(result), err => res.json({error:err}));
	});

	//Objects of an organizations
	router.post('/getRequirementTypes',function(req,res){
		getRequirementTypes(req).then(result => res.json(result),err => res.json({error:err}));
	});

	//get object attributes which are added to a given application
	router.post('/getAppObjectAttributes',function(req,res){
		var columns = ['id_artifact_attribute','LAOA.id_app_object_attribute','LAOA.id_object','LOA.id_attribute','LAOA.active'],
		//qry = "SELECT ?? FROM light_app_object_attribute LAOA LEFT JOIN light_object_attribute LOA ON LAOA.id_object_attribute=LOA.id_object_attribute WHERE LAOA.id_org=? and id_app=? ORDER BY LAOA.id_object";
		qry = "SELECT ?? FROM light_app_object_attribute LAOA LEFT JOIN light_object_attribute LOA ON LAOA.id_object_attribute=LOA.id_object_attribute "+
				"LEFT JOIN light_artifact_attribute LAA ON LAOA.id_app_object_attribute=LAA.id_app_object_attribute WHERE LAOA.id_org=? and LAOA.id_app=? "+
				"ORDER BY LAOA.id_object";
		sql.query(qry, [columns,req.body.orgId,req.body.appId], callback);
		function callback(err, rows, fields) {
			var response = [],objectVO = {};
			if(err){
				console.log("\nget app object attributes Failed: ",err);
				res.json({error:"get app object attributes Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					if(objectVO.id === rowData['id_object']) {
						objectVO.attributes.push({artifactAttrId:rowData['id_artifact_attribute'],id:rowData['id_attribute'],appObjAttrId:rowData['id_app_object_attribute'],active:rowData['active']});
					} else {
						//If number of attributes are 1, then its object with no attributes. So copy appObjAttrId into object and remove attribute
						if(objectVO.attributes && objectVO.attributes.length > 0) {
							let nullAttrIdx =  -1;
							objectVO.attributes.some((attr,idx)=>{
								if(attr.id === null) {
									nullAttrIdx = idx;
									return true;
								}
							})
							if( nullAttrIdx !== -1) {
								objectVO.appObjAttrId = objectVO.attributes[nullAttrIdx].appObjAttrId;
								objectVO.active = objectVO.attributes[nullAttrIdx].active;
								objectVO.attributes.splice(nullAttrIdx,1);
							}
						}
						objectVO = {};objectVO.attributes = [];
						objectVO.id = rowData['id_object'];
						// when Object has its own App Obj Attr ID where Attr Id is null
						if( !rowData['id_attribute'] ) objectVO.appObjAttrId = rowData['id_app_object_attribute'];
						objectVO.attributes.push({artifactAttrId:rowData['id_artifact_attribute'],id:rowData['id_attribute'],appObjAttrId:rowData['id_app_object_attribute'],active:rowData['active']});
						response.push(objectVO);
					}
				});
				//If number of attributes are 1, then its object with no attributes. So copy appObjAttrId into object and remove attribute
				objectVO = response[response.length-1];
				if(objectVO && objectVO.attributes && objectVO.attributes.length > 0) {
					let nullAttrIdx =  -1;
					objectVO.attributes.some((attr,idx) => {
						if(attr.id === null) {
							nullAttrIdx = idx;
							return true;
						}
					})
					if( nullAttrIdx !== -1) {
						objectVO.appObjAttrId = objectVO.attributes[nullAttrIdx].appObjAttrId;
						objectVO.active = objectVO.attributes[nullAttrIdx].active;
						objectVO.attributes.splice(nullAttrIdx,1);
					}
				}
				res.json(response);	
			} else {
				console.log("\nNo app object attributes: ",rows);
				res.json({error:"No app object attributes"});
			}
		}
	})
};

function getAssociatedRequirementTypes(req){
	return new Promise(function(resolve,reject){
		var columns = ['id_object', 'name_object', 'code_object', 'color', 'seqnum_object'],
		qry = "SELECT ?? FROM light_object WHERE id_object IN(SELECT id_object FROM light_artifact WHERE id_org=?"+
				" AND id_app=? AND id_project IN(SELECT id_project FROM light_project WHERE id_org=? AND id_app=? "+
				"AND type_project=?) GROUP BY id_object) AND id_org=? AND parent_id_object=0";
		if(req.body.projectType && req.body.projectType !== 0)
			sql.query(qry, [columns,req.body.orgId,req.body.appId,req.body.orgId,req.body.appId,req.body.projectType,req.body.orgId], callback);
		else {
			qry = "SELECT ?? FROM light_object WHERE id_object IN(SELECT id_object FROM light_app_object_attribute WHERE "+
					"id_org=? AND id_app=?) AND parent_id_object=0";
			sql.query(qry, [columns,req.body.orgId,req.body.appId], callback);			
		}
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget user project RequirementTypes Failed: ",err);
				reject({error:"get user project RequirementTypes Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var objectVO = {};
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

// method to get requirement types related to a given app & project type
function getAppRequirementTypes(req){
	return new Promise(function(resolve,reject){
		var columns = ['id_object', 'name_object', 'code_object', 'color', 'seqnum_object'],
		qry = "";
		//if(req.body.projectType !== 0) {
			qry = "SELECT ?? FROM light_object WHERE id_object IN(SELECT id_object FROM light_app_object_attribute WHERE id_org=?"+
					" AND id_app=? GROUP BY id_object) AND id_org=? AND parent_id_object=0 AND type_object=?;";
			sql.query(qry, [columns,req.body.orgId,req.body.appId,req.body.orgId,req.body.objectType], callback);
		/*} else {
			qry = "SELECT ?? FROM light_object WHERE id_object IN(SELECT id_object FROM light_app_object_attribute WHERE "+
					"id_org=? AND id_app=?) AND parent_id_object=0";
			sql.query(qry, [columns,req.body.orgId,req.body.appId], callback);			
		}*/
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget user project RequirementTypes Failed: ",err);
				reject({error:"get user project RequirementTypes Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var objectVO = {};
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

function getObjectDetails(req) {
	return new Promise(function(resolve,reject){
		var columns = ['LO.id_object','name_object','desc_object','system_object','code_object','color','seqnum_object','type_object',
						'LA.id_attribute','id_attribute_value','value_attribute'],
		qry = "SELECT ?? FROM light_object LO LEFT JOIN light_object_attribute LOA ON LO.id_object=LOA.id_object LEFT JOIN light_attribute LA ON LOA.id_attribute=LA.id_attribute LEFT JOIN light_attribute_value LAV ON LA.id_attribute=LAV.id_attribute WHERE LO.id_org=4 AND LA.id_attribute=56";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [],objectVO = {},attributeVO = {},attributes = [];
			if(err){
				console.log("\nget RequirementTypes Failed: ",err);
				reject({error:"get RequirementTypes Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach((rowData, index) => {
					
					
				});
				resolve(response);	
			} else {
				console.log("\nNo RequirementType: ",rows);
				resolve({error:"No RequirementType"});
			}
		}
	});
}

function updateAppObjAttributes(req) {
	return new Promise((resolve, reject) => {
		if( req.body.types && req.body.types.length > 0) {
			let promiseAll = [];
			req.body.types.forEach( item => {
				promiseAll.push(promiseAppObjAttr(req.body.orgId,req.body.id,item,req.body.modifiedByID));
			});
			Promise.all(promiseAll).then( response => resolve(true), err => resolve(err) );
		} else {
			resolve(true);
		}
	})
}

function promiseAppObjAttr(orgId, appId, type, modifiedByID) {
	return new Promise((resolve,reject) => {
		let qry = "",columns = [orgId,appId,type.id,type.objAttrId,modifiedByID];
		if( type.appObjAttrId === 0) {
			qry = "CALL sp_createAppObjectAttribute(?,?,?,?,?,now());";
			sql.multiQuery(qry, columns, callback);
		} else {
			columns = [type.objAttrId,type.active,orgId,appId,type.appObjAttrId];
			qry = "UPDATE light_app_object_attribute SET id_object_attribute=?,active=? WHERE id_org=? AND id_app=? AND id_app_object_attribute=?;";
			sql.query(qry, columns, callback);
		}
		function callback(err, rows, fields) {
			if(err){
				console.log("\nAppObjAttribute failed to update: ",err);
				reject(false);
			} else if(rows && rows.length > 0){
				 resolve(true);
			} else {
				console.log("\nAppObjAttribute update empty: ",rows);
				resolve(true);
			}
		}
	})
}

function getRequirementTypes(req) {
	return new Promise(function(resolve,reject){
		var columns = ['LOA.active','LOA.id_object_attribute','LO.id_object','name_object','desc_object','system_object','code_object','color','seqnum_object','type_object',
						'LA.id_attribute','name_attribute','desc_attribute','system_attribute','fname_employee','lname_employee','LO.modified_date'],
		qry = "SELECT ?? FROM `light_object` LO LEFT JOIN light_object_attribute LOA ON LO.id_object=LOA.id_object LEFT JOIN light_attribute LA ON "+
				"LOA.id_attribute=LA.id_attribute LEFT JOIN light_employee LE ON LO.modified_by=LE.id_employee WHERE LO.id_org=? ORDER BY LO.id_object;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [],objectVO = {},attributeVO = {},attributes = [];
			if(err){
				console.log("\nget RequirementTypes Failed: ",err);
				reject({error:"get RequirementTypes Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach((rowData, index) => {
					if(objectVO.id === rowData['id_object']) {
						if( rowData['id_attribute'] ) {
							attributeVO = {};
							attributeVO.id = rowData['id_attribute'];
							attributeVO.objAttrId = rowData['id_object_attribute'];
							attributeVO.name = rowData['name_attribute'];
							attributeVO.desc = rowData['desc_attribute'];
							attributeVO.system = rowData['system_attribute'];
							attributeVO.active = rowData['active'];
							attributeVO.checked = false;
							attributes.push(attributeVO);
						}
					} else {
						objectVO = {};
						objectVO.id = rowData['id_object'];
						objectVO.name = rowData['name_object'];
						objectVO.desc = rowData['desc_object'];
						objectVO.system = rowData['system_object'];
						objectVO.code = rowData['code_object'];
						objectVO.color = rowData['color'];
						objectVO.seqnum = rowData['seqnum_object'];
						objectVO.type = rowData['type_object'];
						objectVO.modifiedBy = rowData['fname_employee'] + " " + rowData['lname_employee'];
						objectVO.modifiedDate = rowData['modified_date'];
						objectVO.checked = false;
						attributes = [];
						if( rowData['id_attribute'] ) {
							attributeVO = {};
							attributeVO.id = rowData['id_attribute'];
							attributeVO.objAttrId = rowData['id_object_attribute'];
							attributeVO.name = rowData['name_attribute'];
							attributeVO.desc = rowData['desc_attribute'];
							attributeVO.system = rowData['system_attribute'];
							attributeVO.active = rowData['active'];
							attributeVO.checked = false;
							attributes.push(attributeVO);
						}
						objectVO.attributes = attributes;
						response.push(objectVO);
					}
				});
				resolve(response);	
			} else {
				console.log("\nNo RequirementTypes: ",rows);
				resolve({error:"No RequirementTypes"});
			}
		}
	});
}

module.exports = {reqtypeDAO,updateAppObjAttributes};