const mysql = require('mysql');
const MYSQL_PASSWORD = (process.env.NODE_ENV === "development")
						? process.env.DEV_MYSQL_PASSWORD : process.env.PROD_MYSQL_PASSWORD;
const pool = mysql.createPool({
	connectionLimit: 1000,
	host: "127.0.0.1",
	user: process.env.MYSQL_USER,
	password: MYSQL_PASSWORD,
	database: process.env.MYSQL_DB,
	multipleStatements: true
});

export const multiQuery = (sqlQuery: any,params: any,callback: any) => {
	const conn = mysql.createConnection({
		host: "127.0.0.1",
		user: process.env.MYSQL_USER,
		password: MYSQL_PASSWORD,
		database: process.env.MYSQL_DB,
		multipleStatements: true
	});
	const q = conn.query(sqlQuery,params,(err: any, rows: any) => {
		if( err ) console.log(err);
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
export const query = (sqlQuery: any,params: any,callback: any) => {
	pool.getConnection((err: any,conn: any) => {
			if(!err) {
				var q = conn.query(sqlQuery,params,(err: any, rows: any) => {
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