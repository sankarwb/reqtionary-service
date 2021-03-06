import {Observable} from "rxjs";
import {query} from "../../config/sql.config";
import {Project} from "../models/project";
import {Release} from "../models/release";

export let projectsGroupbyRelease = (req: {applicationId: number}) => {
  return new Observable<Release[]>((observer) => {
    const columns = ["LPR.id_release", "name_release", "active_release", "active_project", "type_release", "type_project", "LP.id_project", "LP.name_project", "LP.active_project"],
          sql = `SELECT ??, IFNULL(SUM(expected_points_artifact),0) expected, IFNULL(SUM(actual_points_artifact),0) actual FROM light_project_release LPR LEFT JOIN light_project LP ON LPR.id_release=LP.id_release LEFT JOIN light_artifact LA ON LA.id_project=LP.id_project WHERE LPR.active_release=1 AND LP.id_app=? GROUP BY id_project ORDER BY LPR.id_release,LP.id_project;`;
    query(sql, [columns, req.applicationId]).subscribe((rows: any[]) => {
        let project: Project, release: Release, releases: Release[] = [];
        rows.forEach((row) => {
          if (!release || release.id !== row.id_release) {
            release = new Release();
            release.id = row.id_release;
            release.name = row.name_release;
            release.type = row.type_release;
            release.active = row.active_release;
            release.projects = [];
            releases.push(release);
          }
          project = new Project();
          project.id = row.id_project;
          project.name = row.name_project;
          project.active = row.active_project;
          project.type = row.type_project;
          project.active = row.active_project;
          project.expected = row.expected;
          project.actual = row.actual;
          release.projects.push(project);
        });
        observer.next(releases);
    }, (err) => observer.error(err), () => observer.complete());
  });
};
