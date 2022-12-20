import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Keys as llaves} from '../config/keys';
import {Login} from '../models';
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class JwtService {
  constructor(/* Add @inject to inject parameters */) { }


  crearTokenJWT(usuario: Login) {
    let claveSecreta = llaves.jwtKey;
    let tk = jwt.sign({
      exp: llaves.expTimeJWT,
      data: {
        id: usuario.id,
        correo: usuario.correo,
        contrasenia: usuario.contrasenia
      }
    }, claveSecreta);
    return tk;
  }

  verificarTokenJWT(token: string) {
    console.log(token)

    try {
      let decoded = jwt.verify(token, llaves.jwtKey);
      decoded.ok = true;
      return decoded
    } catch (err) {
      console.log(err)
      err.ok = false
      return err
    }

  }


}
