CREATE DATABASE mydb;
USE mydb;

CREATE TABLE IF NOT EXISTS `routes` (
   `id` int(11) NOT NULL,
   `name` varchar(45) NOT NULL,
   `geometry` json NOT NULL,
   `user` varchar(45) NOT NULL,
   `location` varchar(45) NOT NULL,
   `distance` double NOT NULL DEFAULT '0',
   `elevation` double NOT NULL DEFAULT '0',
   `favorites` json NOT NULL COMMENT '1D array'
 );
  
 ALTER TABLE `routes` ADD PRIMARY KEY (`id`);
 ALTER TABLE `routes` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;