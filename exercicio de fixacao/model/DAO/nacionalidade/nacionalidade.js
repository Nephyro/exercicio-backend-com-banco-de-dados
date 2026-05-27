/********************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela
 *           Nacionalidade
 * Data: 13/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 ********************************************************************************/

// Import da biblioteca para gerenciar o banco de dados MySQL no node.JS
const knex = require('knex')

// Import do arquivo de configuração para conexão com o BD MySQL
const knexConfig = require('../../../database_config_knex/knexFile.js')

// Criar a conexão com o BD MySQL utilizando o knex e as configurações do arquivo knexFile.js
const knexConex = knex(knexConfig.development)

// Função para inserir dados na tabela de nacionalidade
const insertNacionalidade = async function(nacionalidade){
    try {
        
    
        let sql = `insert into tbl_nacionalidade (
                            pais_origem
                            )
                    values (
                            '${nacionalidade.pais_origem}'
                            );`

        // Executar o script SQL no banco de dados
        let result = await knexConex.raw(sql)       // await = esperar o resultado do banco de dados para depois continuar a execução do código

        if(result)
            return result[0].insertId   //Retorna o ID gerado no BD
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

// Função para atualizar uma nacionalidade existente na tabela
const updateNacionalidade = async function(nacionalidade){
    try {
        // Script para atualizar os dados do BD
        let sql = `update tbl_nacionalidade set
                        pais_origem            = '${nacionalidade.pais_origem}'
                    where id = ${nacionalidade.id}`
          
        // Executa o script SQL no BD
        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

// Função para retornar todos os dados da tabela de nacionalidade
const selectAllNacionalidade = async function(){
    try {
        // Script para retornar todos os filmes
        let sql = `select * from tbl_nacionalidade order by id desc` //desc - ordenação decrescente (do maior para o menor)

        // Executa no banco de dados o script SL para retornar os filmes
        let result = await knexConex.raw(sql)
        
        // Validação para verificar se o retorno no BD é um array
        // Se o scriptSQL der erro, o banco não devolve o array
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

// Função para retornar os dados da nacionalidade filtrando pelo ID
const selectByIdNacionalidade = async function(id){
    try {
        let sql = `select * from tbl_nacionalidade where id=${id}`

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

// Função para excluir uma nacionalidade pelo ID
const deleteNacionalidade = async function(id){
    try {
        let sql = `delete from tbl_nacionalidade where id=${id}`

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
    insertNacionalidade,
    updateNacionalidade,
    selectAllNacionalidade,
    selectByIdNacionalidade,
    deleteNacionalidade
}