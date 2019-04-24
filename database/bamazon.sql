drop database if exists bamazonDB;

create database bamazonDB;

drop table if exists products;

create table products(
    item_id int not null,
    product_name varchar(64) not null,
    departent_name varchar(64) not null,
    price decimal not null,
    stock_quantity int not null,
    primary key(item_id)
)

select * from products