import * as sql from '../../config/sqlconfig-old';

export const designationDAO = function(router: any){
	router.post('/getDesignations',(req: any,res: any) => {
		getDesignations(req).then(result => res.json(result),error => res.json(error));
	});

	router.post('/updateDesignation',(req: any,res: any) => {
		updateDesignation(req).then(results => res.json(results),error => res.json({error:error}));
	});
}

function updateDesignation(req: any){
	return new Promise((resolve,reject) => {
		var qry = "",columns = [req.body.orgId,req.body.name,req.body.desc,req.body.active,req.body.modifiedByID];
		if(req.body.id === 0) {
			qry = "SET @out_status=0;CALL sp_createNewTitle(?,?,?,?,?,now(),@out_status);SELECT @out_status;";
		} else {
			qry = "SET @out_status=0;CALL sp_updateTitle(?,?,?,?,?,?,now(),@out_status);SELECT @out_status;";
			columns.unshift(req.body.id);
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nDesignation failed to update: ",err);
				reject({error:"Designation failed to update"});
			} else if(rows && rows.length > 0){
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			} else {
				console.log("\nDesignation created update empty: ",rows);
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			}
		}
	})
}

function getDesignations(req: any){
	return new Promise((resolve,reject) => {
		var columns = ['LT.id_title','name_title','desc_title','active_title','LT.modified_by','fname_employee','lname_employee'],
		qry = "SELECT ?? FROM light_title LT LEFT JOIN light_employee LE ON LT.modified_by=LE.id_employee WHERE LT.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [];
			if(err){
				console.log("\nget designation Failed: ",err);
				reject({error:"get designation Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach((rowData: any, index: any) => {
					var designationVO: any = {};
					designationVO.id = rowData['id_title'];
					designationVO.name = rowData['name_title'];
					designationVO.desc = rowData['desc_title'];
					designationVO.active = rowData['active_title'];
					designationVO.modifiedBy = rowData['fname_employee']+' '+rowData['lname_employee'];
					designationVO.modifiedByID = rowData['modified_by'];
					response.push(designationVO);
				});
				resolve(response);
			} else {
				console.log("\nNo designation found: ",rows);
				resolve({error: "No designation found"});
			}
		}
	})
}