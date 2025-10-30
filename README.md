# Gestión de eventos Backend API

## Descripción general

**Event Management Backend API** es un proyecto desarrollado con **NestJS** y **TypeORM**, diseñado para gestionar de forma centralizada los usuarios, eventos e inscripciones dentro de un sistema modular.

Su objetivo es proporcionar una **API RESTful escalable, mantenible y segura**, implementando buenas prácticas de arquitectura, manejo de datos relacionales en **MySQL** y autenticación **JWT**.

## Propósito del proyecto

El propósito del sistema es permitir la administración de eventos mediante:

- Gestión de usuarios con diferentes roles.
- Creación de eventos por parte de organizadores.
- Registro de participación por parte de los asistentes.

El sistema busca **optimizar procesos manuales**, garantizando **consistencia, trazabilidad y seguridad**.

## Problema que resuelve

En entornos donde se organizan múltiples eventos, la gestión de usuarios, inscripciones y control de acceso suele dispersarse entre planillas o sistemas poco integrados.

Este proyecto aborda ese problema mediante un backend estructurado que permite:

- Gestionar usuarios y roles desde un único punto.
- Registrar y administrar eventos de manera controlada.
- Manejar inscripciones de usuarios a eventos con relaciones directas.
- Validar datos y restringir acciones mediante autenticación JWT y roles.
- Garantizar integridad referencial en la base de datos MySQL.

## Arquitectura del sistema

El proyecto adopta una **arquitectura modular** de NestJS, separando responsabilidades por dominio funcional.

Cada módulo — `auth`, `users`, `eventsapp`, `registrations` — contiene:

- Su propio **controlador**, **servicio** y **DTOs**.
- Lógica encapsulada para facilitar el mantenimiento y la escalabilidad.

Además:

- Las **entidades TypeORM** definen las tablas y relaciones en la base de datos.
- Las **migraciones** gestionan los cambios estructurales del esquema de forma controlada y versionada.

```bash
└── src/                              # Código fuente del proyecto
    ├── common/                       # Utilidades globales y componentes transversales
    │   ├── filters/                  # Filtros globales para manejo de excepciones
    │   │   └── http-exception.filter.ts
    │   ├── interceptors/             # Interceptores (logging, sanitización, etc.)
    │   │   ├── logging.interceptor.ts
    │   │   └── sanitize-response.interceptor.ts
    │   └── pipes/                    # Pipes personalizados para validaciones y transformaciones
    │       └── parse-int.pipe.ts
    │
    ├── dto/                          # Data Transfer Objects (validaciones y estructura de datos)
    │   ├── create-event.dto.ts
    │   ├── create-registration.dto.ts
    │   ├── create-user.dto.ts
    │   ├── login-user.dto.ts
    │   ├── update-event.dto.ts
    │   ├── update-registration.dto.ts
    │   └── update-user.dto.ts
    │
    ├── entities/                     # Entidades TypeORM (mapeo de tablas MySQL)
    │   ├── user.entity.ts
    │   ├── event.entity.ts
    │   └── event-registration.entity.ts
    │
    ├── migrations/                   # Migraciones SQL generadas por TypeORM
    │   └── 1761663620551-Update.ts
    │
    ├── modules/                      # Módulos principales de la aplicación (arquitectura modular)
    │   ├── auth/                     # Autenticación (JWT, login, registro, guards)
    │   │   ├── auth.module.ts
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── jwt.strategy.ts
    │   │   ├── jwt.guard.ts
    │   │   ├── roles.decorator.ts
    │   │   └── roles.guard.ts
    │   │
    │   ├── users/                    # Gestión de usuarios
    │   │   ├── users.module.ts
    │   │   ├── users.controller.ts
    │   │   └── users.service.ts
    │   │
    │   ├── eventsapp/                # Módulo de eventos
    │   │   ├── eventsapp.module.ts
    │   │   ├── eventsapp.controller.ts
    │   │   └── eventsapp.service.ts
    │   │
    │   └── registrations/            # Módulo de inscripciones a eventos
    │       ├── registrations.module.ts
    │       ├── registrations.controller.ts
    │       └── registrations.service.ts
    │
    ├── main.ts                       # Punto de entrada del servidor NestJS
    └── app.module.ts                 # Módulo raíz de la aplicación

├── .env.template                     # Plantilla de variables de entorno
├── README.md                         # Documentación del proyecto
├── package.json                      # Dependencias y scripts de ejecución
├── tsconfig.json                     # Configuración de TypeScript
└── typeorm.config.ts                 # Configuración principal de TypeORM
```

## Cómo Ejecutar el Proyecto

Instalar dependencias

```bash
npm install
```

Configurar variables de entorno (.env)

```bash
cp .env.template .env
```

Luego editar el archivo con tus credenciales (DB_USER, DB_PASS, JWT_SECRET, etc.)

