import {Observable} from 'rxjs';
import * as multer from 'multer';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    let timestamp = Date.now();
    cb(null, file.originalname);
  }
}),
upload = multer({storage}).single('file');

export const fileUpload = (req: any, res: any) => {
  return new Observable(observer => {
    upload(req, res, (err) => {
      if (err) {
        observer.error(err);
      } else {
        observer.next(req.file.filename);
      }
      observer.complete();
    });
  });
}