import {createPool, createConnection} from 'mysql';

const pool = createPool({
    connectionLimit: 1000,
	host: '127.0.0.1',
	user: 'root',
	password: 'reqhydind123',
	database: 'light_insurance',
	multipleStatements: true
});

export const multiQuery = (sqlQuery: string, params: any, callback: any) => {
	var conn = createConnection({
		host: '127.0.0.1',
		user: 'root',
		password: 'reqhydind123',
		database: 'light_insurance',
		multipleStatements: true
	});
	var q = conn.query(sqlQuery, params, (err: any, rows: any[]) => {
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
export const query = (sqlQuery: string, params: any, callback: any) => {
	pool.getConnection((err: any, conn: any) => {
			if(!err) {
				var q = conn.query(sqlQuery, params, (err: any, rows: any[]) => {
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