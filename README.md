
# Rota de Viagem
Essa aplicação foi construida usando Node.js e [Express 4](http://expressjs.com/).

## Pré-requisitos
-  Certifique-se de ter o [Node.js](http://nodejs.org/) instalado.

## Estrutura das pastas

    ├── travel-route-challenge
    |   ├── node_modules (não será importado, rodar npm install)
    |   ├── controllers 
    |       ├── travelController.js (responsável pelas regras de negócio)
    |   ├── helpers
    |       ├── error.js (responsável pelo tratamento de erros)
    |   ├── routes
    |       ├── travelRoutes.js (definição das rotas e métodos)
    |   ├── tests
    |       ├── server.test.js (testes automatizados de integração)
    |   ├── package-lock.json
    |   ├── package.json (arquivos com as configurações e dependências do projeto)
    |   ├── input-routes-test.csv (CSV utilizado nos testes automatizados)
    |   ├── input-routes.csv (CSV utilizado na aplicação)
    |   ├── index.js (responsável por inciar o servidor)
    |   ├── travel-cli.js (responsável pela interface por linha de comando)
    |   ├── Dockerfile (arquivo docker, para rodar a aplicação em containers)
    |   ├── access.log (guarda os logs das requisições)
    |   ├── .gitignore
    |   ├── README.md

## Executando a aplicação

## Interface REST (API)
Para executar a aplicação primeiro instale a dependências, para isso rode o seguinte comando:

```sh
npm install
``` 

Para iniciar o servidor utilize:

```sh
npm start --inputFile=input-routes.csv
```

   > Obs.: Na inicialização do servidor é necessário enviar o parâmetro "inputFile", conforme o exemplo anterior.
   
Sua aplicação agora deve estar executando na porta 8080

### Métodos API
 Os *endpoints* dos serviços estarão disponíveis em http://localhost:8080/api/

> Sugestão: Utilize o [Postman](https://www.getpostman.com/)  para testar suas chamadas.

### Método: GET  /route
Esse *endpoint* possibilita o usuário consultar a melhor rota, baseada no custo de viagem.

    GET /api/route?travel={DE}-{PARA}
    
  > Substituir os parâmetros {DE} e {PARA}, pelo locais de origem e destino que deseja consultar

#### Exemplo da requisição: 
    GET http://localhost:8080/api/route?travel=GRU-CDG
    
#### Exemplo de resposta:
 
    {
	    "route":  "GRU BRC SCL ORL CDG",
	    "cost":  40
	}

O objeto de resposta tem dois valores:

 - *route*: com a rota que o viajante terá que fazer
 - *cost*: com o custo dessa viagem

### Método: POST  /route
   Esse *endpoint* possibilita o usuário cadastrar uma nova rota
   
    POST /api/route
    
Corpo da requisição:

    {
	    "to": <String>,
	    "from": <String>,
	    "cost": <Number>
    }

#### Exemplo da requisição: 
    POST http://localhost:8080/api/route
    BODY: {
	    "to": "BSB",
	    "from": "CWB",
	    "cost": 20 
    }
    
#### Exemplo de resposta:
 
    {
	    "message":  "New route successfully registered"
    }
    
## Interface por linha de comando (CLI)

Para executar a aplicação por linha de comando basta rodar:

```sh
npm run travel-cli --inputFile=input-routes.csv
```
Informar a rota que deseja calcular no formato "DE-PARA": 
```sh
Please enter the route: GRU-CDG
```
E verificar o resultado com a melhor rota e seu respectivo valor:
```sh
best route: GRU BRC SCL ORL CDG > 40
```

## Executando dos testes automatizados

Esse projeto foi construido com testes de integração automatizados. Para executar os testes utilize o comando:
```sh
npm test --inputFile=input-routes-test.csv
```

![Resultado dos testes](https://i.ibb.co/wJZZmZ5/Screen-Shot-2021-01-03-at-15-03-19.png)

### Executando os testes com cobertura de código (Code Coverage)

Para executar esses testes juntamente com a cobertura de código, rode o seguinte comando:

```sh
npm run coverage --inputFile=input-routes-test.csv
```

Você pode ver o *report* do *code coverage* no terminal, ou na pasta **coverage > index.html**

![Resultado do coverage](https://i.ibb.co/tQhpBNc/Screen-Shot-2021-01-03-at-15-09-27.png)

![Resultado do coverage HTML](https://i.ibb.co/Chnx2dh/Screen-Shot-2021-01-03-at-15-14-25.png)
