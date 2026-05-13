/********************************************************************************
 * Objetivo: Arquivo responsável pela criação dos ENDPOINTS da API para o CRUD da nacionalidade
 * Data: 13/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 ********************************************************************************/

// Import das depedencias para criar a API
const express       = require('express')
const cors          = require('cors')
const bodyParser    = require('body-parser')

// Import das CONTROLLERS do projeto
const controllerNacionalidade = require('./controller/nacionalidade/controller_nacionalidade.js')

// Criando um objeto para manipular dados do body da API em formato JSON
const bodyParserJSON = bodyParser.json()

// Criando um objeto para manipular o express
const app = express()

// Conjunto de permissões a serem aplicadas no CORS da API
const corsOptions = {
    origin: ['*'], //A origem da requisição, podendo um IP ou *(Todos)
    methods: 'GET, POST, PUT, DELETE, OPTIONS', //São os verbos que serão liberados na API (GET, POST, PUT e DELET)
    allowedHeaders: ['Content-type', 'Authorization'] //São permissões de cabeçalho do CORS
}

// Configura as permissões da API atráves do CORS
app.use(cors(corsOptions))

// ENDPOINTS

// Endpoint para Inserir uma nova nacionalidade
app.post('/v1/senai/filme/pessoa/nacionalidade', bodyParserJSON, async function(request, response){
    // Recebe o conteúdo dentro do body da requisição e armazena em uma variável local
    let dados = request.body
    // Recebe o content type da requisição, para validar se é um JSON
    let contentType = request.headers['content-type']
    

    let result = await controllerNacionalidade.inserirNovaNacionalidade(dados, contentType)
    
    response.status(result.status_code)
    response.json(result)

})

// Endpoint para Listar todas as nacionalidades
app.get('/v1/senai/filme/pessoa/nacionalidade', async function(request, response){
    let result = await controllerNacionalidade.listarNacionalidade()

    response.status(result.status_code)
    response.json(result)
})

// Endpoint para Listar uma nacionalidade pelo ID
app.get('/v1/senai/filme/pessoa/nacionalidade/:id', async function(request, response){
    // Recebe o ID via parâmetro
    let id = request.params.id

    let result = await controllerNacionalidade.buscarNacionalidade(id)

    response.status(result.status_code)
    response.json(result)
})

// Endpoint para Atualizar uma nacionalidade pelo ID 
app.put('/v1/senai/filme/pessoa/nacionalidade/:id', bodyParserJSON, async function(request, response){
    // Recebe o content type da requisição
    let contentType = request.headers['content-type']
    // Recebe o ID do registro a ser atualizado
    let id = request.params.id
    // Recebe os dados enviados no corpo da requisição
    let dados = request.body

    // Chama a função de atualizar na controller e encaminha os dados, id e content-type
    // obedecendo a ordem de criação na função da controller
    let result = await controllerNacionalidade.atualizarNacionalidade(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

// Endpoint para Deletar uma nacionalidade pelo ID 
app.delete('/v1/senai/filme/pessoa/nacionalidade/:id', async function(request, response){
    let id = request.params.id

    let result = await controllerNacionalidade.excluirNacionalidade(id)

    response.status(result.status_code)
    response.json(result)
})


// Serve para inicializar a API para receber requisições
app.listen(8080, function(){
    console.log('API funcionando e aguardando novas requisições...')
})