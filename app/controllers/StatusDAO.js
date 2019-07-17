var sql = require('../config/sqlconfig');

function statusDAO(router){
	router.post('/getStatus',function(req,res){
		getStatus(req).then(result => res.json(result),error => res.json({error:error}));
	});
	router.post('/updateStatus',function(req,res){
		updateStatus(req).then(result => res.json(result),error => res.json({error:error}))
	});
}

function updateStatus(req){
	return new Promise(function(resolve,reject){
		var qry = "",columns = [req.body.orgId,req.body.type,req.body.color,req.body.desc,req.body.modifiedByID];
		if(req.body.id === 0) {
			qry = "SET @out_status=0;CALL sp_createNewStatus(?,?,?,?,?,now(),@out_status);SELECT @out_status;";
		} else {
			qry = "CALL sp_updateStatus(?,?,?,?,?,?,now());";
			columns.unshift(req.body.id);
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nStatus failed to update: ",err);
				reject({error:"Status failed to update"});
			} else if(rows && rows.length > 0){
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			} else {
				console.log("\nStatus created update empty: ",rows);
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			}
		}
	})
}

function getStatus(req){
	return new Promise(function(resolve,reject){
		var columns = ['id_status','name_status','desc_status','color','LS.modified_by','fname_employee','lname_employee'],
		qry = "SELECT ?? FROM light_status LS LEFT JOIN light_employee LE ON LS.modified_by=LE.id_employee WHERE LS.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget status Failed: ",err);
				reject({error:"get status Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var statusVO = {};
					statusVO.id = rowData['id_status'];
					statusVO.type = rowData['name_status'];
					statusVO.desc = rowData['desc_status'];
					statusVO.color = rowData['color'];
					statusVO.modifiedBy = rowData['fname_employee'] +' '+ rowData['lname_employee'];
					statusVO.modifiedByID = rowData['modified_by'];
					response.push(statusVO);
				});
				resolve(response);
			} else {
				console.log("\nNo status found: ",rows);
				resolve({error: "No status found"});
			}
		}
	})
}

module.exports = statusDAO;