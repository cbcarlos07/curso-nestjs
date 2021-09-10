import { Body, Controller, Get, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('api/v1')
export class AppController {
	private logger = new Logger(AppController.name)
  	
	private clientAdminBackend: ClientProxy

	constructor() {
		this.clientAdminBackend = ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: ['amqps://ipdv:ipdvonline2021@b-c33ff9e9-6093-4032-a97c-286274b56c3a.mq.us-east-1.amazonaws.com:5671/smartranking'],
				queue: 'admin-backend'
			}
		})
	}

	@Post('categoria')
	@UsePipes(ValidationPipe)
	async criarCategoria( @Body() criarCategoriaDto: CriarCategoriaDto ){
		return await this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto)
	}

	
}
