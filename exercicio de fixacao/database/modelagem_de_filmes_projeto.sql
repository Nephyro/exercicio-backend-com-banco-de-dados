show databases;

create database db_fixacao_fime_projeto;

use db_fixacao_fime_projeto;

create table tbl_nacionalidade (
	id 		int not null primary key auto_increment,
    pais_origem varchar(100) not null
);

show tables;

desc tbl_nacionalidade;