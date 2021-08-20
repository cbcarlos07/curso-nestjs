import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './interfaces/dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import {v4  as uuidv4}  from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name)
    private jogadores: Jogador[] = []

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>){}

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void>{

        const { email } = criarJogadorDto
        
        
        //const jogadorEncontrado = this.jogadores.find(jogador => jogador.email == email)
        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec()
        
        
        if( jogadorEncontrado ){
            
            
            this.atualizar(criarJogadorDto)
        }else{
            this.criar( criarJogadorDto )
        }
        
    }

    async consultarTodosJogadores(): Promise<Jogador[]>{
        //return this.jogadores
        return this.jogadorModel.find().exec()
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador>{
        const jogadorEncontrado = this.jogadorModel.findOne({email}).exec()
        if( !jogadorEncontrado ){
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`)            
        }
        return jogadorEncontrado
    }

    async deletarJogador(email: string): Promise<any>{        
        /*const jogadorEncontrado = this.jogadores.find(jogador => jogador.email == email)
        if( !jogadorEncontrado ){
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`)            
        }
        this.jogadores = this.jogadores.filter(jogador => jogador.email != email)        */
        return this.jogadorModel.remove({email}).exec()
    }

    private criar( criarJogadorDto: CriarJogadorDto ): Promise<Jogador> {
        const jogadorCriado = new this.jogadorModel(criarJogadorDto)
        return jogadorCriado.save()
        /*const { nome, telefoneCelular, email } = criarJogadorDto
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
        this.logger.log((JSON.stringify(this.jogadores)))*/

    }

    private atualizar( criarJogadorDto: CriarJogadorDto): Promise<Jogador>{
        /*const { nome } = criarJogadorDto
        jogadorEncontrado.nome = nome*/
        return this.jogadorModel
                   .findOneAndUpdate({email: criarJogadorDto.email},{$set: criarJogadorDto})
                   .exec()
    }

    

}
