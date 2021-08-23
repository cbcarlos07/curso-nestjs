import { Body, Controller, Delete, Get, Post,  Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './interfaces/dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresvalidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';
@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor( private readonly jogadoresService: JogadoresService ){}
    
    @Post()
    @UsePipes(ValidationPipe)
    async criarAtualizarJogador(@Body() criarJogadorDto: CriarJogadorDto ){
        await this.jogadoresService.criarAtualizarJogador( criarJogadorDto )
    }

    @Get()
    consultarJogadores(@Query('email', JogadoresvalidacaoParametrosPipe) email: string): Promise<Jogador[] | Jogador>{
        if(email){
            return this.jogadoresService.consultarJogadoresPeloEmail(email)
        }else{
            return this.jogadoresService.consultarTodosJogadores();
        }
    }
    @Delete()
    async deletarJogador(@Query('email', JogadoresvalidacaoParametrosPipe) email: string): Promise<void>{        
        await this.jogadoresService.deletarJogador( email )
    }

    

}
