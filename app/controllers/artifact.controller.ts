import {query} from '../../config/sql.config';
import {Artifact} from '../models/artifact';
import {Observable} from 'rxjs';

export const parentArtifactsByApplication = (req: {applicationId: number}) => {
  return new Observable<Artifact[]>(observer => {
    const sql = `SELECT id_artifact, name_artifact FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=${req.applicationId});`;
    query(sql, null).subscribe((rows: any[]) => {
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

export const artifacts = (req: {applicationId: number, projectId: number}) => {
  return new Observable<Artifact[]>(observer => {
    const sql = `SELECT id_artifact, name_artifact, status_artifact FROM light_artifact WHERE id_app=${req.applicationId} AND id_project=${req.projectId};`;
    query(sql, null).subscribe((rows: any[]) => {
        let artifact: Artifact, artifacts: Artifact[]=[];
        rows.forEach(row => {
          artifact = new Artifact();
          artifact.id = row['id_artifact'];
          artifact.name = row['name_artifact'];
          artifact.status = row['status_artifact'];
          artifacts.push(artifact);
        })
        observer.next(artifacts);
    }, err => observer.error(err), () => observer.complete());
  });
}
