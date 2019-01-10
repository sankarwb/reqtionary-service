import {createPool, createConnection} from 'mysql';
import {Observable} from 'rxjs';

const MYSQL_PASSWORD = (process.env.NODE_ENV==='development') 
						? process.env.DEV_MYSQL_PASSWORD : process.env.PROD_MYSQL_PASSWORD

const pool = createPool({
    connectionLimit: 1000,
	host: '127.0.0.1',
	user: process.env.MYSQL_USER,
	password: MYSQL_PASSWORD,
	database: process.env.MYSQL_DB,
	multipleStatements: true
});

export const multiQuery = (sqlQuery: string, params: any, callback: any) => {
	const conn = createConnection({
		host: '127.0.0.1',
		user: process.env.MYSQL_USER,
		password: MYSQL_PASSWORD,
		database: process.env.MYSQL_DB,
		multipleStatements: true
	});
	return new Observable(observer => {
		const q = conn.query(sqlQuery, params, (err: any, rows: any[]) => {
			if(err) {
				observer.error(err);
			} else {
				observer.next(rows);
			}
			observer.complete();
			//conn.release();
		});
		console.log(q.sql);
		console.log("---------------------------------------------------------------------------------------------------------------------");
	});
};

/*
@description	Method to execute query and callback
@params 		{string} sqlQuery		An sql string
@params 		{array} params			query parameters ([[columns], params]) eg., [['name','age'],1]
*/
export const query = (sqlQuery: string, params: any) => {
	return new Observable(observer => {
		pool.getConnection((err: any, conn: any) => {
			if(err) {
				observer.error(err);
				observer.complete();
			} else {
				const q = conn.query(sqlQuery, params, (err: any, rows: any[]) => {
					if (err) {
						observer.error(err);
					} else {
						observer.next(rows);
					}
					conn.release();
					observer.complete();
				});
				console.log("---------------------------------------------------------------------------------------------------------------------");
				console.log(q.sql);
			}
		});
	})
};

export const queryAsync = async (sqlQuery: string, params: any) => {
	pool.getConnection((err: any, conn: any) => {
		if(err) {
			throw err;
		} else {
			const q = conn.query(sqlQuery, params, (err: any, rows: any[]) => {
				if (err) {
					console.log(err);
					throw err;
				} else {
					console.log(rows);
					return rows;
				}
				conn.release();
			});
			console.log("---------------------------------------------------------------------------------------------------------------------");
			console.log(q.sql);
		}
	});
};