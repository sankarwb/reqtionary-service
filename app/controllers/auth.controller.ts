import {Observable} from "rxjs";
import {sign} from "../utils/tokenization";

export let Authenticate = (req: {email: string, password: string}) => {
  return new Observable((observer) => {
    const token = sign(),
          sql = `SELECT * FROM light_employee WHERE email_employee=? AND password=password(?)`;
    observer.next({
      orgId: 4,
      id: 31,
      uid: "A010101",
      type: 1,
      firstName: "Sankara",
      middleName: "Swaroop",
      lastName: "Asapu",
      email: "sankarasapu@gmail.com",
      token,
      expires: 60
    });
    observer.complete();
  });
};
