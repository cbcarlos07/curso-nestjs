import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
import { Categoria } from './intefaces/categoria.interface';
const ackErrors: string[] = ['E11000'];
@Controller('api/v1/categorias')
export class CategoriasController {
    logger = new Logger(CategoriasController.name);

    constructor(private categoriaService: CategoriasService){}

    @EventPattern('criar-categoria')
    async criarCategoria(@Payload() categoria: Categoria, @Ctx() context: RmqContext){
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        this.logger.log(`categoria: ${JSON.stringify(categoria)}`)
        try {
            await this.categoriaService.criarCategoria( categoria )
            await channel.ack(originalMsg)
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)

            const filterAckError = ackErrors.filter( ackError =>  error.message.includes( ackError ))
            if( filterAckError ){
                await channel.ack(originalMsg)
            }
        }
    }

    @MessagePattern('consultar-categorias')
    async consultarCategorias(@Payload() _id: string, @Ctx() context: RmqContext){
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            if(_id){
                return this.categoriaService.consultarCategoriaPeloId(_id)
            }else{
                return this.categoriaService.consultarTodasCategorias()
            }
        } finally {
            await channel.ack(originalMsg)
        }
    }

    @EventPattern('atualizar-categoria')
    async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext){
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            const id = data.id
            const categoria = data.categoria
            await this.categoriaService.atualizarCategoria(id, categoria)
        } catch (error) {
            const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))
            if( filterAckError ){
                await channel.ack(originalMsg)
            }
        }
    }

    
}
