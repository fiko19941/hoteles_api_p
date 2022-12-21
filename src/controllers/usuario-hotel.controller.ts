import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Usuario,
  Hotel,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioHotelController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/hotel', {
    responses: {
      '200': {
        description: 'Hotel belonging to Usuario',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Hotel)},
          },
        },
      },
    },
  })
  async getHotel(
    @param.path.string('id') id: typeof Usuario.prototype.id,
  ): Promise<Hotel> {
    return this.usuarioRepository.hotel(id);
  }
}
