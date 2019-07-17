import multer from "multer";
import {Observable} from "rxjs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, file.originalname);
  }
}),
upload = multer({storage}).single("file");

export const fileUpload = (req: any, res: any) => {
  return new Observable((observer) => {
    upload(req, res, (err: any) => {
      if (err) {
        observer.error(err);
      } else {
        observer.next(req.file.filename);
      }
      observer.complete();
    });
  });
};
