CREATE DATABASE IF NOT EXISTS cs425;
USE cs425;


CREATE TABLE IF NOT EXISTS `user` (
    `id` bigint not null auto_increment primary key,
    `uuid` varchar(36) not null unique key,
    `name` varchar(255) not null,
    `email` varchar(255) not null unique key,
    `password` varchar(255) not null,
    `date_created` datetime not null default current_timestamp,
    `date_updated` datetime default null on update current_timestamp
);

CREATE TABLE IF NOT EXISTS `category` (
    `id` bigint not null auto_increment primary key,
    `uuid` varchar(36) not null unique key,
    `name` varchar(255) not null unique key,
    `description` text,
    `date_created` datetime not null default current_timestamp,
    `date_updated` datetime default null on update current_timestamp
);

CREATE TABLE IF NOT EXISTS `budget` (
    `id` bigint not null auto_increment primary key,
    `uuid` varchar(36) not null unique key,
    `user_id` bigint not null,
    `category_id` bigint not null,
    `limit_amount` decimal(10, 2) not null,
    `start_date` date not null,
    `end_date` date not null,
    `alert_threshold` decimal(10, 2) not null,
    `date_created` datetime not null default current_timestamp,
    `date_updated` datetime default null on update current_timestamp,
    foreign key (`user_id`) references `user` (`id`),
    foreign key (`category_id`) references `category` (`id`)
);

CREATE TABLE IF NOT EXISTS `expense` (
    `id` bigint not null auto_increment primary key,
    `uuid` varchar(36) not null unique key,
    `user_id` bigint not null,
    `amount` decimal(10, 2) not null,
    `date` date not null,
    `description` text,
    `category_id` bigint not null,
    `date_created` datetime not null default current_timestamp,
    `date_updated` datetime default null on update current_timestamp,
    foreign key (`user_id`) references `user` (`id`),
    foreign key (`category_id`) references `category` (`id`)
);

CREATE TABLE IF NOT EXISTS `income_source` (
    `id` bigint not null auto_increment primary key,
    `uuid` varchar(36) not null unique key,
    `name` varchar(255) not null,
    `amount` decimal(10, 2) not null,
    `frequency` varchar(50) not null,
    `description` text,
    `user_id` bigint not null,
    `date_created` datetime not null default current_timestamp,
    `date_updated` datetime default null on update current_timestamp,
    foreign key (`user_id`) references `user` (`id`)
);

CREATE TABLE IF NOT EXISTS `report` (
    `id` bigint not null auto_increment primary key,
    `uuid` varchar(36) not null unique key,
    `generated_at` datetime not null,
    `type` varchar(100) not null,
    `data` text not null,
    `user_id` bigint not null,
    `date_created` datetime not null default current_timestamp,
    `date_updated` datetime default null on update current_timestamp,
    foreign key (`user_id`) references `user` (`id`)
);
