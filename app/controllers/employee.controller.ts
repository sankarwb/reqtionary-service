import { Request, Response } from 'express';
import {query} from '../../config/sql.config';
import { Employee } from '../models/employee';

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

export let byId = (req: Request, res: Response) => {
  res.status(200).json({
    id: 31,
    uid: 'A010101',
    type: 1,
    firstName: 'Sankara',
    middleName: 'Swaroop',
    lastName: 'Asapu',
    email: 'sankarasapu@gmail.com',
  });
};

export let byApplication = (req: Request, res: Response) => {
  const sql = `SELECT fname_employee, lname_employee, LE.id_employee FROM light_employee LE LEFT JOIN light_role_emp LRE ON LE.id_employee=LRE.id_employee WHERE id_project IN (SELECT id_project FROM light_project WHERE id_app=${req.params.applicationId}) GROUP BY id_employee;`;
  query(sql, null, (err: any, rows: any[]) => {
    if (err) {
      console.log(err);
      res.status(500).json(err.sqlMessage);
    }
    let employee: Employee, employees: Employee[]=[];
    rows.forEach(reqtypeObj => {
      employee = new Employee();
      employee.id = reqtypeObj['id_employee'];
      employee.firstName = reqtypeObj['fname_employee'];
      employee.lastName = reqtypeObj['lname_employee'];
      employees.push(employee);
    })
    res.status(200).json(employees);
  });
}

