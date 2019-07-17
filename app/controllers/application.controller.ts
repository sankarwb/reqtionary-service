import {Observable, throwError} from "rxjs";
import {query} from "../../config/sql.config";
import { Application } from "../models/application";
// import 'rxjs/add/observable/throw';

export let byEmployee = (req: {employeeId: number}) => {
  return new Observable((observer) => {
    const columns = ["id_app", "name_app"],
    sql = `SELECT ?? FROM light_app WHERE id_app IN (SELECT id_app FROM light_role_emp WHERE id_employee=? AND active=1 AND id_app!=0) AND active_app!=0 ORDER BY modified_date DESC;`;
    query(sql, [columns, req.employeeId]).subscribe((rows: any[]) => {
        let application: Application, applications: Application[] = [];
        rows.forEach((app) => {
          application = new Application();
          application.id = app.id_app;
          application.name = app.name_app;
          applications.push(application);
        });
        observer.next(applications);
    }, (err) => observer.error(err), () => observer.complete());
  });
};
