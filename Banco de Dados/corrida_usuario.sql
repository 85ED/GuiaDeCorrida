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
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idusuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` varchar(15) DEFAULT NULL,
  `senha` varchar(64) NOT NULL COMMENT 'SHA-256 hashed',
  `nivel` varchar(20) DEFAULT 'iniciante',
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  `token_recuperacao` varchar(100) DEFAULT NULL,
  `token_expira_em` datetime DEFAULT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `chk_usuario_nivel` CHECK ((`nivel` in (_utf8mb4'iniciante',_utf8mb4'intermediario',_utf8mb4'avancado')))
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Edson','teste@teste.com.br','11987877676','$2b$12$YM2.g/e.tacY191dmjO5XeykgaWVJ/yvnZFT1NvbC1zVvTvnRWl7C','iniciante','2025-05-31 23:08:44',NULL,NULL),(2,'Kiptun Kenia','run@teste.com.br','11978786767','$2b$12$6Zwg9bk.a/lXvAW0QXxed.vsfiwkKsLOKQCFzmz2OMXMRzuBOl1Me','iniciante','2025-06-02 13:29:01',NULL,NULL),(3,'Suriname Valter','s.teste@hotmail.com','11977886677','$2b$12$H/lRI9LE9vGj/L9vUUXOn.46ui5jx2K1yVFL92rJHIZyQxfNrj0E.','iniciante','2025-06-15 14:35:26',NULL,NULL),(4,'Elena','elena@teste.com.br','1196666554433','$2b$12$zQVnzjNgs0QZVxXE1O6ag.3yLussr1gM8lr8YTVYuKrosVhABZxuy','iniciante','2025-06-15 14:41:57',NULL,NULL),(5,'Edson Linkedin','teste@linkedin.com.br','11977668855','$2b$12$N3kYNDPfbSi.lHyBFHbBA.JOy1255UqGKbpGyFO4kd1HsbWbc6Xn2','iniciante','2025-06-15 15:36:06',NULL,NULL),(6,'Maria','teste@gmail.com','119787867675','$2b$12$cHxprxFy1QlNDPHwSuDCveMSf8w/XUulH5ErDD07AMHiExCfiuKFe','iniciante','2025-06-15 15:40:20',NULL,NULL),(7,'Decio Gomes','teste@icloud.com','119787867675','$2b$12$k8itoWmOolh8F4FD9N4Bsu1s.f.kGtI0UL5w1padpK3plnFbPLw6u','iniciante','2025-06-15 15:40:43',NULL,NULL),(8,'Luciana Corredora','run@run.com.br','11975543214','$2b$12$SM.7jDcK0DbqFbIpxnveouoHB9R4r9k2a7UMZDHRI7YnrIaeLtQn6','iniciante','2025-06-15 15:41:18',NULL,NULL),(9,'Estevao Lisboa','lisboa@run.com.br','11975543220','$2b$12$OXmo9n2Kh./lxzJz9NLrGuWBic95joUo050GMBolnEua92qaYe6MW','iniciante','2025-06-15 15:41:49',NULL,NULL),(10,'Hugo Viagem','hugo@teste.com.br','11975546699','$2b$12$viVAwmYVXETVO6JE0SqFeOQ4wxCNyDwRhnOs/WQennR9s3O3YNHiq','iniciante','2025-06-15 15:42:14',NULL,NULL),(15,'Dev Correria','testando@teste.com.br','11977885645','$2b$12$RPoMKBwOGOnb/F3aq8gMe.WLQpT6AUX/klJahL5vHBNd1Aeuhu.8C','iniciante','2025-06-15 15:46:44',NULL,NULL),(16,'Edson Linkedin','guia@teste.com.br','11978675645','$2b$12$mFef9MgEp/vrT4P9DYZdI.9Ubq2hMPS72ZVLxU6cer1clAKIKj1tK','iniciante','2025-06-15 15:55:49',NULL,NULL),(17,'Gilmar Guitar','teste@guitar.com.br','11966778899','$2b$12$6jp4ZB9kanZiWxdkhMk.uOQg65777GWo.dMOCcTJ9anVtj5MsCqrS','iniciante','2025-06-15 18:52:26',NULL,NULL),(18,'Edson Felix','teste@g1.br','11978786767','$2b$12$DpzP1Xv5IuTNYRdqZtZ60uWzgLKMRbEb3ead83k275C8I6WwRF1UK','iniciante','2025-06-15 18:58:11',NULL,NULL),(19,'Sara de Cima','sara@gmail.com','11978675645','$2b$12$DzTwitzze42jIqQuv38zk.4dQlNpDbrm3zlt1zEyR2wzse2aet3fe','iniciante','2025-06-15 19:05:34',NULL,NULL),(20,'Alvaro Teste','alvaro@teste.com.br','11978675665','$2b$12$QTCZcCUHUk5mYiCtpME8v.lAkAnFcmZiZG.UQ0hZbItgU7KfCLYSy','iniciante','2025-06-15 19:10:19',NULL,NULL),(21,'Vamos Testar','edsonfelixnet@gmail.com','11978675566','$2b$12$ofvCSoQuKtSe8Fo42kkhZ.iylwMPwP09dyFJFjN59txtprpJvdHKi','iniciante','2025-06-15 19:53:44',NULL,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
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
