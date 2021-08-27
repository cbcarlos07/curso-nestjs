import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafioStatusValidacaoPipe } from './desafios-status-validation.pipe';

import { DesafiosService } from './desafios.service';
import { Desafio } from './interfaces/desafio.interface';
import { AtualizarDesafioDto } from './interfaces/dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './interfaces/dtos/criar-desafio.dto';

@Controller('/api/v1/desafios')
export class DesafiosController {

    constructor(private readonly desafioService: DesafiosService ){}

    @Post()
    @UsePipes( ValidationPipe )
    async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto): Promise<Desafio>{
        return await this.desafioService.criarDesafio( criarDesafioDto )
    }

    @Get()
    async consultarDesafios(@Query('idJogador') _id: string): Promise<Array<Desafio>>{

        return _id ? await this.desafioService.consultarDesafioDeUmJogador(_id) : await this.desafioService.consultarTodosDesafios()
    }

    @Put('/:desafio')
    async atualizarDesafio(@Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto, @Param('desafio') _id: string): Promise<void>{
        return await this.desafioService.atualizarDesafio(_id, atualizarDesafioDto)
    }

}
