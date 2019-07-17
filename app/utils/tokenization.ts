import expressJWT from "express-jwt";
import * as jwt from "jsonwebtoken";
import { secret } from "../../config/secret";

export const sign = () => {
    const token = jwt.sign({name: "sankara asapu", exp: 60}, secret);
    return token;
};

export const valid = expressJWT({
    secret
});
