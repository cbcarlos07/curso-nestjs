import { Module } from '@nestjs/common';
import { ProxyMQModule } from 'src/proxymq/proxymq.module';
import { CategoriaController } from './categoria.controller';

@Module({
  imports: [ProxyMQModule],  
  controllers: [CategoriaController]
})
export class CategoriaModule {}
