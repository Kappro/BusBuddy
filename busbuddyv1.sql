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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (-2,'BadD','badd','badd',0,'DRIVER','OFF_WORK','2000-01-01 00:00:00'),(-1,'BadM','badm','badm',0,'MANAGER',NULL,'2000-01-01 00:00:00'),(10,'Test','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','test@gmail.com',91234567,'MANAGER',NULL,'2024-10-09 19:05:37'),(16,'Driver 1','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','driver1@bb.com',11111111,'DRIVER','ON_BREAK','2024-10-20 02:33:20'),(17,'Driver 2','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','driver2@bb.com',22222222,'DRIVER','ON_BREAK','2024-10-20 02:33:34'),(18,'Driver 3','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','driver3@bb.com',33333333,'DRIVER','ON_BREAK','2024-10-20 02:33:49'),(19,'Driver 4','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','driver4@bb.com',44444444,'DRIVER','OFF_WORK','2024-10-22 13:58:26');
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
  `current_status` enum('UNSERVICEABLE','IN_DEPOT','TRAINING','ON_ROUTE','RETURNING') NOT NULL DEFAULT 'IN_DEPOT',
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
INSERT INTO `bus` VALUES ('SBS0001A',100,'IN_DEPOT','179','LOW'),('SBS0002B',100,'IN_DEPOT','179','LOW'),('SBS0003B',100,'IN_DEPOT','179','LOW');
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
  `new_bus_status` enum('UNSERVICEABLE','IN_DEPOT','TRAINING','ON_ROUTE','RETURNING') NOT NULL,
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
INSERT INTO `bus_stop` VALUES (22009,'Boon Lay Int',1.33932,103.705,'LOW'),(22451,'Opp Blk 643',1.33817,103.696,'LOW'),(22459,'Blk 643',1.33856,103.696,'LOW'),(22501,'Blk 662A',1.33769,103.703,'LOW'),(22509,'Blk 664C',1.33799,103.703,'LOW'),(22511,'Blk 658C',1.33746,103.7,'LOW'),(22519,'Blk 608',1.33773,103.7,'LOW'),(22521,'Pioneer Stn Exit A',1.33742,103.698,'LOW'),(22529,'Pioneer Stn Exit B',1.33777,103.697,'LOW'),(27061,'Sch of ADM',1.34985,103.684,'LOW'),(27211,'Lee Wee Nam Lib',1.34793,103.681,'LOW'),(27221,'Sch Of CEE',1.34623,103.679,'LOW'),(27231,'Wee Kim Wee Sch of C&I',1.34208,103.679,'LOW'),(27241,'SPMS',1.33999,103.681,'LOW'),(27251,'Academic Bldg Sth',1.34115,103.684,'LOW'),(27261,'Hall 4',1.34332,103.686,'LOW'),(27281,'Hall 1',1.34565,103.688,'LOW'),(27291,'Opp Hall 6',1.34772,103.687,'LOW'),(27301,'Blk 978',1.34045,103.694,'LOW'),(27309,'Blk 705',1.34107,103.694,'LOW'),(27311,'Hall 2',1.34902,103.685,'LOW'),(27321,'Blk 949',1.34404,103.692,'LOW'),(27329,'Blk 840',1.34404,103.692,'LOW');
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
  `current_status` enum('PREDEPLOYMENT','BUFFER_TIME','ONGOING','COMPLETED','CANCELLED') NOT NULL,
  `uid` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ACCOUNT_id`,`BUS_license_plate`,`datetime_start`),
  UNIQUE KEY `uid` (`uid`),
  KEY `fk_ACCOUNT_has_BUS_BUS1_idx` (`BUS_license_plate`),
  KEY `fk_ACCOUNT_has_BUS_ACCOUNT1_idx` (`ACCOUNT_id`),
  CONSTRAINT `deployment_log_ibfk_1` FOREIGN KEY (`ACCOUNT_id`) REFERENCES `account` (`id`),
  CONSTRAINT `fk_ACCOUNT_has_BUS_BUS1` FOREIGN KEY (`BUS_license_plate`) REFERENCES `bus` (`license_plate`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deployment_log`
--

LOCK TABLES `deployment_log` WRITE;
/*!40000 ALTER TABLE `deployment_log` DISABLE KEYS */;
INSERT INTO `deployment_log` VALUES (16,'SBS0001A','2024-10-22 15:00:25','2024-10-22 15:00:25','CANCELLED',17),(16,'SBS0001A','2024-10-22 19:34:19','2024-10-22 19:34:19','CANCELLED',19),(16,'SBS0001A','2024-10-30 20:41:02','2024-10-30 20:40:51','CANCELLED',22),(17,'SBS0001A','2024-10-22 14:59:23','2024-10-22 14:59:23','CANCELLED',16),(17,'SBS0001A','2024-10-22 15:03:42','2024-10-22 15:03:42','CANCELLED',18),(17,'SBS0001A','2024-10-22 20:10:35','2024-10-22 20:10:35','CANCELLED',20),(18,'SBS0001A','2024-10-30 20:40:32','2024-10-30 20:40:32','CANCELLED',21);
/*!40000 ALTER TABLE `deployment_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deployment_status_log`
--

DROP TABLE IF EXISTS `deployment_status_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deployment_status_log` (
  `new_status` enum('PREDEPLOYMENT','BUFFER_TIME','ONGOING','COMPLETED','CANCELLED') NOT NULL,
  `datetime_changed` datetime NOT NULL,
  `DEPLOYMENT_LOG_uid` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`DEPLOYMENT_LOG_uid`,`datetime_changed`),
  CONSTRAINT `deployment_status_log_ibfk_2` FOREIGN KEY (`DEPLOYMENT_LOG_uid`) REFERENCES `deployment_log` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deployment_status_log`
--

LOCK TABLES `deployment_status_log` WRITE;
/*!40000 ALTER TABLE `deployment_status_log` DISABLE KEYS */;
INSERT INTO `deployment_status_log` VALUES ('CANCELLED','2024-10-22 14:59:23',16),('CANCELLED','2024-10-22 15:00:25',17),('PREDEPLOYMENT','2024-10-22 15:00:25',18),('CANCELLED','2024-10-22 15:03:42',18),('PREDEPLOYMENT','2024-10-22 15:05:00',19),('CANCELLED','2024-10-22 19:34:19',19),('PREDEPLOYMENT','2024-10-22 19:34:19',20),('CANCELLED','2024-10-22 20:10:35',20),('PREDEPLOYMENT','2024-10-22 20:10:35',21),('CANCELLED','2024-10-30 20:40:32',21),('PREDEPLOYMENT','2024-10-30 20:40:32',22),('CANCELLED','2024-10-30 20:40:51',22);
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
INSERT INTO `service` VALUES ('179'),('199'),('Blue'),('Test');
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
INSERT INTO `service_bus_stops` VALUES ('179',22009,1),('179',22009,24),('Blue',22009,1),('Test',22009,1),('179',22451,5),('Blue',22451,2),('Test',22451,2),('179',22459,20),('Test',22459,3),('179',22501,2),('Test',22501,4),('179',22509,23),('179',22511,3),('Test',22511,5),('179',22519,22),('Test',22519,6),('179',22521,4),('179',22529,21),('Test',22529,7),('179',27061,11),('179',27211,12),('179',27221,13),('179',27231,14),('179',27241,15),('179',27251,16),('179',27261,17),('179',27281,8),('179',27291,9),('179',27301,6),('179',27309,19),('179',27311,10),('179',27321,7),('179',27329,18);
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

-- Dump completed on 2024-11-02  3:00:54
