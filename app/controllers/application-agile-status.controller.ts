import {Observable} from 'rxjs';
import {query} from '../../config/sql.config';
import {ApplicationAgileStatus} from '../models/application-agile-status';

export const byApplication = (req: {applicationId: number}) => {
  return new Observable<ApplicationAgileStatus[]>(observer => {
    const columns = ['id_app_agile_status', 'agile_status_value'],
          sql = `SELECT ?? FROM light_app_agile_status WHERE id_app=? AND active=1 ORDER BY order_status_value;`;
    query(sql, [columns, req.applicationId]).subscribe((rows: any[]) => {
      let status: ApplicationAgileStatus, statuses: ApplicationAgileStatus[] = [];
      rows.forEach(row => {
        status = new ApplicationAgileStatus();
        status.id = row['id_app_agile_status'];
        status.statusText = row['agile_status_value'];
        statuses.push(status);
      });
      observer.next(statuses);
    }, err => observer.error(err), () => observer.complete());
  });
}
