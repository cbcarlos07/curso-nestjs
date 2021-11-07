import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { ValidacaoParametrosPipe } from './jogadores.pipe'

@Controller('api/v1/jogadores')
export class JogadoresController {
    private logger = new Logger(JogadoresController.name)

    constructor(private clienteProxySmartRanking: ClientProxySmartRanking){}

    private clientAdminBackend = this.clienteProxySmartRanking.getClientAdminBackendInstance()

    async onApplicationBootstrap() { await this.clientAdminBackend.connect();}

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(@Body() criarJogadorDto: CriarJogadorDto){
        this.logger.log(`criarJogadorDto: ${JSON.stringify(criarJogadorDto)}`)
        const categoria = await firstValueFrom( this.clientAdminBackend.send( 'consultar-categorias', criarJogadorDto.categoria ) )
        
        if( categoria ){
            await this.clientAdminBackend.emit('criar-jogador', criarJogadorDto)
        }else{
            throw new BadRequestException(`Categoria não cadastrada`)
        }
    }

    @Get()
    consultarJogadores(@Query('idJogador') _id: string ): Observable<any>{
        return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '')
    }

    @Put(':_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(@Body() atualizarJogadorDto: AtualizarJogadorDto, @Param('_id', ValidacaoParametrosPipe) _id: string){
        const categoria = await firstValueFrom(this.clientAdminBackend.send('consultar-categorias', atualizarJogadorDto.categoria) )
        if(categoria){
            await this.clientAdminBackend.emit( 'atualizar-jogador', {id: _id, jogador: atualizarJogadorDto} )
        }else{
            throw new BadRequestException(`Categoria não cadastrada`)
            
        }
    }

    @Delete(':_id')
    async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string){
        await this.clientAdminBackend.emit('deletar-jogador', {_id})
    }
    
}


