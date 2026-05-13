/********************************************************************************
 * Objetivo: Arquivo responsável pela configuração e padronização das mensagens 
 *      de resposta da API
 * Data: 13/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 ********************************************************************************/

// Padronização de cabeçalho para retorno dos endpoint da API
const DEFUALT_MESSAGE = {
    api_description: 'API para gerenciar controle de Filmes',
    development: 'Anderson Ribeiro Soares',
    version: '1.0.5.26',
    status: Boolean,
    status_code: Number,
    response: {}
}

// Mensagens de erro da API
const ERROR_BAD_REQUEST                 = {status : false, status_code: 400, message: 'Os dados enviados na requisição não estão corretos.'}
const ERROR_INTERNAL_SERVER_MODEL       = {status : false, status_code: 500, message: 'Não foi possível processar a requisição por conta de erro na API [ERRO NA MODELAGEM DE DADOS].'}
const ERROR_INTERNAL_SERVER_CONTROLLER  = {status : false, status_code: 500, message: 'Não foi possível processar a requisição por conta de erro na API [ERRO NA CONTROLLER].'}
const ERROR_CONTENT_TYPE                = {status : false, status_code: 415, message: 'Não foi possível processar a requisição pois o formato de dados aceito pela API é somente JSON.'}
const ERROR_NOT_FOUND                   = {status : false, status_code: 404, message: 'Não foi encontrado nenhum dado para retorno.'}

// Mensagens de Sucesso da API
const SUCCESS_CREATED_ITEM =    {status : true, status_code: 201, message: 'Registro inserido com sucesso!'}
// Retornos para GET 200
const SUCCESS_RESPONSE     =    {status : true, status_code: 200}
// Retorno para PUT 200
const SUCCESS_UPDATED_ITEM =    {status : true, status_code: 200, message: 'Registro atualizado com sucesso!'}

// Retorno para DELETE (200 ou 204)
const SUCCESS_DELETED_ITEM =    {status : true, status_code: 200, message: 'Registro excluido com sucesso!'}

module.exports = {
    DEFUALT_MESSAGE,
    ERROR_BAD_REQUEST,
    SUCCESS_CREATED_ITEM,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_CONTENT_TYPE,
    ERROR_NOT_FOUND,
    SUCCESS_RESPONSE,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_DELETED_ITEM
}