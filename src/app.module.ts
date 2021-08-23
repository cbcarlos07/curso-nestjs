import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:h4wpeUICtNePLvL5@cluster0.rhkz8.mongodb.net/smartranking?retryWrites=true&w=majority',
      {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}),
    JogadoresModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}