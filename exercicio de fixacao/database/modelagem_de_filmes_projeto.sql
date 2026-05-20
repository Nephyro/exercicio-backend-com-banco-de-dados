create database db_fixacao_filme_projeto;

use db_fixacao_filme_projeto;

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

create table tbl_filme (
	id 					int not null primary key auto_increment,
    nome 				varchar(80) not null,
    data_lancamento 	date not null,
	duracao				time not null,
    sinopse				varchar(100) not null,
    avaliacao			decimal(4,2),
    valor				decimal(5,2) not null,
    capa				varchar(255),
    id_produtora		int,
    id_classificacao 	int,
    
    constraint fk_produtora_filme
    foreign key (id_produtora)
    references tbl_produtora(id),
    
    constraint fk_classificacao_filme
    foreign key (id_classificacao)
    references tbl_classificacao(id)
);

alter table tbl_filme
modify column sinopse varchar(255) not null;