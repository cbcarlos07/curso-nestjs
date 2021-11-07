import { Module } from '@nestjs/common';

import { CategoriaModule } from './categoria/categoria.module';
import { ProxyMQModule } from './proxymq/proxymq.module';
import { JogadoresModule } from './jogadores/jogadores.module';


@Module({
  imports: [CategoriaModule, ProxyMQModule, JogadoresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
