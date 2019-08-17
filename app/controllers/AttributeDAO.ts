import * as sql from '../../config/sqlconfig-old';

export const attributeDAO = (router: any) => {	
	//Get all attributes for admin settings module
	router.post('/getAllAttributes',(req: any,res: any) => {
		getAllAttributes(req).then( attributes => res.json(attributes),error => res.json(error) );
	});

	router.post('/updateAttribute',(req: any,res: any) => {
		updateAttribute(req.body.orgId,null,req.body,req.body.values,req.body.modifiedByID).then(result => res.json({success:`${req.body.name} ${(req.body.id === 0)?'created':'updated'} successfully`}),
			error => res.json({success:`Failed ${(req.body.id === 0)?'creating':'updating'} ${req.body.name}`}));
	});

	router.post('/objectAttributes', function(req: any,res: any) {
		if (req.body.objectId) {
			getObjectAttributes(req).then(result => res.json(result),error => res.json(error));
		} else {
			findObject(req).then((objects: any) => {
					if(objects && objects.length > 0){
						req.body.objectId = objects[0];
						getObjectAttributes(req).then(objectAttributes => res.json(objectAttributes));
					} else {
						res.json(objects);
					}
				})
		}
	});
	router.post('/getAttributeValues',(req: any,res: any) => {
		getAttributeValues(req.body.orgId,req.body.attributeId,true).then(result => res.json(result), err => res.json({error:err}));
	})
	// This method not in use. Re-Check to remove this.
	router.post('/getRequirementTypeStatusAttributeValues',(req: any,res: any) => {
		var columns = ['id_attribute_value', 'value_attribute', 'active', 'id_attribute'],
		qry = "SELECT ?? FROM light_attribute_value WHERE id_attribute IN(SELECT id_attribute FROM light_attribute WHERE system_attribute=-1 "+
				"AND id_attribute IN ( SELECT id_attribute FROM light_object_attribute WHERE id_object IN"+
				"(SELECT LO.id_object FROM light_app_object_attribute LAOA LEFT JOIN light_object LO ON LAOA.id_object=LO.id_object WHERE "+
				"LAOA.id_org=? AND LAOA.id_app=? AND LO.type_object=-1))) AND active=1 ORDER BY order_value_attribute,id_attribute_value;";
		sql.query(qry, [columns,req.body.orgId,req.body.appId], callback);
		function callback(err: any, rows: any, fields: any) {
			let response: any = []
			if(err){
				console.log("\nget attribute values Failed: ",err);				
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData: any, index: any) {
					let attributeVO: any = {};
					attributeVO.id = rowData['id_attribute_value'];
					attributeVO.attrId = rowData['id_attribute'];
					attributeVO.value = rowData['value_attribute'];
					attributeVO.active = rowData['active'];
					response.push(attributeVO);
				});
				res.json(response);	
			} else {
				console.log("\nNo attribute values: ",rows);
				res.json({error:"No attribute values found"});
			}
		}
	});

	router.post('/getObjectArtifactAttributes',(req: any,res: any) => {
		getArtifactAttributes(req).then( result => res.json(result), err => res.json({error:err}) );
	});
};
function findObject(req: any){
	return new Promise(function(resolve,reject) {
		var columns = ['LO.id_object'],
		qry = "SELECT ?? FROM light_app_object_attribute LAOA LEFT JOIN light_object LO ON LAOA.id_object=LO.id_object WHERE LAOA.id_org=? AND LAOA.id_app=?",
		params = [columns, req.body.orgId, req.body.appId];
		if (req.body.objectType) {
			qry += " AND LO.type_object=?";
			params.push(req.body.objectType);
		}
		sql.query(qry, params, callback);
		function callback(err: any, rows: any, fields: any) {
			let response: any = [];
			if(err) {
				reject(err);
			} else if(rows && rows.length > 0) {
				rows.forEach(function(rowData: any, index: any){
					response.push(rowData.id_object);
				});
				resolve(response);
			} else {
				console.log("\n AttributeDAO: No objects found: ",rows);
				resolve(response);
			}
		}
	})
}

