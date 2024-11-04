-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: busbuddy
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `password_hashed` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact` int NOT NULL,
  `type` enum('MANAGER','DRIVER') NOT NULL,
  `driver_status` enum('OFF_WORK','ON_BREAK','DRIVING','GOING_BUS') DEFAULT NULL,
  `datetime_registered` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (-2,'BadD','badd','badd',0,'DRIVER','OFF_WORK','2000-01-01 00:00:00'),(-1,'BadM','badm','badm',0,'MANAGER',NULL,'2000-01-01 00:00:00'),(10,'Test','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','test@gmail.com',91234567,'MANAGER',NULL,'2024-10-09 19:05:37'),(21,'Driver 1','f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae','1@driver.com',11111111,'DRIVER','ON_BREAK','2024-11-05 02:03:58'),(22,'Driver 2','9b871512327c09ce91dd649b3f96a63b7408ef267c8cc5710114e629730cb61f','2@driver.com',22222222,'DRIVER','ON_BREAK','2024-11-05 02:04:16'),(23,'Driver 3','556d7dc3a115356350f1f9910b1af1ab0e312d4b3e4fc788d2da63668f36d017','3@driver.com',33333333,'DRIVER','ON_BREAK','2024-11-05 02:04:29'),(24,'Driver 4','3538a1ef2e113da64249eea7bd068b585ec7ce5df73b2d1e319d8c9bf47eb314','4@driver.com',44444444,'DRIVER','ON_BREAK','2024-11-05 02:04:43'),(25,'Driver 5','91a73fd806ab2c005c13b4dc19130a884e909dea3f72d46e30266fe1a1f588d8','5@driver.com',55555555,'DRIVER','ON_BREAK','2024-11-05 02:04:58'),(26,'Driver 6','c7e616822f366fb1b5e0756af498cc11d2c0862edcb32ca65882f622ff39de1b','6@driver.com',66666666,'DRIVER','ON_BREAK','2024-11-05 02:05:08'),(27,'Driver 7','eaf89db7108470dc3f6b23ea90618264b3e8f8b6145371667c4055e9c5ce9f52','7@driver.com',77777777,'DRIVER','ON_BREAK','2024-11-05 02:05:20'),(28,'Driver 7','eaf89db7108470dc3f6b23ea90618264b3e8f8b6145371667c4055e9c5ce9f52','7@driver.com',77777777,'DRIVER','ON_BREAK','2024-11-05 02:05:20'),(29,'Driver 8','5e968ce47ce4a17e3823c29332a39d049a8d0afb08d157eb6224625f92671a51','8@driver.com',88888888,'DRIVER','ON_BREAK','2024-11-05 02:05:32'),(30,'Driver 9','83cf8b609de60036a8277bd0e96135751bbc07eb234256d4b65b893360651bf2','9@driver.com',99999999,'DRIVER','ON_BREAK','2024-11-05 02:05:45'),(31,'Driver 10','2a057642222a878bc360f52f8e1f0dfd2af93196f123269397423155a4ec4884','10@driver.com',10101010,'DRIVER','ON_BREAK','2024-11-05 02:06:05');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus`
--

