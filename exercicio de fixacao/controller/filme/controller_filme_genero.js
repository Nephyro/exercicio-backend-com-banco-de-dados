/*****************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 * manipulação de dados para o CRUD de Filme e Gêneros
 * Data: 22/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 *****************************************************************************/

// Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

// Import do arquivo DAO para fazer o CRUD do gênero no banco de dados
const filmeGeneroDAO = require('../../model/DAO/filme_genero/filme_genero.js')

// Função para inserir um novo gênero
const inserirNovoFilmeGenero = async function(filmeGenero){
   
    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
            // Validação de dados para os atributos do gênero (Status 400)
            let validar = await validarDados(filmeGenero)

            if(validar){
                return validar // 400
            } else {
                // Encaminha os dados do gênero para o DAO
                let result = await filmeGeneroDAO.insertFilmeGenero(filmeGenero)

                if(result){ // 201
                    filmeGenero.id = result

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = filmeGenero

                    return message.DEFAULT_MESSAGE
                } else { 
                    return message.ERROR_INTERNAL_SERVER_MODEL // 500
                } 
            }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Função para atualizar um gênero
const atualizarFilmeGenero = async function(filmeGenero, id) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {            
            // Valida se o ID existe
            let resultBuscarID = await buscarFilmeGenero(id)

            if(resultBuscarID.status){
                let validar = await validarDados(filmeGenero)

                if(!validar){
                    filmeGenero.id = id

                    let result = await filmeGeneroDAO.updateFilmeGenero(filmeGenero)

                    if(result){
                        message.DEFAULT_MESSAGE.status      = message.SUCCESS_UPDATED_ITEM.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        message.DEFAULT_MESSAGE.message     = message.SUCCESS_UPDATED_ITEM.message
                        message.DEFAULT_MESSAGE.response    = filmeGenero
                         
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
            
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

// Função para retornar todos os gêneros
const listarFilmeGenero = async function(){
    
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await filmeGeneroDAO.selectAllFilmeGenero()

        if(result){
            if(result.length > 0){
                // Removida a busca por classificação, já que gênero não possui essa FK

                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.response.count = result.length
                message.DEFAULT_MESSAGE.response.filme_genero = result

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
const buscarFilmeGenero = async function(id){
    
    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST // 400
        } else {
            let result = await filmeGeneroDAO.selectByIdFilmeGenero(id)

            if(result){
                if(result.length > 0){

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.filme_genero = result[0] // Retorna o objeto direto se preferir

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

// Função para buscar um gênero pelo ID
const buscarFilmeIdGenero = async function(idGenero){
    
    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        if(idGenero == undefined || idGenero == '' || idGenero == null || isNaN(idGenero)){
            message.ERROR_BAD_REQUEST.field = '[ID_GENERO] INVÁLIDO'
            return message.ERROR_BAD_REQUEST // 400
        } else {
            let result = await filmeGeneroDAO.selectFilmesByIdGenero(idGenero)

            if(result){
                if(result.length > 0){

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.filme_genero = result // Retorna o objeto direto se preferir

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

const buscarGeneroIdFilme = async function(idFilme){
    
    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        if(idFilme == undefined || idFilme == '' || idFilme == null || isNaN(idFilme)){
            message.ERROR_BAD_REQUEST.field = '[ID_GENERO] INVÁLIDO'
            return message.ERROR_BAD_REQUEST // 400
        } else {
            let result = await filmeGeneroDAO.selectGenerosByIdFilme(idFilme)

            if(result){
                if(result.length > 0){

                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.response.filme_genero = result // Retorna o objeto direto se preferir

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
const excluirFilmeGenero = async function(id){

    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
        let resultBuscarID = await buscarFilmeGenero(id)

        if(resultBuscarID.status){
            let result = await filmeGeneroDAO.deleteFilmeGenero(id)

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

// Função para excluir os gêneros relacionados com o filme
const excluirGenerosIdFilme = async function(idFilme){

    let message = JSON.parse(JSON.stringify(config_message))
    
    try {
            let result = await filmeGeneroDAO.deleteGenerosByIdFilme(idFilme)

            if(result){
                return message.SUCCESS_DELETED_ITEM // 200
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

const validarDados = async function(filmeGenero){

    let message = JSON.parse(JSON.stringify(config_message))

    // nome: Obrigatório, máximo 100 caracteres (conforme VARCHAR(100))
    if(filmeGenero.id_filme == undefined || filmeGenero.id_filme == '' || filmeGenero.id_filme == null || isNaN(filmeGenero.id_filme)){
        message.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO'
        return message.ERROR_BAD_REQUEST 
    } 
    else if(filmeGenero.id_genero == undefined || filmeGenero.id_genero == '' || filmeGenero.id_genero == null || isNaN(filmeGenero.id_genero)){
        message.ERROR_BAD_REQUEST.field = '[ID_GENERO] INVÁLIDO'
        return message.ERROR_BAD_REQUEST 
    }else {
        return false // Dados válidos
    }
}

module.exports = {
    inserirNovoFilmeGenero,
    listarFilmeGenero,
    buscarFilmeGenero,
    buscarFilmeIdGenero,
    buscarGeneroIdFilme,
    atualizarFilmeGenero,
    excluirFilmeGenero,
    excluirGenerosIdFilme
}