# Plan de Autenticación - ElementalApp

## Estado Actual del Backend

✅ **Backend Strapi ya configurado**
- Plugin users-permissions instalado
- JWT configurado
- APIs de auth automáticas disponibles
- Base de datos con usuarios lista
- Relación usuarios-pagos existente

## Problemas a Resolver

### 1. 🔐 GESTIÓN DE ESTADO DE AUTENTICACIÓN
**Problema**: ¿Cómo saber en toda la app si el usuario está logueado?
- ¿Dónde guardo la información del usuario?
- ¿Cómo comparto ese estado entre componentes?
- ¿Cómo persiste la sesión al recargar la página?

### 2. 🎫 MANEJO DE TOKENS JWT
**Problema**: ¿Cómo manejar los tokens de forma segura?
- ¿Dónde guardar el token? (localStorage, cookies, memoria)
- ¿Cómo enviarlo en cada petición a la API?
- ¿Qué hacer cuando expire?
- ¿Cómo validar si un token es válido?

### 3. 🔒 PROTECCIÓN DE RUTAS
**Problema**: ¿Cómo evitar que usuarios no autenticados accedan a páginas privadas?
- ¿Cómo redireccionar automáticamente al login?
- ¿En qué momento verificar la autenticación?
- ¿Cómo manejar rutas que solo algunos usuarios pueden ver?

### 4. 🌐 INTEGRACIÓN CON API
**Problema**: ¿Cómo conectar el frontend con los endpoints de Strapi?
- ¿Cómo enviar credenciales al backend?
- ¿Cómo manejar respuestas de error (usuario inválido, email ya existe)?
- ¿Cómo interceptar todas las peticiones HTTP para añadir el token?

### 5. 🔄 REFRESCADO DE DATOS
**Problema**: ¿Cómo actualizar datos cuando el usuario se loguea/logout?
- ¿Cómo filtrar apartamentos por usuario autenticado?
- ¿Cómo limpiar cache cuando alguien hace logout?
- ¿Cómo sincronizar estado entre tabs del navegador?

### 6. 🎨 EXPERIENCIA DE USUARIO
**Problema**: ¿Cómo hacer una UX fluida?
- ¿Cómo mostrar estados de loading durante login?
- ¿Dónde mostrar mensajes de error?
- ¿Cómo validar formularios en tiempo real?
- ¿Cómo recordar al usuario dónde quería ir después del login?

### 7. 🔧 PERSISTENCIA DE SESIÓN
**Problema**: ¿Cómo mantener al usuario logueado entre sesiones?
- ¿Qué pasa si cierra el navegador?
- ¿Cómo manejar múltiples dispositivos?
- ¿Cuándo "olvidar" al usuario automáticamente?

### 8. 🛡️ SEGURIDAD
**Problema**: ¿Cómo evitar vulnerabilidades?
- ¿Cómo proteger contra ataques CSRF?
- ¿Qué hacer si roban el token?
- ¿Cómo validar datos del lado cliente Y servidor?

### 9. 🔄 ESTADOS DE ERROR
**Problema**: ¿Qué hacer cuando algo sale mal?
- Token expirado mientras usa la app
- Internet se va durante login
- Server responde con error 500
- Usuario intenta acceder a recurso sin permisos

### 10. 📱 NAVEGACIÓN CONDICIONAL
**Problema**: ¿Cómo cambiar la UI según el estado de auth?
- ¿Cuándo mostrar "Login" vs "Logout" en el navbar?
- ¿Cómo mostrar nombre del usuario logueado?
- ¿Cómo ocultar/mostrar funciones según rol?

## Plan de Implementación

### PASO 1: Instalar dependencias
```bash
pnpm add js-cookie jwt-decode axios
pnpm add -D @types/js-cookie
```

### PASO 2: Crear utilidades de auth
- Context de usuario
- Funciones de login/logout
- Interceptor de API con tokens

### PASO 3: Crear páginas de auth
- `/login` - Página de inicio de sesión
- `/register` - Página de registro  
- Formularios con validación

### PASO 4: Middleware de protección
- Proteger rutas privadas
- Redireccionar usuarios no autenticados

### PASO 5: Integrar con dashboard
- Mostrar datos del usuario autenticado
- Filtrar apartamentos por usuario
- Botón de logout

### PASO 6: Mejorar UX
- Estados de loading
- Manejo de errores
- Persistencia de sesión

## Orden de Complejidad

1. **Fácil**: Crear formularios de login/register
2. **Medio**: Conectar con API y manejar respuestas
3. **Medio**: Guardar y gestionar tokens
4. **Difícil**: Estado global de autenticación
5. **Difícil**: Protección de rutas y middleware
6. **Muy Difícil**: Manejo de errores y edge cases

## Conceptos Clave a Entender

- **JWT**: Qué es, cómo funciona, partes (header, payload, signature)
- **React Context**: Para estado global
- **Next.js Middleware**: Para interceptar rutas
- **HTTP Interceptors**: Para añadir tokens automáticamente
- **Local Storage vs Cookies**: Pros/contras de cada uno

## APIs Disponibles en Backend

```
POST /api/auth/local/register     # Registro
POST /api/auth/local              # Login
POST /api/auth/forgot-password    # Recuperar contraseña
POST /api/auth/reset-password     # Reset contraseña
POST /api/auth/change-password    # Cambiar contraseña
GET  /api/users/me               # Obtener perfil usuario actual
```

## Enfoque Recomendado

**Opción A: Implementación Simple (Recomendado)**
- JWT manual con localStorage
- Más control, menos dependencias
- Rápida de implementar

**Opción B: NextAuth.js**
- Más robusto y seguro
- Manejo automático de sesiones
- Más configuración inicial