Ejecutar migraciones de la base de datos

```bash
npm run typeorm:migration:run
```

Iniciar el servidor en modo desarrollo

```bash
npm run start:dev
```

El backend estará disponible por defecto en:
http://localhost:3000

## Componentes principales

### `app.module.ts`

- Módulo raíz que conecta todos los módulos del sistema.
- Configura la conexión a la base de datos con `TypeOrmModule.forRootAsync`.
- Carga las variables de entorno mediante `ConfigModule`.
- Importa los módulos funcionales:
  - `AuthModule`
  - `UsersModule`
  - `EventsAppModule`
  - `RegistrationsModule`

### `typeorm.config.ts`

- Define la configuración central de TypeORM.
- Usa las variables del archivo `.env` para conectarse a MySQL.

### `.env.template`

- Plantilla que define las variables necesarias para la ejecución.
- Facilita el despliegue en entornos locales.

## Entidades y relaciones

| Entidad             | Descripción                                                                                                  | Relaciones                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------- |
| `User`              | Representa los usuarios del sistema. Tiene atributos como nombre, correo, contraseña y rol.                  | 1:N con `EventRegistration` |
| `Event`             | Representa un evento creado por un organizador o administrador. Contiene nombre, fecha, descripción y aforo. | 1:N con `EventRegistration` |
| `EventRegistration` | Tabla intermedia que relaciona `User` y `Event`. Guarda la fecha de inscripción y estado.                    | N:1 hacia `User` y `Event`  |

### Relaciones conceptuales

- Un **usuario** puede inscribirse en **muchos eventos**.
- Un **evento** puede tener **muchos usuarios inscritos**.
- `EventRegistration` actúa como tabla puente (**many-to-many** resuelta en dos relaciones **many-to-one**).

## Migraciones

Las migraciones reflejan los cambios en las entidades dentro de la base de datos MySQL. Se ejecutan con los comandos:

```bash
npm run typeorm migration:generate -- -n NombreMigracion
npm run typeorm migration:run
```

La migración dentro de /src/migrations contiene un método up (creación de tablas o columnas) y down (reversión).

## Autenticación y control de roles y módulos funcionales

La autenticación está implementada con JWT (JSON Web Token). Se genera un token al iniciar sesión que debe enviarse en el header `Authorization: Bearer <token>`. Los roles (`ADMIN`, `ORGANIZER`, `ATTENDEE`) determinan qué endpoints puede acceder un usuario. Los guards (`JwtAuthGuard` y `RolesGuard`) protegen rutas, y el decorador `@Roles()` define permisos a nivel de controlador o método.

El sistema se organiza en módulos funcionales:

**UsersModule**: Permite CRUD completo de usuarios. Los roles se asignan al crear un usuario. El rol `ADMIN` puede listar y eliminar usuarios. Usa `UserService` para acceder al repositorio y `UserController` para exponer endpoints.

**EventsAppModule**: CRUD de eventos. Los roles `ORGANIZER` y `ADMIN` pueden crear, editar o eliminar eventos. Todos los usuarios autenticados pueden listar eventos disponibles.

**RegistrationsModule**: Relaciona usuarios y eventos. Permite a los usuarios inscribirse, consultar y cancelar sus inscripciones. El rol `ADMIN` puede ver todas las inscripciones.

## Endpoints principales

| Método | Ruta             | Descripción                                        |
| ------ | ---------------- | -------------------------------------------------- |
| POST   | `/auth/login`    | Inicia sesión con credenciales y retorna token JWT |
| POST   | `/auth/register` | Registra un nuevo usuario                          |
| GET    | `/users`         | Lista todos los usuarios (solo admin)              |
| POST   | `/eventsapp`     | Crea un nuevo evento                               |
| GET    | `/eventsapp`     | Lista todos los eventos                            |
| POST   | `/registrations` | Crea una inscripción de usuario a evento           |
| GET    | `/registrations` | Muestra las inscripciones existentes               |

## Tecnologías utilizadas

- **NestJS** — Framework modular para Node.js que facilita la construcción de aplicaciones escalables y mantenibles.
- **TypeORM** — ORM que permite el modelado de entidades, relaciones y gestión de migraciones.
- **MySQL** — Base de datos relacional utilizada para persistencia de datos.
- **JWT (JSON Web Token)** — Sistema de autenticación segura basado en tokens.
- **Class Validator / Class Transformer** — Librerías para validación y transformación de DTOs en las capas de entrada.

## Equipo de Desarrollo

| Rol                    | Integrante           |
| ---------------------- | -------------------- |
| Líder / Desarrolladora | Zharick Fetecua      |
| Desarrolladora         | Luisa Maria Bastidas |
| Desarrolladora         | Eileen Mendoza       |
| Desarrolladora         | Elena Henao          |
