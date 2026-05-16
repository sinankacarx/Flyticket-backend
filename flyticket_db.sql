-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: flyticket_db
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES ('admin','123456');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `city_id` varchar(10) NOT NULL,
  `city_name` varchar(100) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES ('01','Adana',36.98635990,35.32528610),('02','Adıyaman',37.78936000,38.31411010),('03','Afyonkarahisar',38.68527290,30.64274110),('04','Ağrı',39.52916000,43.38356450),('05','Amasya',40.65694510,35.77271690),('06','Ankara',39.92077590,32.85404970),('07','Antalya',36.88657280,30.70302420),('08','Artvin',41.16050600,41.83986270),('09','Aydın',37.74057980,28.06764040),('10','Balıkesir',39.54007980,28.02287930),('11','Bilecik',40.15432340,30.14799070),('12','Bingöl',39.07380300,40.72961810),('13','Bitlis',38.49508670,42.16783720),('14','Bolu',40.62120990,31.64602590),('15','Burdur',37.51834070,30.16912540),('16','Bursa',40.18257340,29.06750390),('17','Çanakkale',40.05498860,26.92782920),('18','Çankırı',40.66676910,33.45260690),('19','Çorum',40.56983890,34.72692920),('20','Denizli',37.82758920,29.23895390),('21','Diyarbakır',37.91622220,40.23635420),('22','Edirne',41.67593270,26.55872250),('23','Elazığ',38.58247710,39.39617900),('24','Erzincan',39.60734290,39.20132090),('25','Erzurum',39.90632000,41.27277150),('26','Eskişehir',39.77439410,30.51911600),('27','Gaziantep',37.06283170,37.37926170),('28','Giresun',40.65316170,38.51720320),('29','Gümüşhane',40.25332190,39.38496800),('30','Hakkari',37.49535800,44.10547770),('31','Hatay',36.34513320,36.07480220),('32','Isparta',37.94654120,30.96020930),('33','Mersin',36.79783810,34.62983910),('34','İstanbul',41.00638100,28.97587150),('35','İzmir',38.41925370,27.12846900),('36','Kars',40.45584350,42.99795310),('37','Kastamonu',41.36802170,33.76191770),('38','Kayseri',38.72190110,35.48732140),('39','Kırklareli',41.70780460,27.60513340),('40','Kırşehir',39.33030660,34.12658840),('41','Kocaeli',40.82165360,29.95071840),('42','Konya',37.87273400,32.49243760),('43','Kütahya',39.25225080,29.49377320),('44','Malatya',38.48201560,38.10353550),('45','Manisa',38.85744020,28.05657110),('46','Kahramanmaraş',37.78303450,36.83065500),('47','Mardin',37.36113550,40.89594030),('48','Muğla',37.16420530,28.26242880),('49','Muş',38.97407860,41.95904330),('50','Nevşehir',38.72350720,34.71941680),('51','Niğde',38.06646910,34.70514380),('52','Ordu',40.82925690,37.40827640),('53','Rize',40.95696170,40.88442800),('54','Sakarya',40.77318340,30.48160600),('55','Samsun',41.23035570,35.96833380),('56','Siirt',37.86469160,42.05102940),('57','Sinop',41.64763770,34.95601370),('58','Sivas',39.41917170,37.10123880),('59','Tekirdağ',41.07314030,27.41020130),('60','Tokat',40.38918160,36.63150750),('61','Trabzon',41.00546050,39.73014630),('62','Tunceli',39.21975530,39.41396740),('63','Şanlıurfa',37.25951980,39.04081740),('64','Uşak',38.57689020,29.37297790),('65','Van',38.32495990,43.65898250),('66','Yozgat',39.71524220,35.17099800),('67','Zonguldak',41.25032400,31.83897380),('68','Aksaray',38.43262910,33.89769630),('69','Bayburt',40.20230270,40.21215990),('70','Karaman',37.17968480,33.33836650),('71','Kırıkkale',39.88601050,33.82789920),('72','Batman',37.78741040,41.25739240),('73','Şırnak',37.45525300,42.52120490),('74','Bartın',41.49477150,32.43542550),('75','Ardahan',41.03725010,42.74621890),('76','Iğdır',39.89452920,43.94274590),('77','Yalova',40.57954220,29.16870050),('78','Karabük',41.11103490,32.61939010),('79','Kilis',36.77972310,37.14168920),('80','Osmaniye',37.25178820,36.29935020),('81','Düzce',40.87745450,31.20096180);
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flights` (
  `flight_id` varchar(50) NOT NULL,
  `from_city_id` varchar(10) NOT NULL,
  `to_city_id` varchar(10) NOT NULL,
  `departure_time` datetime NOT NULL,
  `arrival_time` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `seats_total` int NOT NULL,
  `seats_available` int NOT NULL,
  PRIMARY KEY (`flight_id`),
  KEY `from_city_id` (`from_city_id`),
  KEY `to_city_id` (`to_city_id`),
  CONSTRAINT `flights_ibfk_1` FOREIGN KEY (`from_city_id`) REFERENCES `cities` (`city_id`),
  CONSTRAINT `flights_ibfk_2` FOREIGN KEY (`to_city_id`) REFERENCES `cities` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flights`
