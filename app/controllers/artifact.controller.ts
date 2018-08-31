import { Request, Response } from 'express';

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


