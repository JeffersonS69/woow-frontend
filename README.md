
# Woow Frontend

Aplicación frontend desarrollada en React + TypeScript. Permite la gestión de usuarios, autenticación, y navegación entre diferentes roles (admin y usuario). Utiliza TailwindCSS para estilos y consume una API REST construida en Node.js con PostgreSQL.

## Prerrequisitos

- **Node.js** >= 18.x
- **npm** >= 9.x (o yarn)
- **React 19**
- **TypeScript**
- **React Router** (navegación)
- **Axios** (llamadas HTTP)
- **CSS (TailwindCSS)**

## Instalación

1. Clona el repositorio:
	 ```bash
	 git clone https://github.com/JeffersonS69/woow-frontend.git
	 cd woow-frontend
	 ```
2. Instala las dependencias:
	 ```bash
	 npm install
	 # o
	 yarn install
	 ```
3. Configura las variables de entorno:
	 - Crea un archivo `.env` en la raíz si es necesario.
	 - Ejemplo:
		 ```env
		 REACT_APP_API_URL_BACKEND=http://localhost:3001
		 ```

## Ejecución del proyecto

### Frontend
```bash
npm start
# o

```
La app estará disponible en [http://localhost:3000](http://localhost:3000)

## Endpoints disponibles (ejemplos)

El frontend consume los siguientes endpoints del backend:

- **Autenticación:**
	- `POST /api/auth/login`
		```json
		{
			"email": "admin@woow.com",
			"password": "admin123"
		}
		```
	- `POST /api/auth/register`
		```json
		{
			"email": "user@woow.com",
			"password": "user123",
			"name": "Usuario"
		}
		```
- **Usuarios:**
	- `GET /api/users` (Para administradores)
	- `GET /api/users/:id`

## Credenciales de prueba

- **Admin:**
	- Email: `admin@woow.com`
	- Contraseña: `admin123`
- **Usuario normal:**
	- Email: `user@woow.com`
	- Contraseña: `user123`

---
