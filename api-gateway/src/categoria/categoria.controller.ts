import { Body, Controller, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';

import { CriarCategoriaDto } from './dto/criar-categoria.dto';

const URL = 'amqp://localhost/smartranking'
@Controller('api/v1/categorias')
export class CategoriaController {
    private logger = new Logger(CategoriaController.name)
  	
    constructor(private clientProxySmartRanking: ClientProxySmartRanking) {
		
	}

    private clientAdminBackend = this.clientProxySmartRanking.getClientAdminBackendInstance()

    async onApplicationBootstrap() { await this.clientAdminBackend.connect();}

    @Post()
    @UsePipes(ValidationPipe)
    criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto){
        this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto)
    }

    @Get()
    consultarCategoria(@Query('idCategoria') _id: string): Observable<any>{
        return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '')
    }

    @Put(':_id')
    @UsePipes(ValidationPipe)
    atualizarCategoria(@Body() atualizarCategoriaDto: AtualizarCategoriaDto, @Param('_id') _id: string){
        this.clientAdminBackend.emit('atualizar-categoria', {id: _id, categoria: atualizarCategoriaDto})
    }


}
