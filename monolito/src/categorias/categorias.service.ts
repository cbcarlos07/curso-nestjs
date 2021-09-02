import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categoria.interface';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

@Injectable()
export class CategoriasService {
    
    
    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        readonly jogadoresService: JogadoresService

        ){}

    async criarCategoria(
        criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
        const { categoria } = criarCategoriaDto
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec()
        if( categoriaEncontrada ){
            throw new BadRequestException(`Categoria ${categoria} já cadastrada` )            
        }

        const categoriaCriada = new this.categoriaModel(criarCategoriaDto)
        return await categoriaCriada.save()
    }

    

    async consultarTodasCategorias(): Promise<Array<Categoria>>{
        return await this.categoriaModel.find().populate('jogadores').exec()
    }

    async consultarCategoriaPeloId(categoria: string): Promise<Categoria> {
        const categoriaEncontrada = await this.buscarCategoria(categoria);
        return categoriaEncontrada
    }

    async consultarCategoriaDoJogador(solicitante: any): Promise<Categoria> {
        /*
      Desafio
      Escopo da exceção realocado para o próprio Categorias Service
      Verificar se o jogador informado já se encontra cadastrado
      */

        const jogadores = await this.jogadoresService.consultarTodosJogadores()

        const jogadorFilter = jogadores.filter(jogador => jogador._id == solicitante)

        if( jogadorFilter.length == 0 ){
            throw new BadRequestException(`O id ${solicitante} não é um jogador`)
        }

        return await this.categoriaModel.findOne().where('jogadores').in(solicitante).exec()


  }

    async atualizarCategoria(categoria: string, atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
        await this.buscarCategoria(categoria);
        await this.categoriaModel.findOneAndUpdate( {categoria}, {$set: atualizarCategoriaDto} )
    }

    async atribuirCategoriaJogador(params: string[]): Promise<void> {
        
        const categoria = params['categoria']
        const idJogador = params['idJogador']
        
        const categoriaEncontrada = await this.buscarCategoria(categoria);
        const jogadorJaCadastradoCategoria = await this.categoriaModel.find({categoria}).where('jogadores').in(idJogador).exec()

        if( jogadorJaCadastradoCategoria.length > 0 ){
            throw new BadRequestException(`Jogador ${idJogador} já cadstrado na categoria ${categoria}`)
        }
        await this.jogadoresService.consultarJogadoresPeloId( idJogador )
        
        categoriaEncontrada.jogadores.push(idJogador)

        await this.categoriaModel.findOneAndUpdate( {categoria},{$set: categoriaEncontrada} ).exec()

    }

    async encontrarCategoriaDoSolicitante(solicitante: Jogador): Promise<Categoria> {
        
        return this.categoriaModel.findOne(
            {
                jogadores: {
                    $elemMatch: {
                        _id: solicitante 
                    }
                }
            })        
    }

    private async buscarCategoria(categoria): Promise<Categoria>{
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec()
        if( !categoriaEncontrada ){
            throw new NotFoundException(`Categoria ${categoria} não encontrada`)
        }
        return categoriaEncontrada
    }

    

    
}