function getAttributeValues(orgId: any, attrId: any, getAll?: any) {
	return new Promise((resolve,reject) => {
		var columns = ['id_attribute_value','value_attribute','default_attribute','order_value_attribute','active','id_attribute'],
		qry = "SELECT ?? FROM light_attribute_value WHERE id_attribute=? AND id_org=?";
		if(getAll)// where includes inactive values too
			qry += " ORDER BY order_value_attribute;";
		else
			qry += " AND active=1 ORDER BY order_value_attribute;";

		sql.query(qry, [columns, attrId, orgId], callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				reject(err);
			} else if(rows && rows.length > 0) {
				let attributeValues: any = [];
				rows.forEach(function(rowData: any, index: any){
					attributeValues.push({
						id:rowData['id_attribute_value'],
						attrId:rowData['id_attribute'],
						value:rowData['value_attribute'],
						active:rowData['active'],
						order:rowData['order_value_attribute'],
						defaultType: ""+rowData['default_attribute']
					});
				})
				resolve(attributeValues);
			} else {
				console.log("\ngetAttributeValues empty: ",rows);				
				resolve({error:"No Attribute Values found"});
			}
		}
	});
}

export const updateAttributeValues = (orgId: any,attrId: any,row: any,modifiedBy: any) => {
	return new Promise( (resolve,reject) => {
		let params = [], qry = "";
		if(row.id === 0) {
			params = [orgId,attrId,row.value,row.defaultType,0,modifiedBy];
			qry = "CALL sp_createNewAttributeValue(?,?,?,?,?,?,now());";
			sql.multiQuery(qry, params, callback);
		} else {
			params = [row.value,row.defaultType,row.order,row.active,modifiedBy,orgId,row.id];
			qry = "UPDATE light_attribute_value SET value_attribute=?, default_attribute=?, order_value_attribute=?, active=?, modified_by=?, modified_date=now() WHERE id_org=? AND id_attribute_value=?;";
			sql.query(qry, params, callback);
		}
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nupdate attribute values Failed: ",err);
				reject(false);
			} else if(rows && rows.length > 0){
				console.log("\nupdate attribute values created/updated: ",rows);
				resolve(true);
			} else {
				console.log("\nupdate attribute values created/updated: ",rows);
				resolve(true);
			}
		}	
	})
}

