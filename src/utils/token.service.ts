import jwt from 'jsonwebtoken'
import {env} from '../config/env.js'
function generateToken (payload:object):string{
return jwt.sign(payload,env.JWT_SECRET,{expiresIn:'7d'})
}
export default generateToken;