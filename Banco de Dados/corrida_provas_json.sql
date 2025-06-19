-- MySQL dump 10.13  Distrib 8.0.41, for macos15 (x86_64)
--
-- Host: localhost    Database: corrida
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `provas_json`
--

DROP TABLE IF EXISTS `provas_json`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provas_json` (
  `idjson` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `distancia` decimal(6,3) NOT NULL,
  `data_prova` date NOT NULL,
  `altimetria` int DEFAULT NULL,
  `modalidade` varchar(20) NOT NULL,
  PRIMARY KEY (`idjson`),
  CONSTRAINT `chk_modalidade` CHECK ((`modalidade` in (_utf8mb4'Montanha',_utf8mb4'Asfalto')))
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provas_json`
--

LOCK TABLES `provas_json` WRITE;
/*!40000 ALTER TABLE `provas_json` DISABLE KEYS */;
INSERT INTO `provas_json` VALUES (1,'Maratona de Boston - Estados Unidos',42.195,'2026-04-21',250,'Asfalto'),(2,'Maratona de Londres - Reino Unido',42.195,'2026-04-27',100,'Asfalto'),(3,'Maratona de Nova York - Estados Unidos',42.195,'2025-11-02',300,'Asfalto'),(4,'Maratona de Berlim - Alemanha',42.195,'2025-09-28',50,'Asfalto'),(5,'Maratona de Chicago - Estados Unidos',42.195,'2025-10-12',80,'Asfalto'),(6,'Maratona de Tóquio - Japão',42.195,'2026-03-02',100,'Asfalto'),(7,'Maratona de Paris - França',42.195,'2026-04-06',120,'Asfalto'),(8,'Maratona de Roma - Itália',42.195,'2026-03-16',150,'Asfalto'),(9,'Maratona de Barcelona - Espanha',42.195,'2026-03-09',130,'Asfalto'),(10,'Maratona de Valência - Espanha',42.195,'2025-12-07',90,'Asfalto'),(11,'Maratona de Amsterdã - Holanda',42.195,'2025-10-19',70,'Asfalto'),(12,'Maratona de Sevilha - Espanha',42.195,'2026-02-23',60,'Asfalto'),(13,'Maratona de Praga - República Tcheca',42.195,'2026-05-04',110,'Asfalto'),(14,'Maratona de Viena - Áustria',42.195,'2026-04-27',90,'Asfalto'),(15,'Maratona de Reiquejavique - Islândia',42.195,'2025-08-23',60,'Asfalto'),(16,'UTMB Mont Blanc - França / Itália / Suíça',171.000,'2025-08-30',10000,'Montanha'),(17,'Western States 100 - Estados Unidos',161.000,'2025-06-28',5500,'Montanha'),(18,'Hardrock 100 - Estados Unidos',160.000,'2025-07-12',10200,'Montanha'),(19,'Transvulcania - Espanha',74.000,'2026-05-10',4350,'Montanha'),(20,'Zegama-Aizkorri - Espanha',42.000,'2026-05-25',2736,'Montanha'),(21,'Mont-Blanc Marathon - França / Itália',42.000,'2025-06-30',2800,'Montanha'),(22,'Lavaredo Ultra Trail - Itália',120.000,'2025-06-27',5800,'Montanha'),(23,'Ultra Pirineu - Espanha',100.000,'2025-09-28',6600,'Montanha'),(24,'TDS - Sur les Traces des Ducs de Savoie - França / Suíça / Itália',145.000,'2025-08-28',9100,'Montanha'),(25,'Eiger Ultra Trail - Suíça',101.000,'2025-07-20',6700,'Montanha'),(26,'Madeira Island Ultra Trail - Portugal',115.000,'2026-04-27',7100,'Montanha'),(27,'Patagonia Run - Argentina',100.000,'2026-04-06',4600,'Montanha'),(28,'La Mision Brasil - Brasil',35.000,'2025-08-18',2781,'Montanha'),(29,'Ultra Trail Chapada dos Veadeiros - Brasil',50.000,'2025-06-15',1800,'Montanha'),(30,'K42 Bombinhas',42.000,'2025-11-10',2500,'Montanha');
/*!40000 ALTER TABLE `provas_json` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-18 21:54:35
