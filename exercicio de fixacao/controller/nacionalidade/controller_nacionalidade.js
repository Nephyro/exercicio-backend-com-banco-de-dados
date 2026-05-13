/********************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *      manipulação para o CRUD da nacionalidade
 * Data: 13/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 ********************************************************************************/

// Import do arquivo de padronização de mensagens
const config_message = require('../modulo/configMessages.js')

// Import do arquivo DAO para fazer o CRUD da nacionalidade no banco de dados
const nacionalidadeDAO = require('../../model/DAO/nacionalidade/nacionalidade.js')

// Função para inserir uma nova nacionalidade
const inserirNovaNacionalidade = async function(nacionalidade, contentType) {

    // Criando um clone do objeto JSON para manipular a sua estrutura local sem 
    // modificar a estruturo original
    let message = JSON.parse(JSON.stringify(config_message))

    try {
          
        // Validação para o tipo de dados da requisição (somente JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Validação de dados para os atributos da Nacionalidade (Status 400 - Bad Request)
            let validar = await validarDados(nacionalidade)

            // Se a função validar retornar um json de erro, iremos devolver ao 
            // APP o erro
            if(validar){
                return validar //400
            }else{
                // Encaminha os dados da nacionalidade para o DAO
                let result = await nacionalidadeDAO.insertNacionalidade(nacionalidade)

                if(result){ //201
                    // Criando o atributo ID no JSON da nacionalidade e colocando
                    // o ID gerad após o insert
                    nacionalidade.id = result

                    message.DEFUAL_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFUAL_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFUAL_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFUAL_MESSAGE.response = nacionalidade
                }else{  //500
                    return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
                }

                return message.DEFUAL_MESSAGE
            }
        }else{
            return message.ERROR_CONTENT_TYPE //415
        }
    
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }

}

// Função para atualizar um nacionalidade existente
const atualizarNacionalidade = async function(nacionalidade, id, contentType) {

    let message = JSON.parse(JSON.stringify(config_message))

    try {
        // Validação do content type para receber apenas JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            // Validação para o ID incorreto
            let resultBuscarID = await buscarNacionalidade(id)

            // Se a função encontrar a nacionalidade o atributo status do JSON será verdadeiro
            // Isso significa que a nacionalidade existe na base, caso não retorne true, então
            // o  retorno da função poderá ser um 400 ou 404 ou até mesmo um 500
            if(resultBuscarID.status){
                let validar = await validarDados(nacionalidade)

                // Validação de campos obrigatórios para a atualização (Body)
                if(!validar){
                    // Adiciono o atributo ID da nacionalidade no JSON para ser enviado ao DAO
                    nacionalidade.id = id //Garantir que o ID do nacionalidade seja o mesmo do parâmetro da função

                    // Chama a função do DAO para atualizar a nacionalidade (dados e o ID)
                    let result = await nacionalidadeDAO.updateNacionalidade(nacionalidade)

                    if(result){
                        message.DEFUAL_MESSAGE.status = message.SUCCESS_UPDATED_ITEM.status
                        message.DEFUAL_MESSAGE.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        message.DEFUAL_MESSAGE.message = message.SUCCESS_UPDATED_ITEM.message
                        message.DEFUAL_MESSAGE.response = nacionalidade

                        return message.DEFUAL_MESSAGE //200 (Atualizado)

                    }else{
                        return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
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
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)   
    }
}

// Função para retornar todos as nacionalidades cadastradas
const listarNacionalidade = async function() {
    // Criando um clone do objeto JSON para manipular a sua estrutura local sem 
    // modificar a estruturo original
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        // Chama a função do DAO para retornar a lista de todos os filmes
        let result = await nacionalidadeDAO.selectAllNacionalidade()

        // Validação para verificar se o DAO conseguiu processar os dados
        if(result){
            // Validação para verificar se existe conteúdo no array
            if(result.length > 0){
                message.DEFUAL_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFUAL_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFUAL_MESSAGE.response.count = result.length
                message.DEFUAL_MESSAGE.response.nacionalidade = result

                return message.DEFUAL_MESSAGE //200 (Dados do nacionalidade)
            }else{
                return message.ERROR_NOT_FOUND //404
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
        }

    } catch (error) {
        console.log("Erro no controller listarNacionalidade:", error);
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    } 
}

// Função para buscar uma nacionalidade pelo ID
const buscarNacionalidade = async function(id) {
    // Criando um clone do objeto JSON para manipular a sua estrutura local sem 
    // modificar a estruturo original
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        // Validação para garantir que o ID seja válido
        if(id == undefined || id == '' || id == null || isNaN(id)){
            message.ERROR_BAD_REQUEST.field = '[ID] INVÁLIDO'
            return message.ERROR_BAD_REQUEST //400
        }else{
            let result = await nacionalidadeDAO.selectByIdNacionalidade(id)

            if(result){
                if(result.length > 0){
                    message.DEFUAL_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFUAL_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFUAL_MESSAGE.response.nacionalidade = result

                    return message.DEFUAL_MESSAGE //200
                }else{
                    return message.ERROR_NOT_FOUND //404
                } 
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
        }
    } catch (error) {
        console.log("Erro no controller buscarNacionalidade:", error);
        
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

// Função para excluir uma nacionalidade
const excluirNacionalidade = async function(id) {
    let message = JSON.parse(JSON.stringify(config_message))

    try {
        //Validação do erro 500 e 404
        let resultBuscarID = await buscarNacionalidade(id)
        
        // Validação para verificar se o status é verdadeiro(se existe a nacionalidade)
        if(resultBuscarID.status){
            let result = await nacionalidadeDAO.deleteNacionalidade(id)

            if(result){
                return message.SUCCESS_DELETED_ITEM //200 (Registro excluído)
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
        }else{
            return resultBuscarID //400 ou 404 ou 500
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_CONTROLLER //500 (controller)
    }
}

// Função para validar todos os dados da nacionalidade 
// (obrigatórios, tipo de dado, tamanho, etc)
const validarDados = async function(nacionalidade) {

    let message = JSON.parse(JSON.stringify(config_message))
    
    if(
        nacionalidade.pais_origem == undefined ||
        nacionalidade.pais_origem == '' ||
        nacionalidade.pais_origem == null
    ){
        message.ERROR_BAD_REQUEST.field = '[PAIS_ORIGEM] INVÁLIDO'
        return message.ERROR_BAD_REQUEST //400
    }else{
        return false
    }
}




module.exports = {
    inserirNovaNacionalidade,
    listarNacionalidade,
    buscarNacionalidade,
    atualizarNacionalidade,
    excluirNacionalidade
}