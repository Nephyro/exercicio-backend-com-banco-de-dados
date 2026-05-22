/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *      manipulação de dados para o CRUD de filmes
 * Data: 22/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do filme no banco de dados
const filmeDAO = require('../../model/DAO/filme/filme.js')

//Import de arquivos de Controller
const controller_classificacao = require('../classificacao/controller_classificacao.js')
const controller_filme_genero  = require('./controller_filme_genero.js')

//Função para inserir um novo Filme
const inserirNovoFilme = async function(filme, contentType){
   
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem
    //modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
   
        //Validação para o tipo de dados da requisição (somente JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Validação de dados para os atributos do Filme (Status 400)
            let validar = await validarDados(filme)

            //Se a função validar retornar um Json de erro, iremos devolver ao 
            // APP o erro
            if(validar){
                return validar //400
            }else{
                //Encaminha os dados do filme para o DAO
                let result = await filmeDAO.insertFilme(filme)

                if(result){ //201
                    //Criando o atributo ID no JSON do filme e colocando
                    // o ID gerado após o insert
                    filme.id = result

                    //Manipulação de dados para inserir os Generos do Filme
                    for(genero of filme.genero){
                        //Cria o objeto JSON com os ids do filme e do genero
                        let filmeGenero = { "id_filme": filme.id, 
                                            "id_genero": genero.id
                                        }
                        //Chama a controller do filme genero para inserir os IDs                
                        let resultInsertGenero = await controller_filme_genero.inserirNovoFilmeGenero(filmeGenero)
                        console.log(resultInsertGenero)

                        if(!resultInsertGenero.status){
                            return message.SUCCESS_CREATED_ITEM_WARNIG //201 com alerta de dados não inseridos
                        }
                        
                    }

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = filme
                }else{ //500
                    return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
                }
                return message.DEFAULT_MESSAGE
            }
        }else{
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função para atualizar um filme
const atualizarFilme = async function(filme, id, contentType)
{
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        //Validação do Contenty type para receber apenas JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            //Validação para o ID incorreto
            let resultBuscarID = await buscarFilme(id)

            //Se a função buscar encontrar o filme o atributo status do JSON será verdadeiro
            //Isso significa que o filme existe na base, caso não retorne true, então 
            //o retorno da função poderá ser um 400 ou 404 ou até mesmo um 500
            if(resultBuscarID.status){
                let validar = await validarDados(filme)

                //Validação de campos obrigatórios para a atualização (Body)
                if(!validar){
                    //Adiciono o atributo ID do filme no JSON para ser enviado ao DAO
                    filme.id = id

                    //Chama a função do DAO para atualizar o Filme (dados e o ID)
                    let result = await filmeDAO.updateFilme(filme)

                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATED_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATED_ITEM.message
                        message.DEFAULT_MESSAGE.response    = filme
                         
                        return message.DEFAULT_MESSAGE //200 (Atualizado)

                    }else{
                        return message.ERROR_INTERNAL_SERVER_MODEL //500
                    }

                }else{
                    return validar //400
                }
            }else{
                return resultBuscarID //400 ou 404 ou 500
            }

            
        }else{
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500 (Controller)
    }
}

