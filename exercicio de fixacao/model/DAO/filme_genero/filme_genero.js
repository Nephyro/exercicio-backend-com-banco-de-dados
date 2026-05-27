/******************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela
 *           de relação entre Filme e Genero
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

//Função para inserir dados na tabela de genero
const insertFilmeGenero = async function(filmeGenero){
    try {

        let sql = `insert into tbl_filme_genero (
                            id_filme,
                            id_genero
                            )
                    values (
                            ${filmeGenero.id_filme}, 
                            ${filmeGenero.id_genero}
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

//Função para atualizar um genero existente na tabela
const updateFilmeGenero = async function(filmeGenero){
    try {
        //Script para atualizar os dados no BD
        let sql = `update tbl_filme_genero set 
                        id_filme            = '${filmeGenero.id_filme}',
                        id_genero           = '${filmeGenero.id_genero}'	
                    where id = ${filmeGenero.id}`

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

//Função para retornar todos os dados da tabela de filme_genero
const selectAllFilmeGenero = async function(){
    try {
        //Script para retornar todos os generos
        let sql = `select * from tbl_filme_genero order by id desc`

        //Executa no banco de dados o script SQL para retornar os generos
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

//Função para retornar os dados do genero filtrando pelo ID
const selectByIdFilmeGenero = async function(id){
    try {
        let sql = `select * from tbl_filme_genero where id=${id}`

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

//Função para retornar os dados do filme filtrando pelo ID do genero
const selectFilmesByIdGenero = async function(idGenero){
    try {
        let sql = `select tbl_filme.*
                    from tbl_filme
                        inner join tbl_filme_genero
                            on tbl_filme.id = tbl_filme_genero.id_filme
                        inner join tbl_genero
                            on tbl_genero.id = tbl_filme_genero.id_genero
                    where tbl_genero.id=${idGenero}`

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

//Função para retornar os dados dos generos filtrando pelo ID do filme
const selectGenerosByIdFilme = async function(idFilme){
    try {
        let sql = `select tbl_genero.*
                    from tbl_filme
                        inner join tbl_filme_genero
                            on tbl_filme.id = tbl_filme_genero.id_filme
                        inner join tbl_genero
                            on tbl_genero.id = tbl_filme_genero.id_genero
                    where tbl_filme.id=${idFilme}`

        let result = await knexConex.raw(sql)

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

//Função para excluir um filme_genero pelo ID
const deleteFilmeGenero = async function(id){
    try {
        let sql = `delete from tbl_filme_genero where id=${id}`

        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

// Função para excluir os generos filtrando peli ID do filme
// Esssa função será utilizada no Update do filme, pois precisa apagar todos os generos
// relacionados com o fitro para inserir as novas relações
const deleteGenerosByIdFilme = async function(idFilme){
    try {
        let sql = `delete from tbl_filme_genero where id_filme=${idFilme}`

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
    insertFilmeGenero,
    updateFilmeGenero,
    selectAllFilmeGenero,
    selectByIdFilmeGenero,
    selectFilmesByIdGenero,
    selectGenerosByIdFilme,
    deleteFilmeGenero,
    deleteGenerosByIdFilme
}