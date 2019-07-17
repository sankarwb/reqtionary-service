import {forkJoin, Observable} from "rxjs";
import {multiQuery, query, queryAsync} from "../../config/sql.config";
import {Artifact} from "../models/artifact";
import { ArtifactAttribute } from "../models/artifact-attribute";
import { Employee } from "../models/employee";

export const parentArtifacts = (req: {applicationId: number}) => {
  return new Observable<Artifact[]>((observer) => {
      const columns = ["id_artifact", "name_artifact"],
            sql = `SELECT ?? FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=?);`;
      query(sql, [columns, req.applicationId]).subscribe((rows: any[]) => {
      observer.next(processResponse(columns, rows));
    }, (err) => observer.error(err), () => observer.complete());
  });
};

export const parentArtifactsByApplicationAsync = async (req: {applicationId: number}) => {
      const columns = ["id_artifact", "name_artifact"],
            sql = `SELECT ?? FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=?);`;
      try {
        const rows = await queryAsync(sql, [columns, req.applicationId]);
        return rows;
      } catch (err) {
        throw err;
      }
};

export const artifacts = (req: {applicationId: number, projectId: number, requirementTypeId: number, parentArtifactId?: number, assignedTo?: number}, agile?: boolean) => {
  return new Observable<Artifact[]>((observer) => {
      let columns = ["LA.id_artifact", "name_artifact", "uid_artifact", "agile_status_value", "color"],
      sql = "";
      if (agile) {
        columns = [...columns, "expected_points_artifact", "actual_points_artifact", "fname_employee", "lname_employee"];
        sql = `SELECT ?? FROM light_artifact LA LEFT JOIN light_employee LE ON LA.assignedto_artifact=LE.id_employee`;
      } else {
        columns = [...columns, "id_attribute", "id_app_object_attribute", "attribute_value"];
        sql = `SELECT ?? FROM light_artifact LA LEFT JOIN light_artifact_attribute LAA ON LA.id_artifact=LAA.id_artifact`;
      }
      sql += ` LEFT JOIN light_object LO ON LA.id_object=LO.id_object LEFT JOIN light_app_agile_status LAAS ON LA.status_artifact=LAAS.id_app_agile_status WHERE LA.id_app=? AND id_project=? AND LA.id_object=?${req.parentArtifactId ? " AND parent_id_artifact=?" : ""}${req.assignedTo ? " AND assignedto_artifact=?" : ""}`;
      query(sql, [columns, req.applicationId, req.projectId, req.requirementTypeId, req.parentArtifactId, req.assignedTo]).subscribe((rows: any[]) => {
        let artifact: Artifact, artifacts: Artifact[] = [];
        rows.forEach((row) => {
          if (!artifact || artifact.id !== row.id_artifact) {
            artifact = new Artifact();
            artifact.user = new Employee();
            artifact.id = row.id_artifact;
            artifact.name = row.name_artifact;
            artifact.UID = row.uid_artifact;
            artifact.status = row.agile_status_value;
            artifact.color = row.color;
            if (agile) {
              artifact.actualPoints = row.actual_points_artifact;
              artifact.expectedPoints = row.expected_points_artifact;
              artifact.user.firstName = row.fname_employee;
              artifact.user.lastName = row.lname_employee;
            }
            artifacts.push(artifact);
          }
          if (row.id_attribute) {
            artifact[row.id_attribute] = row.attribute_value;
          }
        });
        observer.next(artifacts);
    }, (err) => observer.error(err), () => observer.complete());
  });
};

export const artifactById = (req: {artifactId: number}) => {
  return new Observable<Artifact>((observer) => {
    forkJoin(artifact(req.artifactId), artifactAttributes(req.artifactId)).subscribe((result) => {
      const artifact: Artifact = result[0];
      artifact.attributes = result[1];
      observer.next(artifact);
    }, (err) => observer.error(err), () => observer.complete());
  });
};

const artifact = (artifactId: number) => {
  return new Observable<Artifact>((observer) => {
    const columns = ["id_artifact", "id_org", "id_app", "id_object", "id_project", "parent_id_artifact", "uid_artifact", "name_artifact",
    "desc_artifact", "filepath_artifact", "displayseq_artifact", "comments_artifact",
    "status_artifact", "assignedto_artifact", "expected_points_artifact", "actual_points_artifact"],
        sql = "SELECT ??,DATE_FORMAT(effectivedate_artifact,'%Y-%m-%d') as effectivedate_artifact  FROM light_artifact WHERE id_artifact=?;";
    query(sql, [columns, artifactId]).subscribe((rows: any[]) => {
      const artifact = new Artifact();
      if (rows.length) {
        const row = rows[0];
        artifact.id = row.id_artifact;
        artifact.orgId = row.id_org;
        artifact.applicationId = row.id_app;
        artifact.projectId = row.id_project;
        artifact.requirementTypeId = row.id_object;
        artifact.parentId = row.parent_id_artifact;
        artifact.UID = row.uid_artifact;
        artifact.name = row.name_artifact;
        artifact.description = row.desc_artifact;
        artifact.effectiveDate = row.effectivedate_artifact;
        artifact.filePath = row.filepath_artifact;
        artifact.displaySequence = row.displayseq_artifact;
        artifact.comments = row.comments_artifact;
        artifact.status = row.status_artifact;
        artifact.assignedTo = row.assignedto_artifact;
        artifact.expectedPoints = row.expected_points_artifact;
        artifact.actualPoints = row.actual_points_artifact;
      }
      observer.next(artifact);
    }, (err) => observer.error(err), () => observer.complete());
  });
};

