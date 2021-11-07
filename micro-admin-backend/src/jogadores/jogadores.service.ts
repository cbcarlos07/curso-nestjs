import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
    logger = new Logger(JogadoresService.name);
    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>){}

    async criarJogador(jogador: Jogador): Promise<void>{
        try {
            const jogadorCriado = new this.jogadorModel(jogador);
            await jogadorCriado.save()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)})}`)
            throw new RpcException(error.message)
        }
    }

    consultarTodosJogadores(): Promise<Jogador[]>{
        try {
            return this.jogadorModel.find().populate('categoria').exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    consultarJogadorPeloId(_id: string): Promise<Jogador>{
        try {
            return this.jogadorModel.findOne({_id}).populate('categoria').exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async atulizarJogador(_id: string, jogador: Jogador): Promise<void>{
        try {
            await this.jogadorModel.findOneAndUpdate({_id}, {$set: jogador}).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async deleteJogador(_id: string):  Promise<void>{
        try {
            await this.jogadorModel.deleteOne({_id}).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
            
        }
    }


}