function findStatusAttribute(appId: any){
	return new Promise(function(resolve,reject){
		/* let columns = ['id_attribute_value', 'name_attribute'], 
		qry = "SELECT ?? FROM `light_project_release` WHERE id_release IN (SELECT id_release FROM `light_project` WHERE id_org=? AND id_app=? GROUP By id_release) ORDER BY modified_date DESC;";
		sql.query(qry, [columns,req.body.employeeId,req.body.orgId], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [], promiseCount = 0;
			if(err){
				console.log("\nget user app releases Failed: ",err);				
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData: any, index: any) {
					var releaseVO: any = {};
					releaseVO.releaseId = rowData['id_release'];
					releaseVO.releaseName = rowData['name_release'];
					response.push(releaseVO);
				});
				res.json(response);	
			} else {
				console.log("\nError in fetching user application releases: ",rows);
				//throw "Login Failed";
				res.status(500).send('Error in fetching user applications releases');
			}
		} */
	});
}
export const getObjectAttributes = (req: any) => {
	return new Promise(function(resolve,reject){
		var columns = ['LAOA.id_app_object_attribute','LAOA.id_object','LAOA.id_object_attribute','LAT.id_attribute', 'name_attribute', 'type_attribute', 'system_attribute'],
		qry = "SELECT ?? FROM light_app_object_attribute LAOA INNER JOIN light_object_attribute LOA ON LAOA.id_object_attribute=LOA.id_object_attribute INNER JOIN light_object LO on LOA.id_object=LO.id_object INNER JOIN "+
			  "light_attribute LAT ON LOA.id_attribute=LAT.id_attribute WHERE LAOA.id_org=? AND LAOA.id_app=?",
		params = [columns, req.body.orgId, req.body.appId],
		excludeAttributes = ['Trigger','PreCondition','PostCondition','Actor'];
		if(req.body.objectId){
			qry += " AND LAOA.id_object IN("+req.body.objectId+")";
			//params.push(req.body.objectId);
		}
		qry += " AND LAOA.active=1 AND LO.parent_id_object=0 ORDER BY id_attribute;";	  
		sql.query(qry, params, callback);
		function callback(err: any, rows: any, fields: any) {
			if(err) {
				console.log("objectAttributes service ", err);
				reject(err);
			} else if(rows && rows.length > 0) {
				var attributes = {}, attrIds: any = [], appObjAttrIds: any = [], keys: any = [], values: any = [], types: any = [], attrItems: any = [], sysTypes: any = [], promiseCount = 0;
				var attrItemsPromise: any = [];
				rows.forEach(function(rowData: any, index: any){
					if(attrIds.indexOf(rowData.id_attribute) === -1 && excludeAttributes.indexOf(rowData.name_attribute.replace(/\s/g,'')) === -1){
						attrIds.push(rowData.id_attribute);
						appObjAttrIds.push(rowData.id_app_object_attribute);
						keys.push(rowData.name_attribute.replace(/\s/g,''));
						values.push(rowData.name_attribute);
						types.push(rowData.type_attribute.replace(/\s/g,''));
						sysTypes.push(rowData.system_attribute);
						attrItems.push({key:rowData.name_attribute.replace(/\s/g,''),items:[]});
						attrItemsPromise.push(getAttributeValues(req.body.orgId, rowData['id_attribute']));
					}
					/*getAttributeValues(req.body.orgId, rowData['id_attribute'])
						.then(function(result){
							promiseCount++;
							attrItems.push({key:rowData.name_attribute.replace(/\s/g,''),items:result});
							if(promiseCount == rows.length)
								res.json({attrIds:attrIds, appObjAttrIds:appObjAttrIds, keys: keys, values: values, types: types, attrItems: attrItems});
						},function(error){
							res.json({attrIds:attrIds, appObjAttrIds:appObjAttrIds, keys: keys, values: values, types: types, attrItems: attrItems});
						});*/
				});
				Promise.all(attrItemsPromise)
					.then(function(allresult){
					//console.log("all result length",allresult);
					/*allresult.forEach(function(result,ndx){
						console.log("result:",ndx);
						attrItems.push({key:rowData.name_attribute.replace(/\s/g,''),items:result});
					});*/
						for(var i=0;i<allresult.length;i++){
							attrItems[i].items = allresult[i];
					}
					resolve({attrIds:attrIds, appObjAttrIds:appObjAttrIds, keys: keys, values: values, types: types, sysTypes:sysTypes, attrItems: attrItems});
				},function(err){
					resolve({attrIds:attrIds, appObjAttrIds:appObjAttrIds, keys: keys, values: values, types: types, attrItems: []});
				});
			} else {
				console.log("\nobjectAttributes service return 0 result: ",rows);
				resolve({attrIds:attrIds, appObjAttrIds:appObjAttrIds, keys: keys, values: values, types: types, attrItems: []});
			}
		}
	})
}
function getAllAttributes(req: any){
	return new Promise(function(resolve,reject){
		var columns = ['LA.id_attribute','name_attribute','desc_attribute','type_attribute','system_attribute','status',
						'id_attribute_value','value_attribute','default_attribute','order_value_attribute','active',
						'fname_employee','lname_employee','LA.modified_date'],
			qry = "SELECT ?? FROM light_attribute LA LEFT JOIN light_attribute_value LAV ON LA.id_attribute=LAV.id_attribute "+
					"LEFT JOIN light_employee LE ON LA.modified_by=LE.id_employee WHERE LA.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [],attributeVO: any = {};
			if(err){
				console.log("\nget attributes Failed: ",err);
				reject("get attributes Failed");
			} else if(rows && rows.length > 0){
				rows.forEach((rowData: any, index: any) => {
					if(attributeVO.id === rowData['id_attribute']){
						if(rowData['id_attribute_value'] !== null){
							let attributeValueVO: any = {};
							attributeValueVO.id = rowData['id_attribute_value'];
							attributeValueVO.value = rowData['value_attribute'];
							attributeValueVO.defaultType = ""+rowData['default_attribute'];
							attributeValueVO.order = rowData['order_value_attribute'];
							attributeValueVO.active = rowData['active'];
							attributeVO.values.push(attributeValueVO);
						}
					} else {
						attributeVO = {};attributeVO.values = [];
						attributeVO.id = rowData['id_attribute'];
						attributeVO.name = rowData['name_attribute'];
						attributeVO.desc = rowData['desc_attribute'];
						attributeVO.type = rowData['type_attribute'];
						attributeVO.system = rowData['system_attribute'];
						attributeVO.status = rowData['status'];
						attributeVO.modifiedBy = rowData['fname_employee'] + ' ' + rowData['lname_employee'];
						attributeVO.modifiedDate = rowData['modified_date'];
						if(rowData['id_attribute_value'] !== null){
							let attributeValueVO: any = {};
							attributeValueVO.id = rowData['id_attribute_value'];
							attributeValueVO.value = rowData['value_attribute'];
							attributeValueVO.defaultType = ""+rowData['default_attribute'];
							attributeValueVO.order = rowData['order_value_attribute'];
							attributeValueVO.active = rowData['active'];
							attributeVO.values.push(attributeValueVO);
						}
						response.push(attributeVO);
					}
				});
				resolve(response);	
			} else {
				console.log("\nNo attributes found: ",rows);
				resolve({error: "No attributes found"});
			}
		}
	});
}

