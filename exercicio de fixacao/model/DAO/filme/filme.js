/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela
 *           Filme
 * Data: 22/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 ******************************************************************************/

//Import da bibliioteca para gerenciar o banco de dados Mysql no node.JS
const knex = require('knex')

//Import do arquivo de configuração para conexão com o BD Mysql
const knexConfig = require('../../../database_config_knex/knexFile.js')

//Criar a conexão com o BD Mysql
const knexConex = knex(knexConfig.development)

//Função para inserir dados na tabela de filme
const insertFilme = async function(filme){
    try {

        let sql = `insert into tbl_filme (
                            nome, 
                            data_lancamento, 
                            duracao, 
                            sinopse, 
                            avaliacao, 
                            valor, 
                            capa,
                            id_classificacao
                            )
                    values (
                            '${filme.nome}', 
                            '${filme.data_lancamento}', 
                            '${filme.duracao}',
                            '${filme.sinopse}',
                            if('${filme.avaliacao}' = '', null, '${filme.avaliacao}'),
                            '${filme.valor}',
                            '${filme.capa}',
                             ${filme.id_classificacao}
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

//Função para atualizar um filme existente na tabela
const updateFilme = async function(filme){
    try {
        //Script para atualizar os dados no BD
        let sql = `update tbl_filme set 
                        nome                = '${filme.nome}',
                        data_lancamento     = '${filme.data_lancamento}',
                        duracao             = '${filme.duracao}',
                        sinopse             = '${filme.sinopse}',
                        avaliacao           = if('${filme.avaliacao}' = '', null, '${filme.avaliacao}'),
                        valor               = '${filme.valor}',
                        capa                = '${filme.capa}',
                        id_classificacao    = ${filme.id_classificacao}	
                    where id = ${filme.id}`

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

//Função para retornar todos os dados da tabela de filme
const selectAllFilme = async function(){
    try {
        //Script para retornar todos os filmes
        let sql = `select * from tbl_filme order by id desc`

        //Executa no banco de dados o script SQL para retornar os filmes
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


//Função para retornar os dados do filme filtrando pelo ID
const selectByIdFilme = async function(id){
    try {
        let sql = `select * from tbl_filme where id=${id}`

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

//Função para excluir um filme pelo ID
const deleteFilme = async function(id){
    try {
        let sql = `delete from tbl_filme where id=${id}`

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
    insertFilme,
    updateFilme,
    selectAllFilme,
    selectByIdFilme,
    deleteFilme
}
