import { Request, Response } from 'express';
import {query} from '../../config/sql.config';
import { Project } from '../models/project';
import { Release } from '../models/release';

export let list = (req: Request, res: Response) => {
  
  res.json({
    message: 'Applications'
  });
};

export let create = (req: Request, res: Response) => {

  res.json({
    message: 'Create Application'
  });
};

export let edit = (req: Request, res: Response) => {

  res.json({
    message: 'Edit Application'
  });
};

export let deletee = (req: Request, res: Response) => {

  res.json({
    message: 'Delete Application'
  });
};

export let byApplication = (req: Request, res: Response) => {
  const sql = `SELECT LPR.id_release, name_release, LP.id_project, LP.name_project, LP.active_project FROM light_project_release LPR LEFT JOIN light_project LP ON LPR.id_release=LP.id_release LEFT JOIN light_role_emp LRE ON LP.id_project=LRE.id_project WHERE LPR.active_release=1 AND LP.id_app=${req.params.applicationId} AND id_employee=${req.params.userId} ORDER BY LPR.id_release,LP.id_project;`;
  query(sql, null, (err: any, rows: any[]) => {
    if (err) {
      console.log(err);
      res.status(500).json(err.sqlMessage);
    }
    let project: Project, release: Release, releases: Release[]=[];
    rows.forEach(releaseProject => {
      if (!release || release.id !== releaseProject['id_release']) {
        release = new Release();
        release.id = releaseProject['id_release'];
        release.name = releaseProject['name_release'];
        release.projects = [];
        releases.push(release);
      }
      project = new Project();
      project.id = releaseProject['id_project'];
      project.name = releaseProject['name_project'];
      project.active = releaseProject['active_project'];
      release.projects.push(project);
    });
    res.status(200).json(releases);
  });
};

const processResponse = (error: any, rows: any[]) => {
  
}

