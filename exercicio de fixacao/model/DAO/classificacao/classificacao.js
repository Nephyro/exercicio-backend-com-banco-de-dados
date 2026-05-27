/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela
 *           classificacao
 * Data: 15/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 ******************************************************************************/

//Import da bibliioteca para gerenciar o banco de dados Mysql no node.JS
const knex = require('knex')

//Import do arquivo de configuração para conexão com o BD Mysql
const knexConfig = require('../../../database_config_knex/knexFile.js')

//Criar a conexão com o BD Mysql
const knexConex = knex(knexConfig.development)

//Função para inserir dados na tabela de classificacao
const insertClassificacao = async function(classificacao){
    try {

        let sql = `insert into tbl_classificacao (
                            nome, 
                            sigla, 
                            descricao
                            )
                    values (
                            '${classificacao.nome}', 
                            '${classificacao.sigla}', 
                            '${classificacao.descricao}'
                            );`

        //Executar o ScriptSQL no banco de dados                        
        let result = await knexConex.raw(sql)
    

        if(result)
            return result[0].insertId //Retorno o ID geraddo no BD
        else
            return false

    } catch (error) {
        //console.log(error)
        return false
    }
}

//Função para atualizar um classificacao existente na tabela
const updateClassificacao = async function(classificacao){
    try {
        //Script para atualizar os dados no BD
        let sql = `update tbl_classificacao set 
                        nome            = '${classificacao.nome}',
                        sigla           = '${classificacao.sigla}',
                        descricao       = '${classificacao.descricao}'
                       
                    where id = ${classificacao.id}`

        //Executa o script SQL no BD
        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//Função para retornar todos os dados da tabela de classificacao
const selectAllClassificacao = async function(){
    try {
        //Script para retornar todos os classificacaos
        let sql = `select * from tbl_classificacao order by id desc`

        //Executa no banco de dados o script SQL para retornar os classificacaos
        let result = await knexConex.raw(sql)
        
        //Validação para verificar se o retorno no BD é um Array
        //Se o scriptSQL der erro, o banco não devolve um array
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}


//Função para retornar os dados do classificacao filtrando pelo ID
const selectByIdClassificacao = async function(id){
    try {
        let sql = `select * from tbl_classificacao where id=${id}`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Função para excluir um classificacao pelo ID
const deleteClassificacao = async function(id){
    try {
        let sql = `delete from tbl_classificacao where id=${id}`

        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    insertClassificacao,
    updateClassificacao,
    selectAllClassificacao,
    selectByIdClassificacao,
    deleteClassificacao
}