var sql = require('../config/sqlconfig'),
	RoleDAO = require('./RoleDAO');

var divisionDAO = function (router) {
	router.post('/getDivisions',function(req,res){
		req.body.role = "Division";
		getDivisions(req)
			.then(function(results){
				console.log(results);
				res.json(results);
			},function(error){
				res.json({error:error});
			})
	});

	router.post('/updateDivision',function(req,res){
		updateDivision(req)
			.then(function(results){
				res.json(results);
			},function(error){
				res.json({error:error});
			})
	});
}

function updateDivision(req){
	return new Promise((resolve,reject) => {
		let qry = "",columns = [req.body.orgId,req.body.name,req.body.desc,req.body.active,req.body.modifiedByID];
		if( req.body.id === 0)
			qry = "SET @out_status_one=0;SET @out_status_two=0; CALL sp_createNewDivision(?,?,?,?,?,now(),@out_status_one,@out_status_two);"+
					"SELECT @out_status_one,@out_status_two";
		else {
			qry = "SET @status=0;CALL sp_updateDivision(?,?,?,?,?,?,now(),@status);SELECT @status;";
			columns.unshift(req.body.id);
		}
		sql.multiQuery(qry, columns, callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nDivision failed to update: ",err);
				reject({error:"Division failed to update"});
			} else if(rows && rows.length > 0){
				let row;
				if(req.body.id === 0)row = rows[rows.length-1];
				RoleDAO.updateBulkRoleEmp( req, (req.body.id === 0)?row[0]['@out_status_two']:req.body.id, 'divId' )
						.then( resp => resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`}) );
			} else {
				console.log("\nDivision failed to update: ",rows);
				resolve({success:`${req.body.name} ${req.body.id === 0? 'created':'updated'} successfully`});
			}
		}
	})
}

function getDivisions(req){
	return new Promise(function(resolve,reject){
		var columns = ['LD.id_org','LD.id_div','id_role_emp','name_div','desc_div','active_div','LD.modified_by','LR.id_role','name_role','LRE.active','LE.id_employee','LE.fname_employee','LE.lname_employee'],
		qry = "SELECT ??,CONCAT(LE1.fname_employee,' ',LE1.lname_employee) as modified FROM light_division LD LEFT JOIN "+
				"light_role_emp LRE ON LD.id_div=LRE.id_div LEFT JOIN light_role LR ON LRE.id_role=LR.id_role "+
				"LEFT JOIN light_employee LE ON LRE.id_employee=LE.id_employee LEFT JOIN light_employee LE1 ON "+
				"LD.modified_by=LE1.id_employee WHERE LD.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [],divisionVO = {};
			if(err){
				console.log("\nget divisions Failed: ",err);
				reject("get divisions Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					if(divisionVO.id === rowData['id_div']){
						if(rowData['name_role'] !== null) divisionVO.roles.push( RoleDAO.getRoleEmpObj(rowData,'divId',rowData['id_div']) );
					} else {
						divisionVO = {};divisionVO.roles = [];
						divisionVO.id = rowData['id_div'];
						divisionVO.name = rowData['name_div'];
						divisionVO.desc = rowData['desc_div'];
						divisionVO.modifiedBy = rowData['modified'];
						divisionVO.modifiedByID = rowData['modified_by'];
						divisionVO.active = rowData['active_div'];
						if(rowData['name_role'] !== null) divisionVO.roles.push( RoleDAO.getRoleEmpObj(rowData,'divId',rowData['id_div']) );
						response.push(divisionVO);
					}
				});
				resolve(response);
			} else {
				console.log("\nNo divisions found: ",rows);
				resolve({error: "No divisions found"});
			}
		}
	});
}
module.exports = divisionDAO;