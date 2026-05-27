/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *      manipulação de dados para o CRUD de classificacaos
 * Data: 15/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

//Import do arquivo DAO para fazer o CRUD do classificacao no banco de dados
const classificacaoDAO = require('../../model/DAO/classificacao/classificacao.js')

//Função para inserir um novo classificacao
const inserirNovoClassificacao = async function(classificacao, contentType){
   
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem
    //modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
   
        //Validação para o tipo de dados da requisição (somente JSON)
        if(String(contentType).toUpperCase().includes('APPLICATION/JSON')){

            //Validação de dados para os atributos do classificacao (Status 400)
            let validar = await validarDados(classificacao)

            //Se a função validar retornar um Json de erro, iremos devolver ao 
            // APP o erro
            if(validar){
                return validar //400
            }else{
                //Encaminha os dados do classificacao para o DAO
                let result = await classificacaoDAO.insertClassificacao(classificacao)

                if(result){ //201
                    //Criando o atributo ID no JSON do classificacao e colocando
                    // o ID gerado após o insert
                    classificacao.id = result

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = classificacao
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

//Função para atualizar um classificacao
const atualizarClassificacao = async function(classificacao, id, contentType)
{
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        //Validação do Contenty type para receber apenas JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            //Validação para o ID incorreto
            let resultBuscarID = await buscarClassificacao(id)

            //Se a função buscar encontrar o classificacao o atributo status do JSON será verdadeiro
            //Isso significa que o classificacao existe na base, caso não retorne true, então 
            //o retorno da função poderá ser um 400 ou 404 ou até mesmo um 500
            if(resultBuscarID.status){
                let validar = await validarDados(classificacao)

                //Validação de campos obrigatórios para a atualização (Body)
                if(!validar){
                    //Adiciono o atributo ID do classificacao no JSON para ser enviado ao DAO
                    classificacao.id = id

                    //Chama a função do DAO para atualizar o classificacao (dados e o ID)
                    let result = await classificacaoDAO.updateClassificacao(classificacao)

                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATED_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATED_ITEM.message
                        message.DEFAULT_MESSAGE.response    = classificacao
                         
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

//Função para retornar todos os classificacaos
const listarClassificacao = async function(){
    
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem
    //modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        //Chama a função do DAO para retornar a lista de todos os classificacaos
        let result = await classificacaoDAO.selectAllClassificacao()

        //Validação para verificar se o DAO conseguiu processar os dados
        if(result){
            //Validação para verificar se existe conteúdo no array
            if(result.length > 0){
                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count = result.length
                message.DEFAULT_MESSAGE.response.classificacao = result

                return message.DEFAULT_MESSAGE //200 (Dados do classificacao)
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

//Função para buscar um classificacao pelo ID
const buscarClassificacao = async function(id){
    
    //Criando um clone do objeto JSON para manipular a sua estrutura local sem
    //modificar a estrutura original
    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        //Validaçção para garantir que o ID seja válido
        if(id == undefined || id == '' || id == null ||  isNaN(id)){
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST //400
        }else{
            let result = await classificacaoDAO.selectByIdClassificacao(id)

            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.classificacao = result

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

//Função para excluir um classificacao
const excluirclassificacao = async function(id){

    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        //Validação do erro 400 e 404
        let resultBuscarID = await buscarClassificacao(id)

        //Validação para verificar se o status é verdadeiro(se existe o classificacao)
        if(resultBuscarID.status){
            //Chamar a função do DAO para excluir o classificacao
            let result = await classificacaoDAO.deleteClassificacao(id)

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

//Função para validar todos os dados de classificacao 
// (obrigatórios, qtde de caracteres, etc)
const validarDados = async function(classificacao){

    // console.log(classificacao.valor.split('.')[0].length)
    //Cria um clone da const de mensagebs
    let message = JSON.parse(JSON.stringify(config_message))

    if(classificacao.nome == undefined || classificacao.nome == '' || classificacao.nome == null || classificacao.nome.length > 80){
        message.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else if(classificacao.sigla == undefined || classificacao.sigla == '' || classificacao.sigla == null ||  classificacao.sigla.length >= 3){
        message.ERROR_BAD_REQUEST.field = '[SIGLA] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else if(classificacao.descricao == undefined || classificacao.descricao == '' || classificacao.descricao == null ||  classificacao.descricao.length < 5){
        message.ERROR_BAD_REQUEST.field = '[DESCRIÇÃO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    
    }else{
        return false
    }
}

module.exports = {
    inserirNovoClassificacao,
    listarClassificacao,
    buscarClassificacao,
    atualizarClassificacao,
    excluirclassificacao
}