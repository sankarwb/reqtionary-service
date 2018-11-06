import {Observable} from 'rxjs';
import {query} from '../../config/sql.config';
import { Employee } from '../models/employee';

export let byId = (req: {}) => {
  return new Observable(observer => {
    observer.next({
      id: 33,
      uid: 'A010101',
      type: 1,
      firstName: 'Sankara',
      middleName: 'Swaroop',
      lastName: 'Asapu',
      email: 'sankarasapu@gmail.com',
    });
    observer.complete();
  });
};

export let byApplication = (req: {applicationId: number}) => {
  return new Observable<Employee[]>(observer => {
    const columns = ['fname_employee', 'lname_employee', 'LE.id_employee'],
          sql = `SELECT ?? FROM light_employee LE LEFT JOIN light_role_emp LRE ON LE.id_employee=LRE.id_employee WHERE id_app=? GROUP BY id_employee;`;
    query(sql, [columns, req.applicationId]).subscribe((rows: any[]) => {
      let employee: Employee, employees: Employee[]=[];
      rows.forEach(reqtypeObj => {
        employee = new Employee();
        employee.id = reqtypeObj['id_employee'];
        employee.firstName = reqtypeObj['fname_employee'];
        employee.lastName = reqtypeObj['lname_employee'];
        employees.push(employee);
      })
      observer.next(employees);
    }, err => observer.error(err), () => observer.complete());
  });
}

