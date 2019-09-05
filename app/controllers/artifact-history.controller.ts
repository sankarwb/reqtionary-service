import {Observable, forkJoin} from "rxjs";
import {query} from "../../config/sql.config";
import {Artifact} from "../models/artifact";

const keys = ['name','desc','projectName','parent','effectivedate','filepath','displayseq','comments','assignedTo','status','active'];
const keyValueMap = [
  {
    key: 'version', value: 'Version'
  },{
    key: 'name', value: 'Name'
  },{
      key: 'desc', value: 'Description', type: 'html'
  },{
      key: 'projectName', value: 'Iteration/Sprint'
  },{
      key: 'parent', value: 'Parent Artifact'
  },{
      key: 'effectivedate', value: 'Effective Date', type: 'date'
  },{
      key: 'filepath', value: 'Files'
  },{
      key: 'displayseq', value: 'Display Sequence'
  },{
      key: 'comments', value: 'Comments'
  },{
      key: 'assignedTo', value: 'Assigned To'
  },{
      key: 'expected', value: 'Expected Points'
  },{
      key: 'actuals', value: 'Actual Points'
  },{
      key: 'status', value: 'Status'
  },{
      key: 'active', value: 'Active'
  }
];

export const byApplication = (req: {applicationId: number}) => {
  return new Observable<Artifact[]>((observer) => {
    const columns = ["id_artifact", "name_artifact"],
          sql = `SELECT ?? FROM light_artifact_history WHERE id_app=? ORDER BY modified_date DESC LIMIT 10;`;
    query(sql, [columns, req.applicationId]).subscribe((rows: any[]) => {
        let artifact: Artifact, artifacts: Artifact[] = [];
        rows.forEach((row) => {
          artifact = new Artifact();
          artifact.id = row.id_artifact;
          artifact.name = row.name_artifact;
          artifacts.push(artifact);
        });
        observer.next(artifacts);
    }, (err) => observer.error(err), () => observer.complete());
  });
};

export const historyById = (req: {artifactId: number}) => {
  return new Observable<any>(observer => {
    forkJoin<Artifact[],any[]>(artifactHistory(req.artifactId), artifactAttributeHistory(req.artifactId))
    .subscribe(result => {
      let artifacts = result[0];
      artifacts.forEach(artifactVersion => {
        result[1].forEach(attributeVersion => {
          if (artifactVersion.version === attributeVersion.version) {
            attributeVersion.keys.forEach( (key: any) => {
              if (keys.indexOf(key.key) === -1) {
                keys.push(key.key);
                keyValueMap.push({key:key.key,value:key.name})
              }	
              artifactVersion[key.key] = attributeVersion.history[key.key];
            })
          }
        })
      });
      observer.next({titles: keyValueMap, history: artifacts});
    }, (err) => observer.error(err), () => observer.complete());
  });
}

const artifactHistory = (artifactId: number) => {
  return new Observable<Artifact[]>(observer => {
    const columns = ['LAH.id_artifact','name_project','LA.name_artifact','LAH.version_artifact',
						'LAH.desc_artifact','LAH.effectivedate_artifact','LAH.filepath_artifact','LAH.displayseq_artifact',
						'LAH.comments_artifact','LAH.assignedto_artifact','LAH.expected_points_artifact','LAH.actual_points_artifact',
						'LAH.status_artifact','LAH.active_artifact','LAH.modified_by','LAH.modified_date'], 
		      qry = "SELECT ??,LAH.name_artifact as artifactName FROM light_artifact_history LAH LEFT JOIN light_artifact LA ON LAH.parent_id_artifact=LA.id_artifact LEFT JOIN light_project LP ON LAH.id_project=LP.id_project WHERE LAH.id_artifact=?;";
    query(qry, [columns, artifactId]).subscribe((rows: any[]) => {
      let history: Artifact[] = [], artifact: Artifact;
      
      rows.forEach((rowData: {[key: string]: any}, index: number) => {
        artifact = new Artifact();
        artifact.version = rowData['version_artifact'];
        artifact.modifiedDate = rowData['modified_date'];
        artifact.projectName = rowData['name_project'];
        artifact.parent = rowData['LA.name_artifact'];
        artifact.name = rowData['artifactName'];
        artifact.desc = rowData['desc_artifact'];
        artifact.effectivedate = rowData['effectivedate_artifact'];
        artifact.filepath = rowData['filepath_artifact'];
        artifact.displayseq = rowData['displayseq_artifact'];
        artifact.comments = rowData['comments_artifact'];
        artifact.assignedTo = rowData['assignedto_artifact'];
        artifact.expected = rowData['expected_points_artifact'];
        artifact.actuals = rowData['actual_points_artifact'];
        artifact.status = rowData['status_artifact'];
        artifact.active = rowData['active_artifact'];
        artifact.modifiedBy = rowData['modified_by'];
        artifact.visible = (index === 0);
        artifact.selected = false;
        history.push(artifact);
      });
      observer.next(history);
    }, (err) => observer.error(err), () => observer.complete());
  });
}

const artifactAttributeHistory = (artifactId: number) => {
	return new Observable<any>(observer => {
		var columns = ['LAAH.id_attribute','name_attribute','attribute_value','version_artifact'], 
		qry = "SELECT ?? FROM light_artifact_attribute_history LAAH LEFT JOIN light_attribute LA ON LAAH.id_attribute=LA.id_attribute WHERE id_artifact=?;";
		query(qry, [columns, artifactId]).subscribe((rows: any[]) =>{
      if (rows && rows.length > 0) {
        let versions: any = [],version: any = {},attributes: any = {},keys: any = [];
				rows.forEach((rowData: any, index: number) => {
          if (version.version !== rowData['version_artifact']) {						
            version = {},attributes = {},keys = [];
            keys.push({key:rowData['name_attribute'].replace(/\s/g,''),name:rowData['name_attribute']});
            attributes[rowData['name_attribute'].replace(/\s/g,'')] = rowData['attribute_value'];
            version.version = rowData['version_artifact'];
            version.keys = keys;
            version.history = attributes;
            versions.push(version);
          } else {
            keys.push({key:rowData['name_attribute'].replace(/\s/g,''),name:rowData['name_attribute']});
            attributes[rowData['name_attribute'].replace(/\s/g,'')] = rowData['attribute_value'];
          }
        });
        observer.next(versions);
      }
	  }, err => observer.error(err), () => observer.complete());
  });
}
