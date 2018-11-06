import {query} from '../../config/sql.config';
import {Artifact} from '../models/artifact';
import {Observable} from 'rxjs';

export const byApplication = (req: {applicationId: number}) => {
  return new Observable<Artifact[]>(observer => {
    const columns = ['id_artifact', 'name_artifact'],
          sql = `SELECT ?? FROM light_artifact_history WHERE id_app=? ORDER BY modified_date DESC LIMIT 10;`;
    query(sql, [columns, req.applicationId]).subscribe((rows: any[]) => {
        let artifact: Artifact, artifacts: Artifact[]=[];
        rows.forEach(row => {
          artifact = new Artifact();
          artifact.id = row['id_artifact'];
          artifact.name = row['name_artifact'];
          artifacts.push(artifact);
        })
        observer.next(artifacts);
    }, err => observer.error(err), () => observer.complete());
  });
}