const artifactAttributes = (artifactId: number) => {
  return new Observable<ArtifactAttribute[]>((observer) => {
    const columns = ["id_artifact_attribute", "id_app_object_attribute", "id_attribute", "attribute_value"],
        sql = "SELECT ?? FROM light_artifact_attribute WHERE id_artifact=?;";
    query(sql, [columns, artifactId]).subscribe((rows: any[]) => {
      let attribute: ArtifactAttribute, attributes: ArtifactAttribute[] = [];
      rows.forEach((row) => {
        attribute = new ArtifactAttribute();
        attribute.artifactAttributeId = row.id_artifact_attribute;
        attribute.appObjectAttributeId = row.id_app_object_attribute;
        attribute.id = row.id_attribute;
        attribute.value = row.attribute_value;
        attributes.push(attribute);
      });
      observer.next(attributes);
    }, (err) => observer.error(err), () => observer.complete());
  });
};

export const artifactAssociations = (artifactId: number) => {
  return new Observable<Artifact[]>((observer) => {
    const columns = ["id_artifacts_association", "primary_id_artifact", "secondary_id_artifact"],
        sql = "SELECT ?? FROM light_artifacts_association WHERE primary_id_artifact=?;";
    query(sql, [columns, artifactId]).subscribe((rows: any[]) => {
      let artifact: Artifact, artifacts: Artifact[] = [];
      rows.forEach((row) => {
        artifact = new Artifact();
        artifact.id = row.id_artifact;
        artifact.name = row.attribute_value;
        artifacts.push(artifact);
      });
      observer.next(artifacts);
    }, (err) => observer.error(err), () => observer.complete());
  });
};

export const actionArtifact = (req: Artifact) => {
  return new Observable<Artifact>((observer) => {
    artifactPrerequisites(req).subscribe((prerequisite: {nextCode: string, nextSeqNum: number, nextVersion: number, associations: string}) => {
      req.version = req.id ? prerequisite.nextVersion : 1;
      let sql = "",
          values = [
            req.orgId,
            req.projectId,
            req.applicationId,
            req.requirementTypeId,
            req.parentId || 0,
            req.id ? req.UID : `${prerequisite.nextCode}${prerequisite.nextSeqNum + 1}`,
            req.version,
            req.name,
            req.name,
            req.description,
            req.description,
            req.effectiveDate,
            req.filePath,
            req.displaySequence || 1,
            req.comments,
            req.user.id,
            req.status || "New",
            req.expectedPoints || 0,
            req.actualPoints || 0,
            req.active || 1,
            req.user.id
          ];
      if (req.id) {
        values.splice(5, 1); // Remove UID
        values.splice(1, 0, req.id); // Add artifact ID
        sql = `CALL sp_updateArtifact(?,?,?,?,?,?,0,?,?,?,?,?,?,?,?,?,'',?,?,?,?,?,?,@artifactStatus); SELECT @artifactStatus;`;
      } else {
        sql = `CALL sp_createNewArtifact(?,?,?,?,?,0,?,?,?,?,?,?,?,?,?,?,'',?,?,?,?,?,?,now(),0,@artifactStatus,@artifactId); SELECT @artifactStatus,@artifactId;`;
      }
      multiQuery(sql, values).subscribe((actionArtifactResult: any[]) => {
        /*const artifactStatus = actionArtifactResult[1][0]["@artifactStatus"],
            observables: Array<Observable<any>> = [];
        if (!req.id) {
          req.id = actionArtifactResult[1][0]["@artifactId"];
        }
        // Action Artifact Attributes
        if (!!req.attributes && req.attributes.length) {
          const actionAttributes: Array<Observable<any>> = [];
          req.attributes.forEach((attribute) => {
            actionAttributes.push(actionArtifactAttribute(req, attribute));
          });
          observables.push(forkJoin(actionAttributes));
        }
        // Action artifact associations
        if (!!req.associations && req.associations.length) {
          observables.push(actionArtifactAssociations(req));
          observables.push(actionReverseArtifactAssociations(req, prerequisite.associations));
        }
        // increment object sequence number
        observables.push(query(`UPDATE light_object SET seqnum_object=? WHERE id_object=?`, [prerequisite.nextSeqNum + 1, req.requirementTypeId]));
        forkJoin(observables).subscribe((finalResult) => {
          observer.next(req);
          observer.complete();
        }, (err) => {
          console.log(err);
          observer.error(err);
        }, () => observer.complete());*/
      }, (err) => {
        console.log(err);
        observer.error(err); }, () => observer.complete());
    }, (err) => {
      console.log(err);
      observer.error(err); }, () => observer.complete());
  });
};

