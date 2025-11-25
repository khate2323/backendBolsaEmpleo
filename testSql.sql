
INSERT INTO tbl_companies
(name, direction, departament, municipality,
    nit, "legalRepresentativeName", "companyType", phone, email,
    "webSite", "numberEmployes", description, slogan,
    "ChamberofCommerce", rut, "certificateofExistence", "legalRepresentativeDocument",
    "bankCertification", "userId"
)
VALUES
-- 1
('Tecnologías Andinas SAS','Cra 45 # 23-10','Cundinamarca','Bogotá',
 '901123456','Carlos Andrés Peña','Privada','3104567890','contacto@tecnologiasandinas.com',
 'https://tecnologiasandinas.com','45','Empresa dedicada al desarrollo de software empresarial.',
 'Innovación sin límites',NULL,NULL,NULL,NULL,NULL,1),

-- 2
('Soluciones Agropecuarias del Norte','Km 3 vía al mar','Santander','Bucaramanga',
 '900567321','María Fernanda Ríos','Privada','3189876543','info@agronorte.com',
 NULL,'32','Proveedor líder en productos agrícolas.',
 NULL,NULL,NULL,NULL,NULL,NULL,2),

-- 3
('Logística del Caribe SAS','Av Pedro de Heredia #12-34','Bolívar','Cartagena',
 '901223344','José Ramírez','Privada','3203322110','admin@logisticaribe.co',
 'https://logisticaribe.co','120','Servicios logísticos y de transporte.',
 NULL,NULL,NULL,NULL,NULL,NULL,3),

-- 4
('Construcciones El Pinar SAS','Calle 12 # 9-02','Antioquia','Medellín',
 '900998877','Sandra Lucía Ortiz','Privada','3018823456','gerencia@elpinar.com',
 NULL,'87','Empresa de construcción de vivienda y obras civiles.',
 NULL,NULL,NULL,NULL,NULL,NULL,4),

-- 5
('Centro Automotriz Bogotá','Av Boyacá # 45-20','Cundinamarca','Bogotá',
 '901555888','Juan Sebastián Torres','Privada','3205566771','contacto@cabogota.com',
 NULL,'26','Taller especializado en mecánica automotriz.',
 NULL,NULL,NULL,NULL,NULL,NULL,5),

-- 6
('Café Montaña Viva','Km 5 Vía Manizales','Caldas','Manizales',
 '900444222','Diana Paola Rincón','Cooperativa','3177744110','ventas@montanaviva.com',
 NULL,'15','Productora y comercializadora de café especial.',
 NULL,NULL,NULL,NULL,NULL,NULL,6),

-- 7
('Clínica Vida Salud IPS','Calle 80 # 70-12','Cundinamarca','Bogotá',
 '901777333','Ricardo Andrés Pérez','Privada','3152213445','administracion@vidasalud.co',
 NULL,'210','Clínica privada de servicios médicos.',
 NULL,NULL,NULL,NULL,NULL,NULL,7),

-- 8
('Inversiones Rivera SAS','Calle 30 # 22-15','Valle del Cauca','Cali',
 '900333555','Alejandro Rivera','Privada','3025544332','contacto@riverainv.com',
 NULL,'60','Empresa de inversión y consultoría financiera.',
 NULL,NULL,NULL,NULL,NULL,NULL,8),

-- 9
('Servicios Globales Houston LLC','11250 Westheimer Rd','Texas','Houston',
 '845567891','Michael Thompson','Consultora','+1 713 555 1122','office@globalhouston.us',
 'https://globalhouston.us','35','Consultora internacional en procesos industriales.',
 NULL,NULL,NULL,NULL,NULL,NULL,9),

-- 10
('Agencia de Marketing Digital Fénix','Cra 14 # 77-20','Cundinamarca','Bogotá',
 '901112233','Valentina Rueda','Privada','3146678990','info@fenixmarketing.co',
 'https://fenixmarketing.co','22','Agencia de publicidad y marketing digital.',
 NULL,NULL,NULL,NULL,NULL,NULL,10);
