import * as sql from '../../config/sqlconfig-old';

export const timezoneDAO =  function(route: any){
	route.post('/getTimezones',(req: any,res: any) => {
		getTimezones(req).then(result => res.json(result),error => res.json(error));
	});
}

function getTimezones(req: any){
	return new Promise(function(resolve,reject){
		var columns = ['id_timezone','name_timezone','offset_timezone'],
		qry = "SELECT ?? FROM light_timezone;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err: any, rows: any, fields: any) {
			var response: any = [];
			if(err){
				console.log("\nget Timezones Failed: ",err);
				reject({error:"get Timezones Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach(function(rowData: any, index: any) {
					var timezoneVO: any = {};
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