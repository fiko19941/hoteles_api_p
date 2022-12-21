import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Hotel,
  Usuario,
} from '../models';
import {HotelRepository} from '../repositories';

export class HotelUsuarioController {
  constructor(
    @repository(HotelRepository)
    public hotelRepository: HotelRepository,
  ) { }

  @get('/hotels/{id}/usuario', {
    responses: {
      '200': {
        description: 'Usuario belonging to Hotel',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Usuario)},
          },
        },
      },
    },
  })
  async getUsuario(
    @param.path.string('id') id: typeof Hotel.prototype.id,
  ): Promise<Usuario> {
    return this.hotelRepository.usuario(id);
  }
}
