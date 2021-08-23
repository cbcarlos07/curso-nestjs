# Curso de Node.js Microservices: NestJS, RabbitMQ and Cloud Services

https://www.udemy.com/share/1031xw/
## Comandos Nest

* Criar Módulo

  nest g module jogadores

* Controlers

Handlers
  
  @Get @Post, @Put, @Delete

  nest g controller jogadores

* Services

  nest g service jogadores

# Mongo

    npm i @nestjs/mongoose mongoose

    npm i @types-mongoose -D

Senha do mongo: h4wpeUICtNePLvL5

  mongodb+srv://admin:<password>@cluster0.rhkz8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

Não esquecer de mudar a palavra myFirstDatabase pelo seu banco de dados

MongooseModule.forRoot(url,
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }),

useNewUrlParser: garantir compatibilidade com a versão antiga do banco

useCreateIndex: Evitar mensagem de deprecated

useUnifiedTopology: é uma boa manter como true

useFindAndModify: Desabilitar o método para fazer uso de outros

# Pipe | Validação de campos

  npm i class-validator class-transformer -S

  https://github.com/typestack/class-validator






