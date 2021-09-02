import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio, Partida } from './interfaces/desafio.interface';
import { AtualizarDesafioDto } from './interfaces/dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './interfaces/dtos/criar-desafio.dto';

@Injectable()
export class DesafiosService {
    
    
    
    
    private readonly logger = new Logger(DesafiosService.name)
    constructor(@InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
                @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
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
        const desafioEncontrado = await this.verificarSeDesafioExiste(_id)

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

    async atribuidDesafioPartida(_id: string, atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto): Promise<void> {
        const desafioEncontrado = await this.verificarSeDesafioExiste(_id)

        /*
        Verifica se o jogador vencedor faz parte do deasfio
        */
       const jogadorFilter = desafioEncontrado.jogadores.filter( jogador => jogador._id ==  atribuirDesafioPartidaDto.def)

       if( jogadorFilter.length == 0 ){
           throw new BadRequestException(`O jogador vencedor não faz parte do desafio`)
       }

       /*
       Primeiro vamos criar e persistir o objeto partida
        */
       const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto)

       /*
       Atribuir ao objeto partida a categoria recuperada no desafio
       */
      partidaCriada.jogadores = desafioEncontrado.jogadores

      const resultado = await partidaCriada.save()

      /*
       Quando uma partida for registrada por um usuário, mudaremos o status do desafio para REALIZADO 
      */

       desafioEncontrado.status = DesafioStatus.REALIZADO

       /*
       Recuperamos o ID da partida e atribuimos ao desafio
       */
       desafioEncontrado.partida = resultado._id

       try {
           await this.desafioModel.findOneAndUpdate({_id}, {$set: desafioEncontrado}).exec()
       } catch (error) {
           /*
           Se a atualização do desafio falhar excluimos a  partida gravada anteiormente
           */
            await this.partidaModel.deleteOne({_id: resultado._id}).exec()
            throw new InternalServerErrorException()
           
       }
        
    }

    async deletarDesafio(_id: string): Promise<void>{
        const desafioEncontrado = await this.verificarSeDesafioExiste( _id )
        /*
        Realizaremos a deleção lógica do desafio, modificando seu status para CANCELADO
        */
       desafioEncontrado.status = DesafioStatus.CANCELADO

       await this.desafioModel.findOneAndUpdate({_id}, {$set: desafioEncontrado}).exec()
    }

     private async verificarSeDesafioExiste(_id: string) : Promise<Desafio>{
        const desafioEncontrado =  await this.desafioModel.findById( _id ).exec()
        if( !desafioEncontrado ){
            throw new NotFoundException(`Desafio ${_id} não cadastrado`)            
        }
        return desafioEncontrado
    }
}
