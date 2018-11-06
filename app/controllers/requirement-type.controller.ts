import {Observable} from 'rxjs';
import {query} from '../../config/sql.config';
import {RequirementType} from '../models/requirement-type';

export let byApplication = (req: {applicationId: number}) => {
  return new Observable(observer => {
    const columns = ['LO.id_object', 'name_object', 'color', 'code_object'],
          sql = `SELECT ?? FROM light_object LO LEFT JOIN light_app_object_attribute LAOA ON LO.id_object=LAOA.id_object WHERE LAOA.id_app=? and LAOA.active=1 group by LO.id_object order by LO.id_object;`;
    query(sql, [columns, req.applicationId]).subscribe((rows: any[]) => {
      let reqtype: RequirementType, reqtypes: RequirementType[]=[];
      rows.forEach(reqtypeObj => {
        reqtype = new RequirementType();
        reqtype.id = reqtypeObj['id_object'];
        reqtype.name = reqtypeObj['name_object'];
        reqtype.color = reqtypeObj['color'];
        reqtype.code = reqtypeObj['code_object'];
        reqtypes.push(reqtype);
      })
      observer.next(reqtypes);
    }, err => observer.error(err), () => observer.complete());
  });
};
