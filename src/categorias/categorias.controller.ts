import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Categoria } from './categoria.interface';
import { CategoriasService } from './categorias.service';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {

    constructor(private readonly categoriaService: CategoriasService){}

    @Post()
    @UsePipes(ValidationPipe)
    async criarCategoria(
        @Body() criarCategoriaDto: CriarCategoriaDto
    ): Promise<Categoria>{

        return await this.categoriaService.criarCategoria(criarCategoriaDto);

    }

    @Get()
    async consultarCategorias(): Promise<Array<Categoria>>{
        return await this.categoriaService.consultarCategorias()
    }

    @Get('/:categoria')
    async consultarCategoriaPeloId(@Param('categoria') categoria: string): Promise<Categoria>{
        return await this.categoriaService.consultarCategoriaPeloId( categoria )
    }

}
