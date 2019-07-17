var sql = require('../config/sqlconfig');

function phaseDAO(router){
	router.post('/getPhases',function(req,res){
		getPhases(req)
			.then(function(result){
				res.json(result);
			},function(error){
				res.json(error);
			})
	});

	router.post('/updatePhase',function(req,res){
		updatePhase(req)
			.then(function(results){
				res.json(results);
			},function(error){
				res.json({error:error});
			})
	});
}

function updatePhase(req){
	return new Promise(function(resolve,reject){
		var qry = "",columns = [req.body.orgId,req.body.name,req.body.desc,req.body.active,req.body.modifiedByID];
		if(req.body.id === 0) {
			qry = "SET @out_status=0;CALL sp_createPhase(?,?,?,?,?,now(),@out_status);SELECT @out_status;";
		} else {
			qry = "SET @out_status=0;CALL sp_updatePhase(?,?,?,?,?,?,now(),@out_status);SELECT @out_status;";
			columns.unshift(req.body.id);
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nPhase failed to update: ",err);
				reject({error:"Phase failed to update"});
			} else if(rows && rows.length > 0){
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			} else {
				console.log("\nPhase created update empty: ",rows);
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			}
		}
	})
}

function getPhases(req){
	return new Promise(function(resolve,reject){
		var columns = ['id_phase','name_phase','description_phase','active_phase','LPP.modified_by','fname_employee','lname_employee'],
		qry = "SELECT ?? FROM light_project_phase LPP LEFT JOIN light_employee LE ON LPP.modified_by=LE.id_employee WHERE LPP.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget phases Failed: ",err);
				reject({error:"get phases Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var phaseVO = {};
					phaseVO.id = rowData['id_phase'];
					phaseVO.name = rowData['name_phase'];
					phaseVO.desc = rowData['description_phase'];
					phaseVO.active = rowData['active_phase'];
					phaseVO.modifiedBy = rowData['fname_employee'] +' '+ rowData['lname_employee'];
					phaseVO.modifiedByID = rowData['modified_by'];
					response.push(phaseVO);
				});
				resolve(response);
			} else {
				console.log("\nNo phases found: ",rows);
				resolve({error: "No phases found"});
			}
		}
	})
}

module.exports = phaseDAO;