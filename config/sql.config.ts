import * as mysql from 'mysql';

const pool = mysql.createPool({
    connectionLimit: 1000,
	host: '127.0.0.1',
	user: 'lightInsurance',
	password: 'reqhydind123',
	database: 'light_insurance',
	multipleStatements: true
});

export const multiQuery = (sqlQuery, params, callback) => {
	var conn = mysql.createConnection({
		host: '127.0.0.1',
		user: 'lightInsurance',
		password: 'reqhydind123',
		database: 'light_insurance',
		multipleStatements: true
	});
	var q = conn.query(sqlQuery, params, (err, rows) => {
		if( err ) {
            console.log(err);
        }
		callback(err,rows);
		//conn.release();
	});
	console.log(q.sql);
	console.log("---------------------------------------------------------------------------------------------------------------------");
};

/*
@description	Method to execute query and callback
@params 		{string} sqlQuery		An sql string
@params 		{array} params			query parameters ([[columns], params]) eg., [['name','age'],1]
@params 		{function} callback		query result callback function
*/
export const query = (sqlQuery, params, callback) => {
	pool.getConnection((err,conn) => {
			if(!err) {
				var q = conn.query(sqlQuery, params, (err, rows) => {
					callback(err,rows);
					conn.release();
				});
				console.log(q.sql);
				console.log("---------------------------------------------------------------------------------------------------------------------");
			} else {
				console.log(err);
			}
		});
};