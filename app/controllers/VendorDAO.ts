import * as sql from '../../config/sqlconfig-old';

export const vendorDAO = function(router: any){
	router.post('/getVendors',(req: any,res: any) => {
		getVendors(req).then(result => res.json(result),error => res.json({error}));
	});
	
	router.post('/updateVendor',(req: any,res: any) => {
		updateVendor(req).then(results => res.json(results),error => res.json({error}));
	});
}

function updateVendor(req: any){
	return new Promise((resolve,reject) => {
		var qry = "",columns = [req.body.orgId,req.body.name,req.body.desc,req.body.active,req.body.modifiedByID];
		if(req.body.id === 0) {
			qry = "SET @out_status=0;CALL sp_createNewVendor(?,?,?,?,?,now(),@out_status);SELECT @out_status;";
		} else {
			qry = "SET @out_status=0;CALL sp_updateVendor(?,?,?,?,?,?,now(),@out_status);SELECT @out_status;";
			columns.unshift(req.body.id);
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err: any, rows: any, fields: any) {
			if(err){
				console.log("\nVendor failed to update: ",err);
				reject({error:"Vendor failed to update"});
			} else if(rows && rows.length > 0){
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			} else {
				console.log("\nVendor created update empty: ",rows);
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			}
		}
	})
}

function getVendors(req: any){
	return new Promise((resolve,reject) => {
		var columns = ['LV.id_vendor','name_vendor','desc_vendor','active_vendor','LV.modified_by','fname_employee','lname_employee'],
		qry = "SELECT ?? FROM light_vendor LV LEFT JOIN light_employee LE ON LV.modified_by=LE.id_employee WHERE LV.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [];
			if(err){
				console.log("\nget vendors Failed: ",err);
				reject({error:"get vendors Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData: any, index: any) {
					var vendorVO: any = {};
					vendorVO.id = rowData['id_vendor'];
					vendorVO.name = rowData['name_vendor'];
					vendorVO.desc = rowData['desc_vendor'];
					vendorVO.active = rowData['active_vendor'];
					vendorVO.modifiedBy = rowData['fname_employee'] +' '+ rowData['lname_employee'];
					vendorVO.modifiedByID = rowData['modified_by'];
					response.push(vendorVO);
				});
				resolve(response);
			} else {
				console.log("\nNo vendors found: ",rows);
				resolve({error: "No vendors found"});
			}
		}
	})
}

module.exports = vendorDAO;