//Função para retornar todos os filmes
const listarFilme = async function(){
    
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem
    //modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        //Chama a função do DAO para retornar a lista de todos os filmes
        let result = await filmeDAO.selectAllFilme()

        //Validação para verificar se o DAO conseguiu processar os dados
        if(result){
            //Validação para verificar se existe conteúdo no array
            if(result.length > 0){

                //Percorre o ARRAY de filmes para identificar os dados da classificação
                for(filme of result){
                    //Busca na controller da classificação o ID referente aos dados
                    let resultClassificacao = await controller_classificacao.buscarClassificacao(filme.id_classificacao)
                    //Se a classificação foi encontrada
                    if(resultClassificacao.status){
                        //Cria o atributo classificacao no filme e adiciona os dados referente
                        // a classificacao
                        filme.classificacao = resultClassificacao.response.classificacao
                        //Apaga o atributo id_classificacao do filme para não ficar repetido
                        delete filme.id_classificacao
                    }

                    //Cria o objeto de Generos relacionado ao Filme
                    let resultGenero = await controller_filme_genero.buscarGeneroIdFilme(filme.id)
                    if(resultGenero.status){
                        filme.genero = resultGenero.response.filme_genero
                    }
                }

                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count = result.length
                message.DEFAULT_MESSAGE.response.filme = result

                return message.DEFAULT_MESSAGE //200 (Dados do Filme)
            }else{
                return message.ERROR_NOT_FOUND //404
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função para buscar um filme pelo ID
const buscarFilme = async function(id){
    
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem
    //modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        //Validaçção para garantir que o ID seja válido
        if(id == undefined || id == '' || id == null ||  isNaN(id)){
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST //400
        }else{
            let result = await filmeDAO.selectByIdFilme(id)

            if(result){
                if(result.length > 0){

                        //Percorre o ARRAY de filmes para identificar os dados da classificação
                        for(filme of result){
                            //Busca na controller da classificação o ID referente aos dados
                            let resultClassificacao = await controller_classificacao.buscarClassificacao(filme.id_classificacao)
                            //Se a classificação foi encontrada
                            if(resultClassificacao.status){
                                //Cria o atributo classificacao no filme e adiciona os dados referente
                                // a classificacao
                                filme.classificacao = resultClassificacao.response.classificacao
                                //Apaga o atributo id_classificacao do filme para não ficar repetido
                                delete filme.id_classificacao
                            }

                            //Cria o objeto de Generos relacionado ao Filme
                            let resultGenero = await controller_filme_genero.buscarGeneroIdFilme(filme.id)
                            if(resultGenero.status){
                                filme.genero = resultGenero.response.filme_genero
                            }
                        }

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.filme = result

                    return message.DEFAULT_MESSAGE //200
                }else{
                    return message.ERROR_NOT_FOUND //404
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para excluir um filme
const excluirFilme = async function(id){

    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        //Validação do erro 400 e 404
        let resultBuscarID = await buscarFilme(id)

        //Validação para verificar se o status é verdadeiro(se existe o filme)
        if(resultBuscarID.status){
            //Chamar a função do DAO para excluir o filme
            let result = await filmeDAO.deleteFilme(id)

            if(result){
                return message.SUCCESS_DELETED_ITEM //200 (Registro excluído)
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (Model)
            }
        }else{
            return resultBuscarID //400 ou 404
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

//Função para validar todos os dados de filme 
// (obrigatórios, qtde de caracteres, etc)
const validarDados = async function(filme){

    // console.log(filme.valor.split('.')[0].length)
    //Cria um clone da const de mensagebs
    let message = JSON.parse(JSON.stringify(config_message))

    if(filme.nome == undefined || filme.nome == '' || filme.nome == null || filme.nome.length > 80){
        message.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else if(filme.data_lancamento == undefined || filme.data_lancamento == '' || filme.data_lancamento == null ||  filme.data_lancamento.length != 10){
        message.ERROR_BAD_REQUEST.field = '[DATA_LANCAMENTO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else if(filme.duracao == undefined || filme.duracao == '' || filme.duracao == null ||  filme.duracao.length < 5){
        message.ERROR_BAD_REQUEST.field = '[DURACAO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else if(filme.sinopse == undefined || filme.sinopse == '' || filme.sinopse == null){
        message.ERROR_BAD_REQUEST.field = '[SINOPSE] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else if(isNaN(filme.avaliacao) || filme.avaliacao.length > 3){
        message.ERROR_BAD_REQUEST.field = '[AVALIAÇÃO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else if(filme.valor == undefined || filme.valor == '' || filme.valor == null ||  filme.valor.split('.')[0].length > 3 || isNaN(filme.valor)){
        message.ERROR_BAD_REQUEST.field = '[VALOR] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else if(filme.capa.length > 255){
        message.ERROR_BAD_REQUEST.field = '[CAPA] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    
    //Validação para a FK da classificação
    }else if(filme.id_classificacao == undefined || filme.id_classificacao == '' || filme.id_classificacao == null || isNaN(filme.id_classificacao) || filme.id_classificacao <=0){
        message.ERROR_BAD_REQUEST.field = '[ID_CLASSIFICAÇÃO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else{
        return false
    }
}

module.exports = {
    inserirNovoFilme,
    listarFilme,
    buscarFilme,
    atualizarFilme,
    excluirFilme
}