import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaSchema } from './interfaces/categorias/categoria.schema';
import { JogadorSchema } from './interfaces/jogadores/jogador.schema';

@Module({
	imports: [
		//MongooseModule.forRoot('mongodb+srv://admin:h4wpeUICtNePLvL5@cluster0.rhkz8.mongodb.net/smartranking?retryWrites=true&w=majority',
		MongooseModule.forRoot('"mongodb://localhost/smartranking',
		{useNewUrlParser: true,  useUnifiedTopology: true}),
		MongooseModule.forFeature([
			{name: 'Categoria', schema: CategoriaSchema},
			{name: 'Jogador', schema: JogadorSchema},
		])
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
