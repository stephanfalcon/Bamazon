drop database if exists bamazonDB;

create database bamazonDB;

use bamazonDB;

drop table if exists products;

create table products(
    item_id int auto_increment not null,
    product_name varchar(64) not null,
    departent_name varchar(64) not null,
    price decimal not null,
    stock_quantity int not null,
    primary key(item_id)
);

select * from products;