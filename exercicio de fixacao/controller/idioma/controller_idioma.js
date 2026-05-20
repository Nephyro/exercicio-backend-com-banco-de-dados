/********************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *      manipulação para o CRUD do idioma
 * Data: 20/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 ********************************************************************************/

const config_message = require('../modulo/configMessages.js')

const idiomaDAO = require('../../model/DAO/idioma/idioma.js')

const inserirNovoIdioma = async function(idioma, contentType) {

    let message = JSON.parse(JSON.stringify(config_message))

    try {
        
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            
            let validar = await validarDados(idioma)

            if(validar)
                return validar
            else{
                let result = await idiomaDAO.insertIdioma(idioma)

                if(result){
                    idioma.id = result

                    message.DEFUAL_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFUAL_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFUAL_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFUAL_MESSAGE.response = idioma
                }else{
                    return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
                }

                return message.DEFUAL_MESSAGE  //200 (Criado)
            }
        }else{
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER  //500 (controller)
    }
}

const atualizarIdioma = async function(idioma, id, contentType) {
    
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let resultBuscarID = await buscarIdioma(id)

            if(resultBuscarID.status){
                let validar = await validarDados(idioma)

                if(!validar){
                    idioma.id = id

                    let result = await idiomaDAO.updateIdioma(idioma)

                    if(result){
                        message.DEFUAL_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                        message.DEFUAL_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        message.DEFUAL_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                        message.DEFUAL_MESSAGE.response = idioma

                        return message.DEFUAL_MESSAGE //200 (Atualizado)
                    }
                }else{
                    return validar //400 (Validação dos campos obrigatórios)
                }
            }else{
                return resultBuscarID //404 ou 500 (buscar por ID)
            }
        }else{
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const listarIdioma = async function() {

    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await idiomaDAO.selectAllIdioma()

        if(result){
            if(result.length > 0){
                message.DEFUAL_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                message.DEFUAL_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                message.DEFUAL_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                message.DEFUAL_MESSAGE.response = result

                return message.DEFUAL_MESSAGE //200 (Registros encontrados)
            }else{
                return message.ERROR_NOT_FOUND  //404 (Nenhum registro encontrado)
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const buscarIdioma = async function(id) {

    let message = JSON.parse(JSON.stringify(config_message))

    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST //400
        }else{
            let result = await idiomaDAO.selectByIdIdioma(id)

            if(result){
                if(result.length > 0){
                    message.DEFUAL_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFUAL_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFUAL_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFUAL_MESSAGE.response = result

                    return message.DEFUAL_MESSAGE //200 (Registro encontrado)
                }else{
                    return message.ERROR_NOT_FOUND //404 (Nenhum registro encontrado)
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const excluirIdioma = async function(id) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBuscarID = await bauscarIdioma(id)

        if(resultBuscarID.status){
            let result = await idiomaDAO.deleteIdioma(id)

            if(result){
                return message.SUCCESS_DELETED_ITEM //200 (Registro excluído)
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
        }else{
            return resultBuscarID //400 ou 404 ou 500 (buscar por ID)
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

const validarDados = async function(idioma) {
    let message = JSON.parse(JSON.stringify(config_message))

    if(
        idioma.nome == undefined ||
        idioma.nome == '' ||
        idioma.nome == null
        (!isNaN(idioma.nome))
    ){
        message.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400 (Validação dos campos obrigatórios)
    }else if(
        idioma.sigla == undefined ||
        idioma.sigla == '' ||
        idioma.sigla == null ||
        (!isNaN(idioma.sigla))
    ){
        message.ERROR_BAD_REQUEST.field = '[SIGLA] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400 (Validação dos campos obrigatórios)
    }else
        return false //Validação ok, pode cadastrar ou atualizar
}

module.exports = {
    inserirNovoIdioma,
    atualizarIdioma,
    listarIdioma,
    buscarIdioma,
    excluirIdioma
}