const actionArtifactAttribute = (artifact: Artifact, attribute: ArtifactAttribute) => {
  return new Observable((observer) => {
    let sql = "",
        values = [];
    if (attribute.artifactAttributeId) {
      sql = "CALL sp_updateArtifactAttribute(?,?,?);";
      values = [attribute.artifactAttributeId, attribute.value, artifact.version];
    } else {
      sql = "CALL sp_createArtifactAttribute(?,?,?,?,?,?,?);";
      values = [artifact.orgId, artifact.applicationId, attribute.appObjectAttributeId, artifact.id, attribute.id, attribute.value, artifact.version];
    }
    multiQuery(sql, values).subscribe(
        () => observer.next(true),
        (err) => observer.error(err),
        () => observer.complete()
      );
  });
};

const actionArtifactAssociations = (artifact: Artifact) => {
  return new Observable((observer) => {
    const sql = "CALL sp_actionArtifactAssociation(?,?,?,0,0,?,?,now());",
        values = [artifact.orgId, artifact.id, artifact.associations.map((association) => association.id).join(), 0, 0, artifact.version, artifact.modifiedBy];

    multiQuery(sql, values).subscribe(
        () => observer.next(true),
        (err) => observer.error(err),
        () => observer.complete()
      );
  });
};

const actionReverseArtifactAssociations = (artifact: Artifact, currentAssociations: string) => {
  return new Observable((observer) => {
    const observables: Array<Observable<any>> = [];
    // case update
    if (currentAssociations) {
      const updatedAssociations = artifact.associations ? [...artifact.associations] : [];
      currentAssociations.split(",").forEach((id) => {
        const idx = updatedAssociations.findIndex((association) => association.id === parseInt(id));
        if (idx === -1) {
          query(
            `SELECT ?? FROM light_artifacts_association WHERE primary_id_artifact=?`,
            [["secondary_id_artifact"], id]
          ).subscribe((rows: any[]) => {
            const secondaryArtifactIds = rows[0].secondary_id_artifact;
            const split = secondaryArtifactIds.split(",");
            split.splice(split.indexOf(artifact.id), 1);
            multiQuery("sp_updateReverseArtifactAssociation(?,?)", [id, split.join()]).subscribe();
          });
        } else {
          const association = updatedAssociations.splice(idx, 1)[0];
          observables.push(
            multiQuery(
              `sp_actionReverseArtifactAssociation(?,?,?,0,0,?,now())`,
              [artifact.orgId, association.id, artifact.id, artifact.user.id]
            )
          );
        }
      });

    } else {// case create
      artifact.associations.forEach((association) => {
        observables.push(
          multiQuery(
            `sp_actionReverseArtifactAssociation(?,?,?,0,0,?,now())`,
            [artifact.orgId, association.id, artifact.id, artifact.user.id]
          )
        );
      });
    }
    forkJoin(observables).subscribe(
      (result) => observer.next(result),
      (err) => observer.error(err),
      () => observer.complete()
    );
  });
};

/*
 create artifact
 1. create main artifact associations
 2. for each association, verify association as primary artifact entry already exists
 then update list else create new entry

 update artifact
 1. find difference of associations and note the differences of added and deleted
 2. make common artifact ids from added & deleted that can be updated at once for a given association
 3. update main artifact associations
 4. create or update association as primary artifact entry
*/

export const artifactPrerequisites = (req: Artifact) => {
  return new Observable<any>((observer) => {
    const sql = "CALL sp_getArtifactRequirements(?,?,?,?,@nextCode,@nextSeqNum,@nextVersion,@associations);SELECT @nextCode,@nextSeqNum,@nextVersion,@associations;",
        values = [req.orgId, req.appId, req.id, req.requirementTypeId];
    multiQuery(sql, values).subscribe((rows: any[]) => {
      observer.next({nextCode: rows[1][0]["@nextCode"], nextSeqNum: rows[1][0]["@nextSeqNum"], nextVersion: rows[1][0]["@nextVersion"], associations: rows[1][0]["@associations"]});
    }, (err) => observer.error(err), () => observer.complete());
  });
};

const processResponse = (columns: string[], rows: any[]): Artifact[] => {
  let artifact: Artifact, artifacts: Artifact[] = [];
  return rows.map((row) => {
    artifact = new Artifact();
    columns.forEach((column) => {
      switch (column) {
        case "id_artifact":
          artifact.id = row[column];
          break;
        case "name_artifact":
          artifact.name = row[column];
          break;
        case "status_artifact":
          artifact.status = row[column];
          break;
        case "expected_points_artifact":
          artifact.expectedPoints = row[column];
          break;
        case "fname_employee":
          if (!artifact.user) { artifact.user = new Employee(); }
          artifact.user.firstName = row[column];
          break;
        case "lname_employee":
          if (!artifact.user) { artifact.user = new Employee(); }
          artifact.user.lastName = row[column];
          break;
      }
    });
    return artifact;
  });
};
