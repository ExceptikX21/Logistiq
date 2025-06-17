-- Desactivar verificaciones de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Tabla almacenes
DROP TABLE IF EXISTS `almacenes`;
CREATE TABLE `almacenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `x` int DEFAULT '0',
  `y` int DEFAULT '0',
  `width` int DEFAULT '100',
  `height` int DEFAULT '100',
  `path` text,
  `tipo` varchar(50) DEFAULT NULL,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`,`empresa_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla empresas
DROP TABLE IF EXISTS `empresas`;
CREATE TABLE `empresas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `nit` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `database_name` varchar(100) DEFAULT NULL,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nit` (`nit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla logs_modificaciones
DROP TABLE IF EXISTS `logs_modificaciones`;
CREATE TABLE `logs_modificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(255) NOT NULL,
  `producto_id` int NOT NULL,
  `accion` varchar(255) NOT NULL,
  `fecha_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(50) DEFAULT NULL,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla messages
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla movimientos
DROP TABLE IF EXISTS `movimientos`;
CREATE TABLE `movimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `tipo` enum('entrada','salida') NOT NULL,
  `cantidad` int NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `firma_integridad` varchar(255) NOT NULL,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `supplier` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `details` varchar(250) DEFAULT NULL,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla pedidos_automaticos
DROP TABLE IF EXISTS `pedidos_automaticos`;
CREATE TABLE `pedidos_automaticos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(255) DEFAULT NULL,
  `cantidad_sugerida` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla productos
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cantidad` int NOT NULL,
  `descripcion` text,
  `codigoBarras` varchar(50) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `precio` decimal(5,2) DEFAULT NULL,
  `tipo` text,
  `empresa_id` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigoBarras` (`codigoBarras`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla products
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cantidad` int NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `descripcion` text,
  `codigoBarras` varchar(50) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigoBarras` (`codigoBarras`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla proveedores
DROP TABLE IF EXISTS `proveedores`;
CREATE TABLE `proveedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` text,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla stock_almacen
DROP TABLE IF EXISTS `stock_almacen`;
CREATE TABLE `stock_almacen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `almacen_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '0',
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `almacen_id` (`almacen_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `stock_almacen_ibfk_1` FOREIGN KEY (`almacen_id`) REFERENCES `almacenes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `stock_almacen_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rol` varchar(20) DEFAULT 'user',
  `empresa_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_usuario_empresa` (`empresa_id`),
  CONSTRAINT `fk_usuario_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla ventas
DROP TABLE IF EXISTS `ventas`;
CREATE TABLE `ventas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `productos` text NOT NULL,
  `precio_total` decimal(10,2) NOT NULL,
  `cliente` varchar(255) DEFAULT NULL,
  `metodo_pago` enum('efectivo','tarjeta','transferencia') NOT NULL,
  `firma_integridad` varchar(128) NOT NULL,
  `cantidad` int DEFAULT NULL,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Reactivar verificaciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;