DROP TABLE IF EXISTS `bus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus` (
  `license_plate` varchar(10) NOT NULL,
  `capacity` int NOT NULL,
  `current_status` enum('UNSERVICEABLE','RESERVED','IN_DEPOT','TRAINING','ON_ROUTE','RETURNING') DEFAULT NULL,
  `service_number` varchar(10) DEFAULT NULL,
  `current_load` enum('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'LOW',
  PRIMARY KEY (`license_plate`),
  KEY `fk_BUS_SERVICE1_idx` (`service_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus`
--

LOCK TABLES `bus` WRITE;
/*!40000 ALTER TABLE `bus` DISABLE KEYS */;
INSERT INTO `bus` VALUES ('SBS0001A',100,'IN_DEPOT','179','LOW'),('SBS0001B',100,'IN_DEPOT','179','LOW'),('SBS0002A',100,'IN_DEPOT','179','LOW'),('SBS0002B',100,'IN_DEPOT','179','LOW'),('SBS0003A',100,'IN_DEPOT','179','LOW'),('SBS0003B',100,'IN_DEPOT','179','LOW'),('SBS1990A',100,'IN_DEPOT','199','LOW'),('SBS1990B',100,'IN_DEPOT','199','LOW'),('SBS1990C',100,'IN_DEPOT','199','LOW'),('SBS1990D',100,'IN_DEPOT','199','LOW'),('SBS1990E',100,'IN_DEPOT','199','LOW'),('SBS1990F',100,'IN_DEPOT','199','LOW');
/*!40000 ALTER TABLE `bus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_status_log`
--

DROP TABLE IF EXISTS `bus_status_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_status_log` (
  `BUS_license_plate` varchar(10) NOT NULL,
  `new_bus_status` enum('UNSERVICEABLE','RESERVED','IN_DEPOT','TRAINING','ON_ROUTE','RETURNING') NOT NULL,
  `datetime_changed` datetime NOT NULL,
  PRIMARY KEY (`BUS_license_plate`,`datetime_changed`),
  KEY `fk_BUS_STATUS_LOG_BUSES_idx` (`BUS_license_plate`),
  CONSTRAINT `fk_BUS_STATUS_LOG_BUSES` FOREIGN KEY (`BUS_license_plate`) REFERENCES `bus` (`license_plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_status_log`
--

LOCK TABLES `bus_status_log` WRITE;
/*!40000 ALTER TABLE `bus_status_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `bus_status_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_stop`
--

DROP TABLE IF EXISTS `bus_stop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_stop` (
  `stop_code` int NOT NULL,
  `stop_name` varchar(100) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `current_load` enum('LOW','MEDIUM','HIGH') DEFAULT NULL,
  PRIMARY KEY (`stop_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_stop`
--

LOCK TABLES `bus_stop` WRITE;
/*!40000 ALTER TABLE `bus_stop` DISABLE KEYS */;
INSERT INTO `bus_stop` VALUES (21371,'Blk 680C',1.34523,103.706,'LOW'),(21379,'Blk 263',1.34535,103.706,'LOW'),(22009,'Boon Lay Int',1.33932,103.705,'LOW'),(22451,'Opp Blk 643',1.33817,103.696,'LOW'),(22459,'Blk 643',1.33856,103.696,'LOW'),(22481,'Blk 691A CP',1.34246,103.706,'LOW'),(22489,'Blk 683A',1.34258,103.705,'LOW'),(22501,'Blk 662A',1.33769,103.703,'LOW'),(22509,'Blk 664C',1.33799,103.703,'LOW'),(22511,'Blk 658C',1.33746,103.7,'LOW'),(22519,'Blk 608',1.33773,103.7,'LOW'),(22521,'Pioneer Stn Exit A',1.33742,103.698,'LOW'),(22529,'Pioneer Stn Exit B',1.33777,103.697,'LOW'),(27011,'Hall 11 Blk 55',1.35586,103.686,'LOW'),(27021,'Hall 15',1.35324,103.682,'LOW'),(27031,'Hall 12',1.35187,103.681,'LOW'),(27041,'NIE CP 7',1.35072,103.679,'LOW'),(27051,'NIE Lib',1.34845,103.677,'LOW'),(27061,'Sch of ADM',1.34985,103.684,'LOW'),(27069,'Blk 41',1.35009,103.684,'LOW'),(27071,'Nanyang Cres Halls',1.35508,103.685,'LOW'),(27091,'Opp Blk 271 CP',1.34911,103.704,'LOW'),(27099,'Blk 271 CP',1.35024,103.704,'LOW'),(27101,'Opp Westwood Sec Sch',1.35259,103.701,'LOW'),(27109,'Westwood Sec Sch',1.35309,103.701,'LOW'),(27121,'Bef Nanyang Ave',1.35682,103.695,'LOW'),(27129,'Opp Nanyang Ave',1.35733,103.695,'LOW'),(27169,'Bef Jln Bahar',1.35693,103.694,'LOW'),(27171,'Bef Lor Danau',1.35605,103.692,'LOW'),(27179,'Aft Lor Danau',1.35618,103.692,'LOW'),(27181,'PUB Sub-Stn',1.35588,103.689,'LOW'),(27189,'Opp PUB Sub-Stn',1.35607,103.689,'LOW'),(27199,'Hall 11',1.35434,103.687,'LOW'),(27209,'Halls 8 & 9',1.35151,103.686,'LOW'),(27211,'Lee Wee Nam Lib',1.34793,103.681,'LOW'),(27219,'NIE Blk 2',1.34793,103.68,'LOW'),(27221,'Sch Of CEE',1.34623,103.679,'LOW'),(27231,'Wee Kim Wee Sch of C&I',1.34208,103.679,'LOW'),(27241,'SPMS',1.33999,103.681,'LOW'),(27251,'Academic Bldg Sth',1.34115,103.684,'LOW'),(27261,'Hall 4',1.34332,103.686,'LOW'),(27281,'Hall 1',1.34565,103.688,'LOW'),(27291,'Opp Hall 6',1.34772,103.687,'LOW'),(27301,'Blk 978',1.34045,103.694,'LOW'),(27309,'Blk 705',1.34107,103.694,'LOW'),(27311,'Hall 2',1.34902,103.685,'LOW'),(27321,'Blk 949',1.34404,103.692,'LOW'),(27329,'Blk 840',1.34404,103.692,'LOW');
/*!40000 ALTER TABLE `bus_stop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deployment_log`
--

DROP TABLE IF EXISTS `deployment_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deployment_log` (
  `ACCOUNT_id` int NOT NULL,
  `BUS_license_plate` varchar(10) NOT NULL,
  `datetime_start` datetime NOT NULL,
  `datetime_end` datetime DEFAULT NULL,
  `current_status` enum('PREDEPLOYMENT','BUFFER_TIME','ONGOING','RETURNING','COMPLETED','CANCELLED') NOT NULL,
  `uid` int NOT NULL AUTO_INCREMENT,
  `current_stop` int NOT NULL,
  PRIMARY KEY (`ACCOUNT_id`,`BUS_license_plate`,`datetime_start`),
  UNIQUE KEY `uid` (`uid`),
  KEY `fk_ACCOUNT_has_BUS_BUS1_idx` (`BUS_license_plate`),
  KEY `fk_ACCOUNT_has_BUS_ACCOUNT1_idx` (`ACCOUNT_id`),
  CONSTRAINT `deployment_log_ibfk_1` FOREIGN KEY (`ACCOUNT_id`) REFERENCES `account` (`id`),
  CONSTRAINT `fk_ACCOUNT_has_BUS_BUS1` FOREIGN KEY (`BUS_license_plate`) REFERENCES `bus` (`license_plate`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deployment_log`
--

LOCK TABLES `deployment_log` WRITE;
/*!40000 ALTER TABLE `deployment_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `deployment_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deployment_status_log`
--

DROP TABLE IF EXISTS `deployment_status_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deployment_status_log` (
  `new_status` enum('PREDEPLOYMENT','BUFFER_TIME','ONGOING','RETURNING','COMPLETED','CANCELLED') NOT NULL,
  `datetime_changed` datetime NOT NULL,
  `DEPLOYMENT_LOG_uid` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`DEPLOYMENT_LOG_uid`,`datetime_changed`),
  CONSTRAINT `deployment_status_log_ibfk_2` FOREIGN KEY (`DEPLOYMENT_LOG_uid`) REFERENCES `deployment_log` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deployment_status_log`
--

LOCK TABLES `deployment_status_log` WRITE;
/*!40000 ALTER TABLE `deployment_status_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `deployment_status_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers_status_log`
--

DROP TABLE IF EXISTS `drivers_status_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers_status_log` (
  `ACCOUNT_id` int NOT NULL,
  `new_driver_status` enum('OFF_WORK','ON_BREAK','DRIVING','GOING_BUS') DEFAULT NULL,
  `datetime_changed` datetime DEFAULT NULL,
  PRIMARY KEY (`ACCOUNT_id`),
  KEY `fk_DRIVERS_STATUS_LOG_ACCOUNT1_idx` (`ACCOUNT_id`),
  CONSTRAINT `drivers_status_log_ibfk_1` FOREIGN KEY (`ACCOUNT_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers_status_log`
--

LOCK TABLES `drivers_status_log` WRITE;
/*!40000 ALTER TABLE `drivers_status_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `drivers_status_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `service_number` varchar(10) NOT NULL,
  PRIMARY KEY (`service_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES ('179'),('199');
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_bus_stops`
--

DROP TABLE IF EXISTS `service_bus_stops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_bus_stops` (
  `service_number` varchar(10) NOT NULL,
  `bus_stop_code` int NOT NULL,
  `sequence_number` int NOT NULL,
  PRIMARY KEY (`service_number`,`bus_stop_code`,`sequence_number`),
  KEY `fk_service_has_bus_stop_bus_stop1_idx` (`bus_stop_code`),
  KEY `fk_service_has_bus_stop_service1_idx` (`service_number`),
  CONSTRAINT `fk_service_has_bus_stop_bus_stop1` FOREIGN KEY (`bus_stop_code`) REFERENCES `bus_stop` (`stop_code`),
  CONSTRAINT `fk_service_has_bus_stop_service1` FOREIGN KEY (`service_number`) REFERENCES `service` (`service_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_bus_stops`
--

LOCK TABLES `service_bus_stops` WRITE;
/*!40000 ALTER TABLE `service_bus_stops` DISABLE KEYS */;
INSERT INTO `service_bus_stops` VALUES ('199',21371,3),('199',21379,25),('179',22009,1),('179',22009,24),('199',22009,1),('199',22009,27),('179',22451,5),('179',22459,20),('199',22481,26),('199',22489,2),('179',22501,2),('179',22509,23),('179',22511,3),('179',22519,22),('179',22521,4),('179',22529,21),('199',27011,9),('199',27021,11),('199',27031,12),('199',27041,13),('199',27051,14),('179',27061,11),('199',27069,16),('199',27071,10),('199',27091,4),('199',27099,24),('199',27101,5),('199',27109,23),('199',27121,6),('199',27129,22),('199',27169,21),('199',27171,7),('199',27179,20),('199',27181,8),('199',27189,19),('199',27199,18),('199',27209,17),('179',27211,12),('199',27219,15),('179',27221,13),('179',27231,14),('179',27241,15),('179',27251,16),('179',27261,17),('179',27281,8),('179',27291,9),('179',27301,6),('179',27309,19),('179',27311,10),('179',27321,7),('179',27329,18);
/*!40000 ALTER TABLE `service_bus_stops` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-05  2:43:13
