/********************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de dados MySQL na tabela
 *           Idioma
 * Data: 15/05/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 ********************************************************************************/

const knex = require('knex')

const knexConfig = require('../../../database_config_knex/knexFile.js')

const knexConex = knex(knexConfig.development)

const insertIdioma = async function(idioma){
    try {
        let sql = `insert into tbl_idioma (
                            nome,
                            sigla
                            )
                     values(
                            '${idioma.nome}',
                            '${idioma.sigla}'
                            )`

        let result = await knexConex.raw(sql)

        if(result)
            return result[0].insertId
        else
            return false
        
    } catch (error) {
        return false
    }
}

const updateIdioma = async function(idioma){
    try {
        let sql = `update tbl_idioma set
                        nome = '${idioma.nome}',
                        sigla = '${idioma.sigla}'
                    where id = ${idioma.id}`

        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
        
    } catch (error) {
        return false
    }
}

const selectAllIdioma = async function(){
    try {
        let sql = `select * from tbl_idioma order by id desc`

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

const selectByIdIdioma = async function(id){
    try {
        let sql = `select * from tbl_idioma where id = ${id}`

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

const deleteIdioma = async function(id){
    try {
        let sql = `delete from tbl_idioma where id=${id}`

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
    insertIdioma,
    updateIdioma,
    selectAllIdioma,
    selectByIdIdioma,
    deleteIdioma
}