import * as jwt from 'jsonwebtoken';
import { secret } from '../../config/secret';
import * as expressJWT from 'express-jwt';

export const sign = () => {
    const token = jwt.sign({name: 'sankara asapu', exp: 60}, secret);
    return token;
};

export const valid = expressJWT({
    secret: secret
});