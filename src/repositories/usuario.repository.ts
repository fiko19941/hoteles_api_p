import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Usuario, UsuarioRelations, Hotel} from '../models';
import {HotelRepository} from './hotel.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {

  public readonly hotel: BelongsToAccessor<Hotel, typeof Usuario.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('HotelRepository') protected hotelRepositoryGetter: Getter<HotelRepository>,
  ) {
    super(Usuario, dataSource);
    this.hotel = this.createBelongsToAccessorFor('hotel', hotelRepositoryGetter,);
    this.registerInclusionResolver('hotel', this.hotel.inclusionResolver);
  }
}
