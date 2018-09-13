import { Request, Response } from 'express';
import {query} from '../../config/sql.config';
import { Artifact } from '../models/artifact';

export let list = (req: Request, res: Response) => {
  
  res.json({
    message: 'Artifacts'
  });
};

export let create = (req: Request, res: Response) => {

  res.json({
    message: 'Create Artifact'
  });
};

export let edit = (req: Request, res: Response) => {

  res.json({
    message: 'Edit Artifact'
  });
};

export let deletee = (req: Request, res: Response) => {

  res.json({
    message: 'Delete Artifact'
  });
};

export const parentArtifactsByApplication = (req: Request, res: Response) => {
  const sql = `SELECT id_artifact, name_artifact FROM light_artifact WHERE id_artifact IN (SELECT parent_id_artifact FROM light_artifact WHERE id_app=${req.params.applicationId});`;
  query(sql, null, (err: any, rows: any[]) => {
    if (err) {
      console.log(err);
      res.status(500).json(err.sqlMessage);
    }
    let artifact: Artifact, artifacts: Artifact[]=[];
    rows.forEach(row => {
      artifact = new Artifact();
      artifact.id = row['id_artifact'];
      artifact.name = row['name_artifact'];
      artifacts.push(artifact);
    })
    res.status(200).json(artifacts);
  });
}
