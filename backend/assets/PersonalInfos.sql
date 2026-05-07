-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 31, 2025 at 10:41 PM
-- Server version: 10.11.13-MariaDB-0ubuntu0.24.04.1
-- PHP Version: 8.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbfs_dashboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `PersonalInfos`
--

CREATE TABLE `PersonalInfos` (
  `id` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL,
  `applicantName` varchar(255) NOT NULL,
  `productApplied` varchar(255) NOT NULL,
  `loanAmount` bigint(20) NOT NULL,
  `applicantMetWith` varchar(255) DEFAULT NULL,
  `pdPlace` varchar(255) DEFAULT NULL,
  `addressVisited` varchar(255) DEFAULT NULL,
  `nearestLandmark` varchar(255) DEFAULT NULL,
  `buildingColor` varchar(255) DEFAULT NULL,
  `pdVisitDate` datetime DEFAULT NULL,
  `educationalBackground` varchar(255) DEFAULT NULL,
  `instituteName` varchar(255) DEFAULT NULL,
  `yearsInCity` varchar(255) DEFAULT NULL,
  `familyBackground` varchar(255) DEFAULT NULL,
  `memberInfo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`memberInfo`)),
  `userId` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `branchId` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `clientId` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `PersonalInfos`
--

INSERT INTO `PersonalInfos` (`id`, `applicantName`, `productApplied`, `loanAmount`, `applicantMetWith`, `pdPlace`, `addressVisited`, `nearestLandmark`, `buildingColor`, `pdVisitDate`, `educationalBackground`, `instituteName`, `yearsInCity`, `familyBackground`, `memberInfo`, `userId`, `branchId`, `clientId`, `createdAt`, `updatedAt`) VALUES
('0eed6643-d32c-4196-959b-71b0562dc136', 'YASH YOGESHBHAI HEDAKAR', 'PL', 0, 'RAJDEEPSINH HARPALSINH JADEJA ', 'Residence Premises', '3, BHAGIRATH PARK VIBHAG -2, PARSHVNATH TOWNSHIP ROAD, SAIJPUR BOGHA AHMEDABAD - 382345', 'PARSWNATH TOWNSHIP', 'N.A', '2025-04-11 18:30:00', 'B.H.M.S', 'NARAYNA COLLEGE ', '27', '2001-03-31T18:30:00.000Z', '[{\"memberName\":\"YOHESH G HEDKAR\",\"incomeStatus\":\"RAJU CLINIC\",\"netIncome\":40000},{\"memberName\":\"VAISHALI G HEDKAR\",\"incomeStatus\":\"HOUSE WIFE\",\"netIncome\":\"N.A\"},{\"memberName\":\"NIDDHI G HEDKAR\",\"incomeStatus\":\"HDFC BANK\",\"netIncome\":20000}]', 'f934054a-8130-4cb2-a162-fd54fbd33190', '1796d4be-bd0f-4c3b-8c4a-0fec121aa780', '95b5bf4c-8af7-4015-b4cd-773c7cce5810', '2025-05-10 06:55:29', '2025-05-10 13:07:16'),
('1ccb95ef-1b6f-4344-95fb-cf744fd3fb72', 'bhavya ', 'PL', 1010, 'AkshayBhai', 'Residence Premises', 'Endsecure', 'Raiya chowk', 'White', '2025-05-08 14:22:31', 'BTech', 'endsecure', '10', 'Clear', '[]', 'f934054a-8130-4cb2-a162-fd54fbd33190', '1796d4be-bd0f-4c3b-8c4a-0fec121aa780', NULL, '2025-05-08 14:22:47', '2025-05-09 13:15:02'),
('39d78d04-e91d-4f13-81c0-6e9517089c41', 'TIMBA HARESHBHAI VIHABHAI', 'PL', 2307, 'SANJAYSINH BUDA', 'Residence Premises', 'OPP. LIRBAI VIDHYALAY, NR. VACHCHARAJ PROVISION STORE, LIRBAIPARA ROAD, GANDHIGRAM, JUNAGADH - 362001\n', 'OPP. VACHCHARAJ PROVISION STORE', 'NA', '2025-04-04 18:30:00', '9th PASS', 'GOV. HIGHSCHOOL, BAGSARA GHED', '22', 'SELF, 1 YOUNGER BROTHER, SISTER IN LAW, MOTHER, FATHER,  TOTAL - 05', '[{\"memberName\":\"CHANABHAI (BROTHER)\",\"incomeStatus\":\"CONSTRUCTION\",\"netIncome\":\"20000\"},{\"memberName\":\"GEETABEN (SISTER IN LAW)\",\"incomeStatus\":\"HOUSEWIFE\",\"netIncome\":\"-\"},{\"memberName\":\"RAMBHIBEN (MOTHER)\",\"incomeStatus\":\"HOUSEWIFE\",\"netIncome\":\"-\"},{\"memberName\":\"VIHABHAI (FATHER)\",\"incomeStatus\":\"-\",\"netIncome\":\"-\"}]', NULL, 'f2229eec-affb-4061-912e-24f2df942555', '572aa3a1-7ab3-4505-bea7-b7e06f2da5cb', '2025-05-10 12:58:17', '2025-05-10 12:58:17'),
('3a23968a-3830-4f24-9794-b2b9257f9e41', 'VIJAYBHAI RANCHHODBHAI MAVARIYA', 'PL', 0, 'SANJAYSINH BUDA', 'Customer Business', 'TAKIYA PLOT, NR. RELIANCE TOWER, AT-KANJA TA - VANTHALI DI - JUNAGADH', 'NR. CHUVALIYA KOLI SAMAJ', 'NA', '2025-07-24 18:30:00', 'B.COM ', 'J.M. PANERA COLLEGE MANAVADAR', 'SINCE BIRTH', 'SELF, HIS WIFE, 1 SON, MOTHER, FATHER  TOTAL-05', '[{\"memberName\":\"JANAKIBEN (WIFE)\",\"incomeStatus\":\"HOUSEWIFE\",\"netIncome\":\"-\"},{\"memberName\":\"YAKSHITBHAI (SON)\",\"incomeStatus\":\"CHILDREN\",\"netIncome\":\"-\"},{\"memberName\":\"TARABEN (MOTHER)\",\"incomeStatus\":\"HOUSEWIFE\",\"netIncome\":\"-\"},{\"memberName\":\"RANCHHODBHAI (FATHER)\",\"incomeStatus\":\"FARMER\",\"netIncome\":\"300000\"}]', NULL, 'f2229eec-affb-4061-912e-24f2df942555', '8dd9c5b2-6280-413b-9c2b-363a43489dc4', '2025-07-26 05:02:15', '2025-07-26 05:02:15'),
('43e911e3-cf29-435c-844b-f89492b84927', 'VAGHELA KISHAN VITHALBHAI', 'PL', 2314, 'SANJAYSINH BUDA', 'Residence Premises', 'VANKARVAS, BHARVADPA, AT-ZALANSAR TA-JUNAGADH DI-JUNAGADH -  362011', 'NR. MASJID', 'NA', '2025-04-08 18:30:00', '7th PASS', 'GOV. PRATHMIK SCHOOL, JALANSAR', '20', 'SELF, HIS WIFE, 1 SON, 1 DAUGHTER   TOTAL-04', '[{\"memberName\":\"MANISHABEN (WIFE)\",\"incomeStatus\":\"LABOUR WORK\",\"netIncome\":5000},{\"memberName\":\"KAUSHIKBHAI (SON)\",\"incomeStatus\":\"STUDENT\",\"netIncome\":\"-\"},{\"memberName\":\"JANAVIBEN (DAUGHTER)\",\"incomeStatus\":\"STUDENT\",\"netIncome\":\"-\"}]', 'f934054a-8130-4cb2-a162-fd54fbd33190', 'f2229eec-affb-4061-912e-24f2df942555', '050e50aa-4f57-496f-b817-a2228166f066', '2025-05-10 11:56:41', '2025-07-22 13:41:43'),
('50701bfa-cddc-41b7-899c-118c765271f7', 'VIPUL KANJARIYA', 'PL', 100000, 'SHANI KUMAR', 'Residence Premises', 'DWARKADHISH TOWNSHIP', 'OPP SANDHIYA PULL', 'BLUE', '2025-05-09 18:30:00', '10TH', 'DCC SCHOOL', '5', 'STABLE', '[{\"memberName\":\"JAMANBHAI KANJARIYA\",\"incomeStatus\":\"SALARIED\",\"netIncome\":10000}]', 'f934054a-8130-4cb2-a162-fd54fbd33190', '9a546561-b6ca-427c-8cd6-915b107f4d8f', NULL, '2025-05-10 05:36:39', '2025-05-10 05:50:22'),
('6391289d-9f1e-4560-86d5-a4375a410fce', 'BHAVESH B PARMAR', 'PL', 0, 'RAJDEEPSINH HARPALSINH JADEJA ', 'Residence Premises', 'N/A', 'SARADAR NAGAR POLICE STATION\\', 'N.A', '2025-07-30 18:30:00', 'B.COM', 'B R AMBEDKAR', 'AT- 20Y   CITY - 30Y', 'SELF HIS WIFE SON', '[{\"memberName\":\"MAYUR K \",\"incomeStatus\":\"EVENT\",\"netIncome\":40000}]', 'f934054a-8130-4cb2-a162-fd54fbd33190', '1796d4be-bd0f-4c3b-8c4a-0fec121aa780', '145ae7aa-df47-4007-ad62-b425a12208c8', '2025-07-31 10:56:45', '2025-07-31 17:07:56'),
('71e1c92b-1ec5-4517-892c-f6d314053bbd', 'BHIKHALAL KANTILAL ASHODIYA', 'PL', 2322, 'SANJAYSINH BUDA', 'Residence Premises', 'GHODASARA STREET, \"CHAMUNDA KRUPA\", NR. WATER TANK, AT- IVNAGAR,  TA- JUNAGADH, DI - JUNAGADH ', 'BALKRUSHNA HAVELI STREET', 'NA', '2025-04-28 18:30:00', '9th PASS', 'DR. AMBEDKAR VIDHYALAY IVNAGAR', '20', 'SELF, HIS WIFE, 1 SON, 2 DAUGHTER, MOTHER, FATHER    TOTAL - 7', '[{\"memberName\":\"POONAMBEN (WIFE)\",\"incomeStatus\":\"HOUSEWIFE\",\"netIncome\":\"-\"},{\"memberName\":\"HIRENBHAI (SON)\",\"incomeStatus\":\"TECHNICIAN JOB\",\"netIncome\":15000},{\"memberName\":\"MEERABEN (DAUGHTER)\",\"incomeStatus\":\"TEACHER JOB\",\"netIncome\":8000},{\"memberName\":\"KAVITABEN (DAUGHTER)\",\"incomeStatus\":\"CLERK JOB\",\"netIncome\":8000},{\"memberName\":\"BHANUBEN (MOTHER)\",\"incomeStatus\":\"-\",\"netIncome\":\"-\"},{\"memberName\":\"KANTILAL (FATHER)\",\"incomeStatus\":\"-\",\"netIncome\":\"-\"}]', 'f934054a-8130-4cb2-a162-fd54fbd33190', 'f2229eec-affb-4061-912e-24f2df942555', '554d39f9-3c39-417a-a5ed-1c4b9e3b1ec4', '2025-05-10 06:51:28', '2025-05-10 08:07:47'),
('83172c90-54a3-4bef-b219-26a46c6e0e2a', 'MILANBHAI KANABHAI ZALA', 'PL', 0, 'SANJAYSINH BUDA', 'Customer Business', 'PRINT HUB BAG, CHETAN ELECTRIC STREET, INDRESHVAR MANDIR ROAD, DOLATPARA, JUNAGADH - 362001\n', 'NR. CHETAN ELECTRIC', 'NA', '2025-07-15 18:30:00', '12 PASS', 'PULKIT HIGHSCHOOL, JUNAGADH', 'SINCE BIRTH', '2001-03-31T18:30:00.000Z', '[{\"memberName\":\"DIPALIBEN (WIFE)\",\"incomeStatus\":\"HOUSEWIFE\",\"netIncome\":\"-\"},{\"memberName\":\"JAYOTSANABEN (MOTHER)\",\"incomeStatus\":\"HOUSEWIFE\",\"netIncome\":\"-\"},{\"memberName\":\"KANABHAI (FATHER)\",\"incomeStatus\":\"RIXA DRIVING\",\"netIncome\":15000}]', 'f934054a-8130-4cb2-a162-fd54fbd33190', 'f2229eec-affb-4061-912e-24f2df942555', 'de787733-b544-4a84-90c0-70f7ba90f2ee', '2025-07-18 09:38:54', '2025-07-22 07:12:51'),
('886920dc-c39f-429a-b0e1-1cf57c1ff32b', 'Niravkumar', 'Bl', 7841, 'shani kumar', 'Customer Business', 'Shree Khodiyar Motors And Service Gidc, Phase - 2, Dared, Nr. Khodiyar Maa Temple, Jamnagar - 361004', 'Nr. Khodiyar Maa Temple', 'white', '2025-04-17 18:30:00', '10', 'dcc school', '5', 'mother house wife', NULL, 'f934054a-8130-4cb2-a162-fd54fbd33190', '9a546561-b6ca-427c-8cd6-915b107f4d8f', '5093507e-bbaf-494b-a7c8-5940025d54a5', '2025-05-10 06:17:14', '2025-05-20 05:52:14'),
('96705ee9-b5df-4994-b684-8796f5be9b23', 'MAUNAKBHAI DHIRAJBHAI JIVANI', 'PL', 0, 'SANJAYSINH BUDA', 'Residence Premises', 'PLOT NO. 85/B, GOLDN CITY - 3, MOLA PATEL SCHOOL, OPP. SANKET INDIA, ZANZARADA ROAD, JUNAGADH - 362001', 'OPP. SANKET INDIA', 'NA', '2025-07-18 18:30:00', '12 PASS', 'SHRADDHA VIDHYAMANDIR, AHMEDABAD', 'SINCE BIRTH', 'SELF, 1 YOUNGER BROTHER, MOTHER, FATHER    TOTAL - 04', '[{\"memberName\":\"TANAYBHAI (BROTHER)\",\"incomeStatus\":\"IT CONSULTANT JOB\",\"netIncome\":\"200000\"},{\"memberName\":\"BHAVANABEN (MOTHER)\",\"incomeStatus\":\"HOUSEWIFE\",\"netIncome\":\"-\"},{\"memberName\":\"DHIRAJBHAI (FATHER)\",\"incomeStatus\":\"-\",\"netIncome\":\"-\"}]', NULL, 'f2229eec-affb-4061-912e-24f2df942555', 'b881799a-1754-421a-93ad-91dd7d26fbb7', '2025-07-22 08:17:16', '2025-07-22 08:17:16'),
('9e522358-d33f-4ebc-ac54-e6025b18c2c1', 'GAURANGBHAI BHIMJIBHAI PANCHAL', 'PL', 2318, 'RAJDEEPSINH HARPALSINH JADEJA ', 'Customer Business', '52 SHRIRAM ESTATE, OPP. HOLYCHILD SCHOOL, THAKKARNAGAR, AHMEDABAD - 382350', 'OPP. BRTS BUS STAND', 'N.A', '2025-04-23 18:30:00', '10TH', 'BHAGVATI HIGH SCHOOL, TB NAGAR', '10', '12', '[{\"memberName\":\"ASHABEN G PANCHAL\",\"incomeStatus\":\"HOUSE WIFE\",\"netIncome\":\"N.A\"},{\"memberName\":\"BHARGAV G PANCHAL\",\"incomeStatus\":\"10TH STUDY\",\"netIncome\":\"N.A\"},{\"memberName\":\"DHRUVI G PANCHAL\",\"incomeStatus\":\"5TH\",\"netIncome\":\"N.A\"}]', 'f934054a-8130-4cb2-a162-fd54fbd33190', '1796d4be-bd0f-4c3b-8c4a-0fec121aa780', '3cf66bd7-9975-4618-9090-4a7b077b47d1', '2025-05-10 05:00:21', '2025-07-09 13:08:28'),
('b40c0087-ab22-4260-a78c-1ba22f2e3c0c', 'HITESHBHAI KALAJIBHAI LADVA', 'PL', 0, 'SANJAYSINH BUDA', 'Residence Premises', 'PRAMUKH DARSHAN-2, PLOT NO.21, B/H. PETROLPUMP, VANTHALI ROAD, MADHURAM, JUNAGADH - 362001', 'NR. ANJALI PETROLPUMP STREET', 'NA', '2025-07-20 18:30:00', '10 PASS', 'MANAS VIDHYALAY, JUNAGADH', 'SINCE BIRTH AT-01 YEAR', 'SELF, HIS WIFE, 1 SON    TOTAL-03', '[{\"memberName\":\"ALKABEN (WIFE)\",\"incomeStatus\":\"HOUSEWIFE\",\"netIncome\":\"-\"},{\"memberName\":\"YESBHAI (SON)\",\"incomeStatus\":\"ENGINEER JOB\",\"netIncome\":18000}]', 'f934054a-8130-4cb2-a162-fd54fbd33190', 'f2229eec-affb-4061-912e-24f2df942555', '313c35dc-b2b2-4a74-aa79-bde90a74c7c1', '2025-07-22 04:46:42', '2025-07-30 18:27:31'),
('bd2fa724-2f60-4b62-b884-f7ff2862da9f', 'MOHIT DHIRUBHAI VIRADIYA ', 'PL', 0, 'RAJDEEPSINH HARPALSINH JADEJA ', 'Customer Business', '06 SURYANARAYAN SOCIETY, NR. VENUGOPAL SOCIETY, NAVA NARODA, AHMEDABAD 382350', 'VENUGOPAL SOCIETY ', 'N.A', '2025-07-22 18:30:00', 'B.COM', 'B R AMBEDKAR', 'AT- 20Y   CITY - 30Y', 'SELF HIS MOTHER, WIFE & YOUNGER BROTHER ', '[{\"memberName\":\"GEETABEN D VIRADIYA \",\"incomeStatus\":\"HOUSE WIFE\",\"netIncome\":\"---\"},{\"memberName\":\"HETAL M VIRADIYA \",\"incomeStatus\":\"HOUSE WIFE\",\"netIncome\":\"---\"},{\"memberName\":\"HARDIK D VIRADIYA \",\"incomeStatus\":\"IT COMPANY JOB\",\"netIncome\":50000}]', 'f934054a-8130-4cb2-a162-fd54fbd33190', '1796d4be-bd0f-4c3b-8c4a-0fec121aa780', 'cf0969ac-3228-4514-a68d-a38675d316c9', '2025-07-23 11:18:55', '2025-07-31 10:51:42'),
('c025cff5-88c1-43cc-8d13-a981fb05b9f9', 'Gautam Bhupatbhai Kudecha', 'PL', 6361, 'SHANI KUMAR', 'Residence Premises', '28Kh, Kolivas - 2, Lothiya , Near Mahakali Maa Temple, Jamnagar - 361012', 'Mahakali Maa Temple', 'WHITE', '2025-03-27 18:30:00', 'NA', 'NA', '26', 'NA', NULL, 'f934054a-8130-4cb2-a162-fd54fbd33190', '9a546561-b6ca-427c-8cd6-915b107f4d8f', 'c977d95e-c087-4dba-96fa-722ebdeaa7d5', '2025-05-10 08:04:18', '2025-05-10 13:04:43'),
('c6c9f667-fabf-425c-8190-575099a48a3a', 'ALPESHBHAI KALIDAS MIYAVARA', 'PL', 0, 'RAJDEEPSINH HARPALSINH JADEJA ', 'Residence Premises', 'C-17 JAY YOGIRAJ SOC, NR. SARDARNAGAR POLICE STATION, SARDARNAGAR, AHMEDABAD - 382475', 'SARADAR NAGAR POLICE STATION\\', 'N.A', '2025-03-06 18:30:00', '12TH', 'SARSWATI HIGH SCHOOL', '39', '2001-03-31T18:30:00.000Z', '[{\"memberName\":\"MAYUR K MIYAVARA\",\"incomeStatus\":\"EVENT\",\"netIncome\":20000},{\"memberName\":\"ASHABEN A MIYAVARA\",\"incomeStatus\":\"HOUSE WIFE\",\"netIncome\":\"N.A\"},{\"memberName\":\"PUSHPABEN K MIYAVARA\",\"incomeStatus\":\"HOUSE WIFE\",\"netIncome\":\"N.A\"}]', NULL, '1796d4be-bd0f-4c3b-8c4a-0fec121aa780', '6cae0c81-3a58-4384-b48b-2d0d4471a086', '2025-05-10 07:36:08', '2025-07-09 13:10:38'),
('dd9a3186-6c18-4d10-be97-2a176a805470', 'DARSHIT JAGDISHBHAI AHIR', 'PL', 0, 'RAJDEEPSINH HARPALSINH JADEJA ', 'Customer Business', 'PIZZAGRAM\n09 SHLOK INFINITY, OPP. VISHWKARMA MANDIR, CHANDLODIYA, AHMEDABAD - 382481', 'NR. CHANDLODIYA BRIDGE ', 'N.A', '2025-05-09 18:30:00', 'B.COM', 'GUJARAT COLLEGE', '30', 'SELF', '[{\"memberName\":\"KINJAL D AHIR\",\"incomeStatus\":\"POLO MEDICAL\",\"netIncome\":\"28000\"},{\"memberName\":\"REKHABEN J AHIR\",\"incomeStatus\":\"HOUSE WIFE\",\"netIncome\":\"N.A\"},{\"memberName\":\"MAYUR J AHIR\",\"incomeStatus\":\"SARA PLAST\",\"netIncome\":\"34000\"}]', NULL, '1796d4be-bd0f-4c3b-8c4a-0fec121aa780', '88949247-daac-4224-acf3-859fc894e853', '2025-05-10 09:49:27', '2025-05-10 09:49:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `PersonalInfos`
--
ALTER TABLE `PersonalInfos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `clientId` (`clientId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `PersonalInfos`
--
ALTER TABLE `PersonalInfos`
  ADD CONSTRAINT `PersonalInfos_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `PersonalInfos_ibfk_2` FOREIGN KEY (`branchId`) REFERENCES `Branches` (`id`),
  ADD CONSTRAINT `PersonalInfos_ibfk_3` FOREIGN KEY (`clientId`) REFERENCES `Clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
