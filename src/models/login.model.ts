import {Entity, model, property} from '@loopback/repository';

@model()
export class Login extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  contrasenia: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<Login>) {
    super(data);
  }
}

export interface LoginRelations {
  // describe navigational properties here
}

export type LoginWithRelations = Login & LoginRelations;
