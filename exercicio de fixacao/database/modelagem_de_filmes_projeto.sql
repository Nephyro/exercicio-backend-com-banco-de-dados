create database db_fixacao_fime_projeto;

use db_fixacao_fime_projeto;

show tables;

create table tbl_nacionalidade (
	id 		int not null primary key auto_increment,
    pais_origem varchar(100) not null
);


create table tbl_idioma (
	id 		int not null primary key auto_increment,
    nome 	varchar(45) not null,
    sigla	varchar(8) not null
);


create table tbl_profissao (
	id 			int not null primary key auto_increment,
    nome 		varchar(45) not null,
    cbo			varchar(8) not null,
    descricao	varchar(100)
);


create table tbl_tipo_telefone (
	id 			int not null primary key auto_increment,
    tipo 		varchar(15) not null
);


create table tbl_tipo_email (
	id 			int not null primary key auto_increment,
    tipo 		varchar(20) not null
);


create table tbl_genero (
	id 			int not null primary key auto_increment,
    nome 		varchar(100) not null,
    descricao	varchar(255),
    sigla		varchar(8)
);


create table tbl_classificacao (
	id 			int not null primary key auto_increment,
    nome 		varchar(50) not null,
    sigla		varchar(5) not null,
    descricao	varchar(255) not null
);


create table tbl_produtora (
	id 				int not null primary key auto_increment,
    nome 			varchar(100) not null,
    pais_origem		varchar(100) not null,
    ano_fundacao	date,
    site_oficial	varchar(255),
    descricao		varchar(100),
    logo_url		varchar(255)
);