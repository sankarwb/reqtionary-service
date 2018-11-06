import {query, queryAsync} from '../../config/sql.config';
import {Artifact} from '../models/artifact';
import {Observable} from 'rxjs';
import { Employee } from '../models/employee';

export const parentArtifacts = (req: {applicationId: number}) => {
  return new Observable<Artifact[]>(observer => {
      const columns = ['id_artifact', 'name_artifact'],
            sql = `SELECT ?? FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=?);`;
      query(sql, [columns, req.applicationId]).subscribe((rows: any[]) => {
      observer.next(processResponse(columns, rows));
    }, err => observer.error(err), () => observer.complete());
  });
}

export const parentArtifactsByApplicationAsync = async(req: {applicationId: number}) => {
      const columns = ['id_artifact', 'name_artifact'],
            sql = `SELECT ?? FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=?);`;
      try {
        let rows = await queryAsync(sql, [columns, req.applicationId]);
        return rows;
      } catch(err) {
        throw err;
      }
}

export const artifacts = (req: {applicationId: number, projectId: number, requirementTypeId: number, parentArtifactId?: number, assignedTo?: number}, agile?: boolean) => {
  return new Observable<Artifact[]>(observer => {
      let columns = ['LA.id_artifact', 'name_artifact', 'uid_artifact', 'status_artifact'],
      sql = '';
      if (agile) {
        columns = [...columns, 'expected_points_artifact', 'actual_points_artifact', 'fname_employee', 'lname_employee'];
        sql = `SELECT ?? FROM light_artifact LA LEFT JOIN light_employee LE ON LA.assignedto_artifact=LE.id_employee`;
      } else {
        columns = [...columns, 'id_attribute', 'id_app_object_attribute', 'attribute_value'];
        sql = `SELECT ?? FROM light_artifact LA LEFT JOIN light_artifact_attribute LAA ON LA.id_artifact=LAA.id_artifact`;
      }
      sql += ` WHERE LA.id_app=? AND id_project=? AND id_object=?${req.parentArtifactId ? ' AND parent_id_artifact=?':''}${req.assignedTo ? ' AND assignedto_artifact=?':''}`;
      query(sql, [columns, req.applicationId, req.projectId, req.requirementTypeId, req.parentArtifactId, req.assignedTo]).subscribe((rows: any[]) => {
        let artifact: Artifact, artifacts: Artifact[]=[];
        rows.forEach(row => {
          if (!artifact || artifact.id !== row['id_artifact']) {
            artifact = new Artifact();
            artifact.user = new Employee();
            artifact.id = row['id_artifact'];
            artifact.name = row['name_artifact'];
            artifact.UID = row['uid_artifact'];
            artifact.status = row['status_artifact'];
            if (agile) {
              artifact.actualPoints = row['actual_points_artifact'];
              artifact.expectedPoints = row['expected_points_artifact'];
              artifact.user.firstName = row['fname_employee'];
              artifact.user.lastName = row['lname_employee'];
            }
            artifacts.push(artifact);
          }
          artifact[row['id_attribute']] = row['attribute_value'];
        });
      observer.next(artifacts);
    }, err => observer.error(err), () => observer.complete());
  });
}

const processResponse = (columns: string[], rows: any[]): Artifact[] => {
  let artifact: Artifact, artifacts: Artifact[]=[];
  return rows.map(row => {
    artifact = new Artifact();
    columns.forEach(column => {
      switch (column) {
        case 'id_artifact':
          artifact.id = row[column];
          break;
        case 'name_artifact':
          artifact.name = row[column];
          break;
        case 'status_artifact':
          artifact.status = row[column];
          break;
        case 'expected_points_artifact':
          artifact.expectedPoints = row[column];
          break;
        case 'fname_employee':
          if (!artifact.user) artifact.user = new Employee();
          artifact.user.firstName = row[column];
          break;
        case 'lname_employee':
          if (!artifact.user) artifact.user = new Employee();
          artifact.user.lastName = row[column];
          break;
      }
    });
    return artifact;
  });
}
