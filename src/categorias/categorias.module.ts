import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from './categoria.schema';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Categoria', schema: CategoriaSchema}])],
  controllers: [CategoriasController],
  providers: [CategoriasService]
})
export class CategoriasModule {}
