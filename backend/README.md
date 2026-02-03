# ePayco Wallet API 🚀

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

API REST para sistema de billetera digital con funcionalidades de registro de clientes, recarga de saldo y pagos con autenticación 2FA mediante tokens OTP.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Endpoints](#-endpoints)
- [Testing](#-testing)
- [Documentación](#-documentación)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 📖 Descripción

ePayco Wallet es una API REST desarrollada con NestJS que implementa un sistema de billetera digital con las siguientes funcionalidades principales:

### Funcionalidades

1. **Registro de Clientes**
   - Validación de documento y email únicos
   - Almacenamiento seguro de información personal
   - Balance inicial en $0

2. **Recarga de Saldo**
   - Validación de identidad (documento + teléfono)
   - Actualización atómica del saldo
   - Historial de transacciones

3. **Flujo de Pago con 2FA**
   - **Fase 1 - Solicitud:** Genera token OTP de 6 dígitos enviado por email
   - **Fase 2 - Confirmación:** Valida token y ejecuta descuento atómico
   - Expiración de tokens (15 minutos)
   - Idempotencia en confirmaciones

---

## 🏗️ Arquitectura

### Patrón de Capas

```
┌─────────────────────────────────────┐
│         Controller Layer            │  ← Endpoints REST
├─────────────────────────────────────┤
│          Service Layer              │  ← Lógica de negocio
├─────────────────────────────────────┤
│           DAO Layer                 │  ← Acceso a datos
├─────────────────────────────────────┤
│         Repository Layer            │  ← TypeORM
└─────────────────────────────────────┘
```

### Módulos

- **ClientModule:** Gestión de clientes
- **WalletModule:** Operaciones de billetera
- **PaymentModule:** Flujo de pagos con OTP
- **DatabaseModule:** Configuración de TypeORM
- **CommonModule:** Interceptors, Filters, Utils

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | 10.x | Framework backend |
| **TypeScript** | 5.x | Lenguaje de programación |
| **TypeORM** | 0.3.x | ORM para base de datos |
| **MySQL** | 8.0 | Base de datos relacional |
| **Nodemailer** | 6.x | Envío de emails OTP |
| **class-validator** | 0.14.x | Validación de DTOs |
| **Swagger** | 7.x | Documentación de API |

---

## 📦 Prerrequisitos

- **Node.js:** >= 20.x
- **npm:** >= 10.x
- **Node.js:** >= 20.x
- **npm:** >= 10.x
- **MySQL:** >= 8.0

---

## 🚀 Instalación

### Guía de Instalación Local
 
> **Requisito:** Debes tener **MySQL** instalado y ejecutándose en tu máquina.

1. **Preparar Base de Datos:**
   - Crear una base de datos llamada `epayco_wallet`.
   - Asegurarse de tener un usuario con permisos (ej: `user` / `password`).

2. **Configura Variables de Entorno**
	
```bash
# Copiar el archivo de ejemplo
cd backend
cp .env.example .env
```

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=epayco_wallet

# Application
PORT=3000
NODE_ENV=development

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
SMTP_FROM="ePayco Wallet <noreply@epayco.com>"
```

3. **Configurar SMTP para emails OTP**

Edita el archivo `backend/.env` y configura tu email:

```bash
# Si usas Gmail:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
SMTP_FROM="ePayco Wallet <noreply@epayco.com>"
```

**⚠️ IMPORTANTE para Gmail:**
- NO uses tu contraseña normal
- Debes crear una "Contraseña de Aplicación":
  1. Ve a https://myaccount.google.com/security
  2. Activa "Verificación en 2 pasos" si no está activa
  3. Ve a "Contraseñas de aplicaciones": https://myaccount.google.com/apppasswords
  4. Genera una nueva contraseña para "Correo"
  5. Usa esa contraseña de 16 caracteres en `SMTP_PASS`

4. **Instalar y Ejecutar:**
   ```bash
   cd backend
   
   # Instalar dependencias
   npm install

   # Ejecutar en desarrollo
   npm run start:dev
   ```


La API estará disponible en: **http://localhost:3000**

---

## 📡 Endpoints

### Client

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/clients` | Registrar nuevo cliente |
| `GET` | `/clients` | Listar todos los clientes |
| `GET` | `/clients/:document` | Buscar cliente por documento |

### Wallet

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/wallet/recharge` | Recargar saldo |
| `GET` | `/wallet/balance` | Consultar saldo |

### Payment

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/payment/request` | Solicitar pago (genera OTP) |
| `POST` | `/payment/confirm` | Confirmar pago (valida OTP) |

### Ejemplos de Uso

#### Registrar Cliente

```bash
curl -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -d '{
    "document": "1234567890",
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phone": "3001234567"
  }'
```

#### Solicitar Pago

```bash
curl -X POST http://localhost:3000/payment/request \
  -H "Content-Type: application/json" \
  -d '{
    "document": "1234567890",
    "phone": "3001234567",
    "amount": 10000
  }'
```

#### Confirmar Pago

```bash
curl -X POST http://localhost:3000/payment/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "uuid-de-sesion",
    "token": "123456"
  }'
```

---

## 🧪 Testing

### Scripts de Prueba

Ejecutar scripts de prueba automatizados:

```powershell
# Prueba completa de payment request
.\context\correcciones\test-payment-complete.ps1

# Prueba de payment confirm
.\context\correcciones\test-payment-confirm.ps1
```

### Pruebas Manuales con Postman

1. Importar colección: `backend/postman_collection.json`
2. Importar entorno: `backend/postman_environment.json`
3. Ejecutar requests en orden:
   - Registrar Cliente
   - Recargar Saldo
   - Solicitar Pago (guarda sessionId automáticamente)
   - Revisar email para obtener OTP
   - Ingresar OTP en variable `otpToken`
   - Confirmar Pago

---

## 📚 Documentación

### Swagger UI

Acceder a la documentación interactiva en:

**http://localhost:3000/api/docs**

Características:
- Exploración de todos los endpoints
- Ejemplos de request/response
- Pruebas en vivo
- Esquemas de DTOs

### Archivos de Documentación

- **Swagger JSON:** `backend/swagger.json`
- **Colección Postman:** `backend/postman_collection.json`
- **Entorno Postman:** `backend/postman_environment.json`

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── app/                    # Módulo principal
│   ├── config/                 # Configuraciones
│   │   ├── constants/          # Constantes globales
│   │   ├── database/           # Configuración TypeORM
│   │   └── email.config.ts     # Configuración Nodemailer
│   ├── entities/               # Entidades TypeORM
│   │   ├── client.entity.ts
│   │   ├── transaction-session.entity.ts
│   │   └── enums/
│   ├── modules/
│   │   ├── client/             # Módulo de clientes
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dao/
│   │   │   ├── dto/
│   │   │   └── providers/
│   │   ├── wallet/             # Módulo de billetera
│   │   └── payment/            # Módulo de pagos
│   ├── common/                 # Utilidades compartidas
│   │   ├── interceptors/       # Response interceptor
│   │   ├── filters/            # Exception filters
│   │   └── utils/              # Funciones auxiliares
│   └── main.ts                 # Punto de entrada
├── swagger.json                # Especificación OpenAPI
├── postman_collection.json     # Colección Postman
├── postman_environment.json    # Variables de entorno
├── .env                        # Variables de entorno
├── .dockerignore               # Archivos excluidos de Docker
├── Dockerfile                  # Imagen Docker
└── package.json                # Dependencias
```

---

## 🔒 Seguridad

### Implementaciones de Seguridad

- ✅ **Tokens OTP hasheados** con SHA-256
- ✅ **Validación estricta** de DTOs con `class-validator`
- ✅ **Transacciones atómicas** para operaciones financieras
- ✅ **Expiración de tokens** (15 minutos)
- ✅ **Idempotencia** en confirmaciones de pago
- ✅ **Validación de identidad** (documento + teléfono)

---

## 📝 Estándares de Código

- **Lenguaje:** Inglés para código, español para mensajes de usuario
- **Estilo:** ESLint + Prettier
- **Commits:** Conventional Commits
- **Arquitectura:** Clean Architecture + DDD
- **Principios:** SOLID, DRY, KISS

---

## 🤝 Contribución

Este proyecto es una prueba técnica para ePayco. No se aceptan contribuciones externas.

---

## 📄 Licencia

MIT License - Ver archivo `LICENSE` para más detalles.

---

## 👤 Autor

**Yensel León**
- Email: yensel41@gmail.com
- GitHub: [@yenselleon](https://github.com/yenselleon)

---

## 🙏 Agradecimientos

- ePayco por la oportunidad de realizar esta prueba técnica
- Comunidad de NestJS por la excelente documentación

---

**Desarrollado con ❤️ para ePayco**