--

LOCK TABLES `flights` WRITE;
/*!40000 ALTER TABLE `flights` DISABLE KEYS */;
INSERT INTO `flights` VALUES ('001','07','48','2026-04-23 10:15:00','2026-04-23 11:10:00',828.27,100,94),('002','06','48','2026-04-23 10:00:00','2026-04-23 11:10:00',1254.93,100,100),('003','48','08','2026-04-25 07:00:00','2026-04-25 09:15:00',2375.61,100,99),('004','07','08','2026-04-30 11:50:00','2026-04-30 13:15:00',2107.87,100,82),('005','09','14','2026-04-25 17:00:00','2026-04-25 18:10:00',1166.88,100,100),('007','01','07','2026-05-19 13:00:00','2026-05-19 14:10:00',1116.39,100,100),('008','01','07','2026-05-19 15:00:00','2026-05-19 17:00:00',1116.39,100,100),('009','01','07','2026-05-19 20:25:00','2026-05-19 21:55:00',1116.39,100,100),('012','01','02','2026-05-30 05:15:00','2026-05-30 06:20:00',918.10,100,98),('014','01','09','2026-04-23 07:45:00','2026-04-23 09:20:00',1470.06,100,99),('015','06','10','2026-05-17 06:50:00','2026-05-17 07:00:00',1122.88,100,100);
/*!40000 ALTER TABLE `flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `passenger_name` varchar(100) NOT NULL,
  `passenger_surname` varchar(100) NOT NULL,
  `passenger_email` varchar(150) NOT NULL,
  `flight_id` varchar(50) NOT NULL,
  `seat_number` varchar(10) DEFAULT NULL,
  `class_type` varchar(20) DEFAULT 'ECONOMY',
  PRIMARY KEY (`ticket_id`),
  KEY `flight_id` (`flight_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`flight_id`) REFERENCES `flights` (`flight_id`)
) ENGINE=InnoDB AUTO_INCREMENT=992102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (103020,'şahan','gökbakar','sahan123@gmail.com','004',NULL,'PREMIUM'),(136224,'sinan','sinan','sinan789@gmail.com','004',NULL,'PREMIUM'),(165111,'ata','demirer','ata123@gmail.com','004',NULL,'ECONOMY'),(165974,'melis','kırık','melis123@gmail.com','001',NULL,'FIRST'),(244966,'aa','ss','sinan.kacar07@gmail.com','004',NULL,'BUSINESS'),(260361,'özkan','uğur','ozkan111@gmail.com','004',NULL,'FIRST'),(266639,'suzan','yılar','suzan111@gmail.com','001',NULL,'ECONOMY'),(328551,'barış','manço','baris123@gmail.com','003',NULL,'FIRST'),(385486,'tt','rr','tt@gmail.com','001',NULL,'PREMIUM'),(410192,'zz','xx','zz@gmail.com','004',NULL,'PREMIUM'),(417745,'qqq','www','qwert111@gmail.com','004',NULL,'ECONOMY'),(468567,'eee','rrr','aaa147@gmail.com','004',NULL,'BUSINESS'),(485045,'buse ','kağanarslan','buse111@gmail.com','001',NULL,'PREMIUM'),(494179,'ata','demirer','ata123@gmail.com','004',NULL,'ECONOMY'),(510483,'şahan','gökbakar','sahan123@gmail.com','004',NULL,'PREMIUM'),(520562,'aa','dd','aaa111@gmail.com','004',NULL,'ECONOMY'),(610796,'ibrahim','erkal','ibo123@gmail.com','004',NULL,'ECONOMY'),(642426,'mazhar','alanson','mazhar111@gmail.com','004',NULL,'BUSINESS'),(698445,'metin','akpınar','metin111@gmail.com','004',NULL,'ECONOMY'),(719228,'sinan','kaçar','sinan123@gmail.com','001',NULL,'BUSINESS'),(740014,'sinan ','kaçar','sinan111@gmail.com','001',NULL,'ECONOMY'),(743786,'ata','demirer','ata123@gmail.com','004',NULL,'ECONOMY'),(749395,'ali','can','ali123@gmail.com','004',NULL,'ECONOMY'),(820797,'kamil','koç','kamil123@gmail.com','004',NULL,'FIRST'),(868978,'erkin','koray','erkin111@gmail.com','001',NULL,'ECONOMY'),(969033,'ali','yılmaz','ali111@gmail.com','001',NULL,'FIRST'),(992084,'demet','akbağ','demet123@gmail.com','004',NULL,'ECONOMY'),(992085,'g','h','sinan.kacar07@gmail.com','001','A2','FIRST'),(992086,'xc','bn','sinan.kacar07@gmail.com','004','A2','BUSINESS'),(992087,'qqq','oppp','sinan.kacar07@gmail.com','004','A3','ECONOMY'),(992089,'e','r','sinan.kacar07@gmail.com','001','F4','PREMIUM'),(992090,'asdfgh','qwerty','sinan.kacar07@gmail.com','001','F5','PREMIUM'),(992091,'sinan','kcr','sinan.kacar07@gmail.com','004','A4','ECONOMY'),(992092,'sümeyye','saray','sumeyye111@gmail.com','004','C1','ECONOMY'),(992093,'koray','ürün','koray111@gmail.com','004','B2','PREMIUM'),(992094,'demet','akbağ','demet111@gmail.com','007','A3','PREMIUM'),(992097,'sinan','kaçar','sinan.kacar07@gmail.com','012','A1','ECONOMY'),(992099,'asdf','fdsa','aa11@gmail.com','012','A2','ECONOMY'),(992100,'a','b','a1@gmail.com','014','A1','PREMIUM'),(992101,'x','y','xx@gmail.com','012','A3','PREMIUM');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'koray','ürün','koray111@gmail.com','$2b$10$4Z9i3/zotEx8PhkzBdA2mugzTjSf8eLq2Qnx9l5ydV8.tsEsIkLPC','2026-04-24 12:58:40'),(2,'buse','yağmur','saganak123@gmail.com','$2b$10$/iQE6iQ62sgjUWQA9kS6P.utsOYyVGq.w0YYgn3Zo47fe7BPXIGXe','2026-05-14 20:00:00'),(3,'asdf','fdsa','aa11@gmail.com','$2b$10$5HmqJZWZvyAuSS46pAIm7uq1RtdODoFdVue0A4B5uP9LtL/34apj6','2026-05-16 22:26:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-17  2:40:47
