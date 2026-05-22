/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 * manipulação de dados para o CRUD de gêneros
 * Data: 22/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.1
 *****************************************************************************/

// Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

// Import do arquivo DAO para fazer o CRUD do gênero no banco de dados
const generoDAO = require('../../model/DAO/genero/genero.js')

// Função para inserir um novo gênero
const inserirNovoGenero = async function(genero, contentType){
   
    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Validação de dados para os atributos do gênero (Status 400)
            let validar = await validarDados(genero)

            if(validar){
                return validar // 400
            } else {
                // Encaminha os dados do gênero para o DAO
                let result = await generoDAO.insertGenero(genero)

                if(result){ // 201
                    genero.id = result

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = genero
                } else { 
                    return message.ERROR_INTERNAL_SERVER_MODEL // 500
                }
                return message.DEFAULT_MESSAGE
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Função para atualizar um gênero
const atualizarGenero = async function(genero, id, contentType) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            
            // Valida se o ID existe
            let resultBuscarID = await buscarGenero(id)

            if(resultBuscarID.status){
                let validar = await validarDados(genero)

                if(!validar){
                    genero.id = id

                    let result = await generoDAO.updateGenero(genero)

                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATED_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATED_ITEM.message
                        message.DEFAULT_MESSAGE.response    = genero
                         
                        return message.DEFAULT_MESSAGE // 200

                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                } else {
                    return validar // 400
                }
            } else {
                return resultBuscarID // 404 ou 400
            }
        } else {
            return message.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Função para retornar todos os gêneros
const listarGenero = async function(){
    
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await generoDAO.selectAllGenero()

        if(result){
            if(result.length > 0){
                // Removida a busca por classificação, já que gênero não possui essa FK

                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count = result.length
                message.DEFAULT_MESSAGE.response.genero = result

                return message.DEFAULT_MESSAGE // 200
            } else {
                return message.ERROR_NOT_FOUND // 404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_MODEL // 500
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Função para buscar um gênero pelo ID
const buscarGenero = async function(id){
    
    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST // 400
        } else {
            let result = await generoDAO.selectByIdGenero(id)

            if(result){
                if(result.length > 0){
                    // Removido o laço que injetava classificação desnecessariamente

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.genero = result[0] // Retorna o objeto direto se preferir

                    return message.DEFAULT_MESSAGE // 200
                } else {
                    return message.ERROR_NOT_FOUND // 404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Função para excluir um gênero
const excluirGenero = async function(id){

    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        let resultBuscarID = await buscarGenero(id)

        if(resultBuscarID.status){
            let result = await generoDAO.deleteGenero(id)

            if(result){
                return message.SUCCESS_DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        } else {
            return resultBuscarID 
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// VALIDAÇÃO CORRIGIDA: Baseada puramente nos campos de tbl_genero
const validarDados = async function(genero){

    let message = JSON.parse(JSON.stringify(config_message))

    // nome: Obrigatório, máximo 100 caracteres (conforme seu VARCHAR(100))
    if(genero.nome == undefined || genero.nome == '' || genero.nome == null || genero.nome.length > 100){
        message.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return message.ERROR_BAD_REQUEST 
    } 
    // descricao: Opcional (losango vazio), mas se enviado não pode passar de 255 caracteres
    else if(genero.descricao && genero.descricao.length > 255){
        message.ERROR_BAD_REQUEST.field = '[DESCRIÇÃO] MUITO LONGA (MÁX 255 CARACTERES)'
        return message.ERROR_BAD_REQUEST 
    } 
    // sigla: Opcional, mas se enviado não pode passar de 5 caracteres (VARCHAR(5))
    else if(genero.sigla && genero.sigla.length > 5){
        message.ERROR_BAD_REQUEST.field = '[SIGLA] INVÁLIDA (MÁX 5 CARACTERES)'
        return message.ERROR_BAD_REQUEST 
    } 
    else {
        return false // Dados válidos!
    }
}

module.exports = {
    inserirNovoGenero,
    listarGenero,
    buscarGenero,
    atualizarGenero,
    excluirGenero
}