import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './interfaces/dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './interfaces/dtos/atualizar-jogador.dto';
@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>){}

    async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador>{

        const { email } = criarJogadorDto

        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec()        
        
        if( jogadorEncontrado ){
            throw new BadRequestException(`Jogador com com e-mail ${email} já cadastrado`)            
        }
        const jogadorCriado = new this.jogadorModel(criarJogadorDto)
        return jogadorCriado.save()
        
    }
    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void>{
        const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec()                
        if( !jogadorEncontrado ){
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`)            
        }
        this.jogadorModel.findOneAndUpdate({_id },{$set: atualizarJogadorDto}).exec()
    }

    async consultarTodosJogadores(): Promise<Jogador[]>{        
        return this.jogadorModel.find().exec()
    }

    async consultarJogadoresPeloId(_id: string): Promise<Jogador>{
        const jogadorEncontrado = await this.verificaSeJogadorExiste(_id)
        
        if( !jogadorEncontrado ){
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`)            
        }
        return jogadorEncontrado
    }

    async deletarJogador(_id: string): Promise<any>{        
        
        if( !await this.verificaSeJogadorExiste(_id) ){
            throw new NotFoundException(`Jogador com e-mail ${_id} não encontrado`)            
        }
        return this.jogadorModel.deleteOne({_id}).exec()
    }

    private async verificaSeJogadorExiste(_id){
        const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec()
        return jogadorEncontrado 
    }
}
