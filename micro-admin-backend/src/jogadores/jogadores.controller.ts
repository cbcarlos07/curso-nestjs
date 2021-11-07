import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern,  MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
const ackErrors: string[] = ['E11000'];
@Controller('api/v1/jogadores')
export class JogadoresController {
    logger = new Logger(JogadoresController.name);
    constructor(private readonly jogadorService: JogadoresService) {}
    @EventPattern('criar-jogador')
    async criarJogador(@Payload() jogador: Jogador, @Ctx() context: RmqContext){
        const channel = context.getChannelRef() 
        const originalMsg = context.getMessage()
        try {
            this.logger.log(`jogador: ${JSON.stringify(jogador)}`)
            await this.jogadorService.criarJogador(jogador)
            await channel.ack( originalMsg )
        } catch (error) {
            this.logger.log(`Error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))
            if( filterAckError ){
                await channel.ack( originalMsg )
            }
        }  
    }

    @EventPattern('atualizar-jogador')
    async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            const _id: string = data.id
            const jogador: Jogador = data.jogador
            await this.jogadorService.atulizarJogador(_id, jogador)
            await channel.ack( originalMsg )
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))
            if( filterAckError ){
                await channel.ack( originalMsg )
            }
        }
    }

    @MessagePattern('consultar-jogadores')
    async consultarJogador(@Payload() _id: string, @Ctx() context: RmqContext){
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            if( _id ){
                return this.jogadorService.consultarJogadorPeloId(_id)
            }else{
                return this.jogadorService.consultarTodosJogadores()
            }
        } finally {
            await channel.ack( originalMsg )
        }
    }


    @EventPattern('deletar-jogador')
    async deletarJogador(@Payload() _id: string, @Ctx() context: RmqContext){
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            await this.jogadorService.deleteJogador(_id)
            await channel.ack( originalMsg )
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))
            if(filterAckError){
                await channel.ack( originalMsg )
            }
        }
    }




}
