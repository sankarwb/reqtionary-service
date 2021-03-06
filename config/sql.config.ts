import {createConnection, createPool} from "mysql";
import {Observable} from "rxjs";
import { RowData } from "../app/models/row-data";

const pool = createPool({
    connectionLimit: 1000,
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB,
	multipleStatements: true
});

export const multiQuery = (sqlQuery: string, params: any) => {
	const conn = createConnection({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DB,
		multipleStatements: true
	});
	return new Observable((observer) => {
		const q = conn.query(sqlQuery, params, (err: any, rows: any[]) => {
			if (err) {
				observer.error(err);
			} else {
				observer.next(rows);
			}
			observer.complete();
			// conn.release();
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
export const query = (sqlQuery: string, params: Array<Array<string>|number|string>): Observable<RowData[]> => {
	return new Observable<RowData[]>(observer => {
		pool.getConnection((err: any, conn: any) => {
			if (err) {
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
	});
};
