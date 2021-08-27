import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from './interfaces/categoria.schema';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { JogadoresModule } from 'src/jogadores/jogadores.module';

@Module({
  	imports: [
		JogadoresModule,
    	MongooseModule.forFeature([{name: 'Categoria', schema: CategoriaSchema}])
  	],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService]

})
export class CategoriasModule {}
