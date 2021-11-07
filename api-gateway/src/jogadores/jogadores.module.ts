import { Module } from '@nestjs/common';
import { ProxyMQModule } from 'src/proxymq/proxymq.module';
import { JogadoresController } from './jogadores.controller';

@Module({
    imports: [ ProxyMQModule ],
    controllers: [JogadoresController]
})
export class JogadoresModule {}
