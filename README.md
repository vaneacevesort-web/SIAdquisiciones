# Demo2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.1.

## Entornos: Desarrollo, Pruebas (QA/Testing) y Producción

El proyecto tiene tres entornos completamente independientes (frontend Angular + backend Node/Express + base de datos):

| Entorno     | Frontend (puerto) | Backend (puerto) | Base de datos              |
|-------------|--------------------|-------------------|------------------------------|
| Desarrollo  | 4200               | 3000               | `adquisiciones`               |
| Pruebas     | 4201               | 3001               | `siadquisiciones_testing`     |
| Producción  | 4200 (build estático servido en su propio host) | 3001 (en el servidor de producción) | `adquisiciones` (servidor real) |

### Frontend (Angular)

Los archivos de configuración están en `src/environments/`:

- `environment.ts` — desarrollo (apuntando a `http://localhost:3000/`)
- `environment.testing.ts` — pruebas (apuntando a `http://localhost:3001/`)
- `environment.prod.ts` — producción (apuntando al dominio real, **verificar/actualizar `apiUrl` antes de desplegar**)

Angular intercambia el archivo correcto mediante `fileReplacements` en `angular.json`, según la configuración (`development` / `testing` / `production`) que se use al compilar o servir.

Scripts disponibles (`package.json` raíz):

```bash
npm run dev        # ng serve --configuration=development  -> http://localhost:4200
npm run test-env   # ng serve --configuration=testing --port=4201 -> http://localhost:4201
npm run prod       # ng build --configuration=production (genera dist/demo2 para desplegar)
```

### Backend (Node/Express)

Los archivos de variables de entorno están en `backend/`:

- `.env.development` — `PORT=3000`, BD `adquisiciones`
- `.env.testing` — `PORT=3001`, BD `siadquisiciones_testing`
- `.env.production` — `PORT=3001`, BD de producción (**completar `DB_HOST`/`DB_USERNAME`/`DB_PASSWORD` reales; no commitear este archivo con credenciales reales — ya está en `.gitignore`**)

El archivo correcto se carga automáticamente según `NODE_ENV` (ver `backend/src/config/env.ts`).

Scripts disponibles (`backend/package.json`):

```bash
npm run dev        # compila y levanta el backend de desarrollo (puerto 3000, BD adquisiciones)
npm run test-env   # compila y levanta el backend de pruebas (puerto 3001, BD siadquisiciones_testing)
npm run prod       # compila y levanta el backend de producción (PORT/BD según .env.production)
```

### Cómo trabajar día a día

Para levantar el **entorno de pruebas** completo (dos terminales):

```bash
cd backend && npm run test-env   # API en :3001 contra siadquisiciones_testing
npm run test-env                 # (en la raíz) Angular en :4201
```

Para levantar el **entorno de desarrollo**:

```bash
cd backend && npm run dev        # API en :3000 contra adquisiciones
npm run dev                      # (en la raíz) Angular en :4200
```

### Base de datos de pruebas

Antes de usar el entorno de pruebas, crear la base `siadquisiciones_testing` en el mismo servidor MySQL (`192.168.56.56`, mismas credenciales que desarrollo) y correr las migraciones contra ella:

```bash
cd backend
npx sequelize-cli db:migrate --env testing
```

### Despliegue sin afectar producción

- El entorno de Pruebas es independiente: tiene su propio puerto de frontend (4201), su propio puerto de backend (3001 dedicado a pruebas) y su propia base de datos (`siadquisiciones_testing`). Nunca apunta a la base de datos real.
- Para desplegar a producción, usar siempre `npm run prod` (frontend) y `npm run prod` dentro de `backend/` (API), que usan exclusivamente `environment.prod.ts` y `.env.production` respectivamente — nunca el `.env`/`environment.ts` de desarrollo ni los de pruebas.
- Probar primero cualquier cambio en el entorno de Pruebas (`npm run test-env` en frontend y backend) antes de desplegar a Producción.
- Completar las credenciales reales de producción en `backend/.env.production` (no se commitea) y el dominio real en `src/environments/environment.prod.ts` antes del primer despliegue.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
