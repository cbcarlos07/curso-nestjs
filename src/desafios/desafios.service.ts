import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio } from './interfaces/desafio.interface';
import { AtualizarDesafioDto } from './interfaces/dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './interfaces/dtos/criar-desafio.dto';

@Injectable()
export class DesafiosService {
    
    
    
    private readonly logger = new Logger(DesafiosService.name)
    constructor(@InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
                readonly jogadorService: JogadoresService,
                readonly categoriaService: CategoriasService){}
    
    async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        const { solicitante, jogadores } = criarDesafioDto
        /*
        Verificar se os jogadores informados estão cadastrados
         */
        
        const jogadoresLista = await this.jogadorService.consultarTodosJogadores()
        
        
        jogadores.forEach(jogadorDto => {
            
            const jogadorFilter = jogadoresLista.filter(jogador => jogador._id == jogadorDto._id)
            
            if( jogadorFilter.length == 0 ){
                console.log();
                
                throw new BadRequestException(`O id ${jogadorDto._id} não é um jogador`)
            }
        })
        /*
        Verificar se o solicitante é um dos jogadores da partida
         */
        
        const solicitanteEhJogadorDaPartida = await jogadores.filter(jogador => jogador._id == solicitante)
        if( solicitanteEhJogadorDaPartida.length == 0){
            throw new BadRequestException(`O solicitante deve ser um jogador da partida! `)
        }

        /*
        Descobrimos a categoria com base no ID do Jogador solicitante
         */
        const categoriaDoJogador = await this.categoriaService.consultarCategoriaDoJogador( solicitante )

        /*
        Para prosseguir o solicitante deve fazer parte de uma categoria
        */
        if( !categoriaDoJogador ){
            throw new BadRequestException(`O solicitante precisa estar registrado em uma categoria`)
        }

        const desafioCriado = new this.desafioModel( criarDesafioDto )
        desafioCriado.categoria = categoriaDoJogador.categoria
        desafioCriado.dataHoraSolicitacao = new Date()
        /*
        Quando um desafio for criado, definimos o status desafio como pentente
         */
        desafioCriado.status = DesafioStatus.PENDENTE
        return desafioCriado.save()





    }

    consultarTodosDesafios(): Desafio[] | Promise<Array<Desafio>> {
        return this.desafioModel.find()
                         .populate('solicitante')
                         .populate('jogadores')
                         .populate('partida')
                         .exec()
    }

    async consultarDesafioDeUmJogador(_id: any): Promise<Array<Desafio>> {
        const jogadores = await this.jogadorService.consultarTodosJogadores()
        const jogadorFilter = jogadores.filter(jogador => jogador._id == _id)
        if( jogadorFilter.length == 0 ){
            throw new BadRequestException(`O id ${_id} não é um jogador`)
        }

        return await this.desafioModel.find()
                                      .where('jogadores')
                                      .in(_id)
                                      .populate('solicitante')
                                      .populate('jogadores')
                                      .populate('partidade')
                                      .exec()
                         
    }

    async atualizarDesafio(_id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
        const desafioEncontrado =  await this.desafioModel.findById( _id ).exec()
        if( !desafioEncontrado ){
            throw new NotFoundException(`Desafio ${_id} não cadastrado`)            
        }

        /*
        Atualizamos a data da responsta quando o status do desafio vier preenchido
        */

        if( atualizarDesafioDto.status ){
            desafioEncontrado.dataHoraResposta = new Date()
        }
        desafioEncontrado.status = atualizarDesafioDto.status
        desafioEncontrado.dataHoraDeafio = atualizarDesafioDto.dataHoraDesafio

        await this.desafioModel.findOneAndUpdate({_id}, {$set: desafioEncontrado}).exec()
    }
}
