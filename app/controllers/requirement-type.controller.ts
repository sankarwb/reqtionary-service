import { Request, Response } from 'express';
import {query} from '../../config/sql.config';
import { RequirementType } from '../models/requirement-type';

export let byApplication = (req: Request, res: Response) => {
  const sql = `SELECT LO.id_object, name_object, color, code_object FROM light_object LO LEFT JOIN light_app_object_attribute LAOA ON LO.id_object=LAOA.id_object WHERE LAOA.id_app=${req.params.applicationId} and LAOA.active=1 group by LO.id_object order by LO.id_object;`;
  query(sql, null, (err: any, rows: any[]) => {
    if (err) {
      console.log(err);
      res.status(500).json(err.sqlMessage);
    }
    let reqtype: RequirementType, reqtypes: RequirementType[]=[];
    rows.forEach(reqtypeObj => {
      reqtype = new RequirementType();
      reqtype.id = reqtypeObj['id_object'];
      reqtype.name = reqtypeObj['name_object'];
      reqtype.color = reqtypeObj['color'];
      reqtype.code = reqtypeObj['code_object'];
      reqtypes.push(reqtype);
    })
    res.status(200).json(reqtypes);
  });
};

const processResponse = (error: any, rows: any[]) => {
  
}

