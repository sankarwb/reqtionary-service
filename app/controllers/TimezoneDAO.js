var sql = require('../config/sqlconfig');

function timezoneDAO(route){
	route.post('/getTimezones',(req,res) => {
		getTimezones(req).then(result => res.json(result),error => res.json(error));
	});
}

function getTimezones(req){
	return new Promise(function(resolve,reject){
		var columns = ['id_timezone','name_timezone','offset_timezone'],
		qry = "SELECT ?? FROM light_timezone;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [];
			if(err){
				console.log("\nget Timezones Failed: ",err);
				reject({error:"get Timezones Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData, index) {
					var timezoneVO = {};
					timezoneVO.id = rowData['id_timezone'];
					timezoneVO.name = rowData['name_timezone'];
					timezoneVO.offset = rowData['offset_timezone'];
					response.push(timezoneVO);
				});
				resolve(response);
			} else {
				console.log("\nNo Timezones found: ",rows);
				resolve({error: "No Timezones found"});
			}
		}
	})
}

module.exports = timezoneDAO;