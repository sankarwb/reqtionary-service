var sql = require('../config/sqlconfig');

function employeeDAO(router) {
	router.post('/getEmployees',(req,res) => {
		getEmployees(req).then(result => res.json(result),error => res.json(error));
	});

	router.post('/updateEmployee',(req,res) => {
		updateEmployee(req).then(results => res.json(results),error => res.json(error));
	});

	router.post('/verifyLogin',(req,res) => {
		verifyUserLogin(req).then(result => res.json(result),err => res.status(500).send({error:err}));
	});
}

function updateEmployee(req){
	return new Promise((resolve,reject) => {
		let qry = "",
			params = [req.body.orgId,req.body.vendorId,req.body.titleId,req.body.type,req.body.UID,req.body.fName,req.body.mName,
						req.body.lName,req.body.emailID,req.body.photopath,req.body.timezone,req.body.userID,req.body.password,
						req.body.active,req.body.modifiedByID,req.body.changePassword];
		if( req.body.id === 0 )
			qry = "SET @status=0;CALL sp_createNewEmployee(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),@status);SELECT @status;";
		else {
			qry = "SET @status=0;CALL sp_updateEmployee(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),?,@status);SELECT @status;";
			params.unshift(req.body.id);
		}

		sql.multiQuery(qry, params, callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nEmployee failed to update: ",err);
				reject({error:"Employee failed to update"});
			} else if(rows && rows.length > 0){
				resolve({success:`${req.body.fName} ${req.body.mName} ${req.body.id === 0? 'created':'updated'} successfully`});
			} else {
				console.log("\nEmployee update empty: ",rows);
				resolve({success:`${req.body.fName} ${req.body.mName} ${req.body.id === 0? 'created':'updated'} successfully`});
			}
		}
	})
}

function getEmployees(req){
	return new Promise((resolve,reject) => {
		var columns = ['LE.id_employee','LE.uid_employee','LE.user_type','LE.fname_employee','LE.mname_employee','LE.lname_employee',
						'LE.emailid_employee','LE.photopath_employee','LE.timezone_employee','LE.userid_employee','LE.modified_by',
						'LE.active_employee','LV.id_vendor','name_vendor','LT.id_title','name_title'],
		qry = "SELECT ?? FROM light_employee LE LEFT JOIN light_vendor LV ON LE.id_vendor=LV.id_vendor LEFT JOIN light_title LT ON "+
				"LT.id_title=LE.id_title WHERE LE.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget employees Failed: ",err);
				reject("get employees Failed");
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var employeeVO = {};
					employeeVO.id = rowData['id_employee'];
					employeeVO.UID = rowData['uid_employee'];
					employeeVO.type = rowData['user_type'];
					employeeVO.fName = rowData['fname_employee'];
					employeeVO.mName = rowData['mname_employee'];
					employeeVO.lName = rowData['lname_employee'];
					employeeVO.emailID = rowData['emailid_employee'];
					employeeVO.photopath = rowData['photopath_employee'];
					employeeVO.timezone = rowData['timezone_employee'];
					employeeVO.active = rowData['active_employee'];
					employeeVO.userID = rowData['userid_employee'];
					employeeVO.password = "";
					employeeVO.changePassword = "";
					employeeVO.vendorId = rowData['id_vendor'];
					employeeVO.titleId = rowData['id_title'];
					employeeVO.vendorName = rowData['name_vendor'];
					employeeVO.designationName = rowData['name_title'];
					employeeVO.modifiedBy = "";
					employeeVO.modifiedByID = rowData['modified_by'];
					response.push(employeeVO);
				});
				// get modified emp from the same list and add it to each item
				response.forEach(item=>{
					let emp = [...response].filter(item1 => item.modifiedByID===item1.id);
					item.modifiedBy = ( emp && emp.length > 0 ) ? emp[0].fName + ' ' + emp[0].lName : "";
				})
				resolve(response);
			} else {
				console.log("\nNo employees found: ",rows);
				resolve({error: "No employees found"});
			}
		}
	})
}

function verifyUserLogin(req){
	return new Promise((resolve,reject) => {
		var columns = ['id_org','id_employee','uid_employee','user_type','fname_employee','mname_employee','lname_employee',
						'emailid_employee','photopath_employee','timezone_employee','active_employee'],
		qry = "SELECT ?? FROM light_employee WHERE active_employee=1 AND emailid_employee=? AND pwd_employee=password(?);";
		sql.query(qry, [columns,req.body.emailID,req.body.password], callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nuser login failed: ",err);
				reject({error:"user login failed"});
			} else if(rows && rows.length > 0){
				var employeeVO = {},rowData = rows[0];
				employeeVO.orgId = rowData['id_org'];
				employeeVO.id = rowData['id_employee'];
				employeeVO.UID = rowData['uid_employee'];
				employeeVO.type = rowData['user_type'];
				employeeVO.fName = rowData['fname_employee'];
				employeeVO.mName = rowData['mname_employee'];
				employeeVO.lName = rowData['lname_employee'];
				employeeVO.emailID = rowData['emailid_employee'];
				employeeVO.photopath = rowData['photopath_employee'];
				employeeVO.timezone = rowData['timezone_employee'];
				employeeVO.active = rowData['active_employee'];
				employeeVO.password = "";
				resolve(employeeVO);
			} else {
				console.log("\nNo records found. Please try with different credentials: ",rows);
				reject({error: "No records matching your login. Please try again"});
			}
		}
	})
}

module.exports = employeeDAO;