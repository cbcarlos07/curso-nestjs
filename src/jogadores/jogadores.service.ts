import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './interfaces/dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import {v4  as uuidv4}  from 'uuid';
@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name)
    private jogadores: Jogador[] = []
    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void>{

        const { email } = criarJogadorDto

        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email == email)

        if( jogadorEncontrado ){
            this.atualizar(jogadorEncontrado, criarJogadorDto)
        }
        
        this.criar( criarJogadorDto )
    }

    async consultarTodosJogadores(): Promise<Jogador[]>{
        return this.jogadores
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador>{
        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email == email)
        if( !jogadorEncontrado ){
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`)            
        }
        return jogadorEncontrado
    }

    async deletarJogador(email: string): Promise<void>{
        const jogadorEncontrado = this.jogadores.find(jogador => jogador.email == email)
        if( !jogadorEncontrado ){
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`)            
        }
        this.jogadores = this.jogadores.filter(jogador => jogador.email != email)        
    }

    private criar( criarJogadorDto: CriarJogadorDto ): void {
        const { nome, telefoneCelular, email } = criarJogadorDto
        const jogador: Jogador = {
            _id: uuidv4(),
            nome,
            telefoneCelular,
            email,
            ranking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: 'www.google.com.br/foto123.jpg'
        }
        this.jogadores.push(jogador)
        this.logger.log(`criaJogadorDto: ${JSON.stringify(criarJogadorDto)}`)
        this.logger.log((JSON.stringify(this.jogadores)))
    }

    private atualizar(jogadorEncontrado: Jogador, criarJogadorDto: CriarJogadorDto): void{
        const { nome } = criarJogadorDto
        jogadorEncontrado.nome = nome        
    }

    

}
