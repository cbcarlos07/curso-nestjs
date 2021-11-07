import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasController } from './categorias.controller';
import { CategoriaSchema } from './intefaces/categoria.schema';
import { CategoriasService } from './categorias.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Categoria', schema: CategoriaSchema}
        ])
    ],
    controllers: [CategoriasController],
    providers: [CategoriasService]
})
export class CategoriasModule {}
