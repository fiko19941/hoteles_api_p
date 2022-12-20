import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Credenciales, Login} from '../models';
import {LoginRepository} from '../repositories';
import {JwtService} from '../services';

export class LoginController {
  constructor(
    @repository(LoginRepository)
    public loginRepository: LoginRepository,
    @service(JwtService)
    public jwtService: JwtService
  ) { }

  @post('/logins')
  @response(200, {
    description: 'Login model instance',
    content: {'application/json': {schema: getModelSchemaRef(Login)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Login, {
            title: 'NewLogin',
            exclude: ['id'],
          }),
        },
      },
    })
    login: Omit<Login, 'id'>,
  ): Promise<Login> {
    return this.loginRepository.create(login);
  }

  @get('/logins/count')
  @response(200, {
    description: 'Login model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Login) where?: Where<Login>,
  ): Promise<Count> {
    return this.loginRepository.count(where);
  }

  @get('/logins')
  @response(200, {
    description: 'Array of Login model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Login, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Login) filter?: Filter<Login>,
  ): Promise<Login[]> {
    return this.loginRepository.find(filter);
  }

  @patch('/logins')
  @response(200, {
    description: 'Login PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Login, {partial: true}),
        },
      },
    })
    login: Login,
    @param.where(Login) where?: Where<Login>,
  ): Promise<Count> {
    return this.loginRepository.updateAll(login, where);
  }

  @get('/logins/{id}')
  @response(200, {
    description: 'Login model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Login, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Login, {exclude: 'where'}) filter?: FilterExcludingWhere<Login>
  ): Promise<Login> {
    return this.loginRepository.findById(id, filter);
  }

  @patch('/logins/{id}')
  @response(204, {
    description: 'Login PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Login, {partial: true}),
        },
      },
    })
    login: Login,
  ): Promise<void> {
    await this.loginRepository.updateById(id, login);
  }

  @put('/logins/{id}')
  @response(204, {
    description: 'Login PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() login: Login,
  ): Promise<void> {
    await this.loginRepository.replaceById(id, login);
  }

  @del('/logins/{id}')
  @response(204, {
    description: 'Login DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.loginRepository.deleteById(id);
  }

  @post('/identificar', {
    responses: {
      '200': {
        description: 'Identificacion de usuario',
        content: {'application/json': {schema: getModelSchemaRef(Login)}},
      }
    }
  })
  async indetificar(

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credenciales),
        },
      },
    }) credenciales: Credenciales
  ): Promise<object> {
    let usuario = await this.loginRepository.findOne({where: {correo: credenciales.correo, contrasenia: credenciales.contrasenia}});

    if (usuario) {
      //Generar token
      let token = this.jwtService.crearTokenJWT(usuario);
      usuario.contrasenia = '';
      return {
        user: usuario,
        token: token
      };
    } else {
      //Error
      throw new HttpErrors[401]('Usuario o clave incorrecto')
    }
  }

  @post('/verificarToken/{token}', {
    responses: {
      '200': {
        description: 'Verification user',
        content: {'application/json': {schema: getModelSchemaRef(Login)}}
      }
    }
  })
  async verificarToken(
    @param.path.string('token') token: string,
    @requestBody() data: any
  ): Promise<object> {
    console.log(token)
    const datos = this.jwtService.verificarTokenJWT(token)
    return {
      datos
    }


  }

}