// method to get all attributes used in an artifact for a given Req. Type 
function getArtifactAttributes(req: any) {
	return new Promise( (resolve,reject) => {
		var columns = ['id_attribute'],
		qry = "SELECT ?? FROM light_artifact_attribute LAA LEFT JOIN light_app_object_attribute LAOA ON LAA.id_app_object_attribute=LAOA.id_app_object_attribute "+
				"WHERE LAA.id_org=? AND LAOA.id_object=? GROUP BY LAA.id_attribute";
		sql.query(qry, [columns,req.body.orgId,req.body.id], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [];
			if(err){
				console.log("\nget artifact attributes Failed: ",err);
				reject("get artifact attributes Failed");
			} else if(rows && rows.length > 0){
				rows.forEach((rowData: any, index: any) => {
					response.push(rowData['id_attribute']);
				});
				resolve(response);
			} else {
				console.log("\nNo artifact attributes found: ",rows);
				resolve([]);
			}
		}	
	})
}

export const updateAttribute = (orgId: any,objId: any,row: any,values: any,modifiedBy: any) => {
	return new Promise( (resolve,reject) => {
		let params = [], qry = "";
		if(row.id === 0) {
			params = [orgId,row.name,row.type,row.system,row.desc,row.status,modifiedBy];
			qry = "SET @out_status_one=0; SET @out_status_two=0; CALL sp_createNewAttribute(?,?,?,?,?,?,?,now(),@out_status_one,@out_status_two);SELECT @out_status_one,@out_status_two;";
		} else {
			params = [row.id,orgId,row.name,row.type,row.desc,modifiedBy];
			qry = "SET @out_status=0;CALL sp_updateAttribute(?,?,?,?,?,?,now(),@out_status);SELECT @out_status;";
		}
		sql.multiQuery(qry, params, callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nupdate attribute Failed: ",err);
				reject(false);
			} else if(rows && rows.length > 0){
				let promiseAll: any = [], rowData: any;
				if(row.id === 0) rowData = rows[rows.length-1];
				if( row.system === -1 && objId )
					updateObjectAttributes(orgId,objId,{objAttrId:0,id:(row.id===0)?rowData[0]['@out_status_two']:row.id},modifiedBy);
				if( values && values.length > 0) {
					values.forEach( (val: any) => promiseAll.push(updateAttributeValues(orgId,(row.id===0)?rowData[0]['@out_status_two']:row.id,val,modifiedBy)));
					Promise.all(promiseAll).then( result => resolve(true) );
				} else
					resolve(true);
				console.log("\nattribute created/updated: ",rows);
			} else {
				console.log("\nattribute created/updated: ",rows);
				resolve(true);
			}
		}	
	})
}

export const updateObjectAttributes = (orgId: any,objId: any,row: any,modifiedBy: any) => {
	return new Promise( (resolve,reject) => {
		let params = [], qry = "";
		if(row.objAttrId === 0) {
			params = [orgId,row.id,objId,modifiedBy];
			qry = "CALL sp_createNewObjectAttribute(?,?,?,?,now());";
			sql.multiQuery(qry, params, callback);
		} else {
			params = [objId,row.id,row.active,modifiedBy,orgId,row.objAttrId];
			qry = "UPDATE light_object_attribute SET id_object=?, id_attribute=?, active=?, modified_by=?,modified_date=now() WHERE id_org=? AND id_object_attribute=?;";
			sql.query(qry, params, callback);
		}
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nget artifact attributes Failed: ",err);
				reject(false);
			} else if(rows && rows.length > 0){
				console.log("\nObject attribute created/updated: ",rows);
				resolve(true);
			} else {
				console.log("\nObject attribute created/updated: ",rows);
				resolve(true);
			}
		}	
	})
}