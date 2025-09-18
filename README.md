# API REST - Users con imágenes y paginación

Una API para realizar CRUD sobre usuarios con soporte de subida de imágenes.

## Estructura de User

- id (number)
- email (string)
- first_name (string)
- last_name (string)
- avatar (string: URL)

## Endpoints

- GET `/users?page=1&per_page=5`
- GET `/users/:id`
- POST `/users` (soporta `avatar` como archivo o string)
- PUT `/users/:id` (soporta actualización de imagen)
- DELETE `/users/:id`

## Ejemplo con Postman

- `POST /users`  
  Body → form-data:
  - `first_name`: "Carlos"
  - `last_name`: "Pérez"
  - `email`: "carlos@mail.com"
  - `avatar` (tipo File) → subir una imagen

## Ejecutar localmente

```bash
npm install
npm start
```

## Despliegue en Render

- Conecta el repo en GitHub
- Start command: `npm start`
- Accede a `/uploads` para ver imágenes subidas
