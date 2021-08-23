import { Body, Controller, Delete, Get, Param, Post,  Put,  Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtualizarJogadorDto } from './interfaces/dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './interfaces/dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresvalidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';
@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor( private readonly jogadoresService: JogadoresService ){}
    
    @Post()
    @UsePipes(ValidationPipe)
    criarJogador(@Body() criarJogadorDto: CriarJogadorDto ): Promise<Jogador>{
        return this.jogadoresService.criarJogador( criarJogadorDto )
    }

    @Put(':_id')
    @UsePipes(ValidationPipe)
    atualizarJogador(@Body() atualizarJogadorDto: AtualizarJogadorDto, @Param('_id', JogadoresvalidacaoParametrosPipe) _id: string ): Promise<void>{ 
        return this.jogadoresService.atualizarJogador(_id,  atualizarJogadorDto )
    }

    @Get()
    consultarJogadores(): Promise<Jogador[]>{
        
        return this.jogadoresService.consultarTodosJogadores();
        
    }
    
    @Get('/:_id')
    consultarJogadorPeloId(@Param('_id', JogadoresvalidacaoParametrosPipe) _id: string): Promise<Jogador>{
        if(_id){
            return this.jogadoresService.consultarJogadoresPeloId(_id)
        }
    }
    @Delete('/:_id')
    deletarJogador(@Param('_id', JogadoresvalidacaoParametrosPipe) _id: string){        
        this.jogadoresService.deletarJogador( _id )
    }

    

}
