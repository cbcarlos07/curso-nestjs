import { Body, Controller, Get, Logger, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Observable } from 'rxjs';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';

@Controller('api/v1')
export class AppController {
	private logger = new Logger(AppController.name)
  	
	private clientAdminBackend: ClientProxy

	constructor() {
		this.clientAdminBackend = ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				//urls: ['amqps://ipdv:ipdvonline2021@b-c33ff9e9-6093-4032-a97c-286274b56c3a.mq.us-east-1.amazonaws.com:5671/smartranking'],
				urls: ['amqp://localhost'],
				queue: 'admin-backend'
			}
		})
	}

	@Post('categorias')
	@UsePipes(ValidationPipe)
	criarCategoria( @Body() criarCategoriaDto: CriarCategoriaDto ){
		this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto)
	}

	@Get('categorias')
	consultarCategoria(@Query('idCategoria') _id: string): Observable<any>{
		return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '')
	}

	
}
