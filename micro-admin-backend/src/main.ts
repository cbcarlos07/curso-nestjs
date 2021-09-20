import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('Main')
async function bootstrap() {
	const app = await NestFactory.createMicroservice(AppModule,
		{
			transport: Transport.RMQ,
			options: {
			 	//urls: ['amqps://ipdv:ipdvonline2021@b-c33ff9e9-6093-4032-a97c-286274b56c3a.mq.us-east-1.amazonaws.com:5671/smartranking'],
			 	urls: ['amqp://localhost'],
				queue: 'admin-backend' 
		}
	});
	
	await app.listen();
	logger.log('Microservice is listening')
}
bootstrap();
