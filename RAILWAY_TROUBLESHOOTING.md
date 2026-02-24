# 🚂 Railway Deployment - Troubleshooting

## ❌ Problema: Frontend conecta a localhost en producción

### Síntoma
Al abrir tu app en producción (Railway), la consola del navegador muestra errores como:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED http://localhost:1337/api/...
```

### Causa Raíz
Las variables de entorno `NEXT_PUBLIC_*` en Next.js se **embeben en el código JavaScript durante el BUILD**, no en runtime. Si desplegaste sin configurar `NEXT_PUBLIC_API_URL` correctamente, el valor por defecto (`http://localhost:1337/api`) quedó hardcodeado en el bundle.

### ✅ Solución: Configurar variable + Redeploy

#### **Paso 1: Obtener la URL de tu backend**
1. En Railway, ve al servicio **Backend (Strapi)**
2. Click en "Settings" → busca la URL pública
3. Copia la URL (ejemplo: `https://elementalapp-backend-production.up.railway.app`)

#### **Paso 2: Configurar variable en Frontend**
1. Ve al servicio **Frontend (Next.js)** en Railway
2. Click en "Variables"
3. Agregar nueva variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://tu-backend-url.up.railway.app/api` ⚠️ **No olvides el `/api` al final**
4. Click "Add" y luego "Deploy"

#### **Paso 3: Forzar Rebuild**
Railway debería hacer un rebuild automático al agregar la variable. Si no sucede:
- Opción A: Hacer un commit dummy y push
  ```bash
  git commit --allow-empty -m "trigger rebuild"
  git push
  ```
- Opción B: En Railway, click en el último deployment → "Redeploy"

#### **Paso 4: Verificar**
1. Espera que el deploy termine (3-5 minutos)
2. Abre tu frontend en el navegador
3. Abre la consola del navegador (F12)
4. Verifica que las llamadas API vayan a `https://tu-backend-url.up.railway.app/api` y no a `localhost`

---

## 🔧 Configuración Correcta de Railway

### Backend Service
```
Root Directory: backend/
Build Command: pnpm install && pnpm build
Start Command: pnpm start
Port: 1337

Variables de entorno:
NODE_ENV=production
DATABASE_URL=${DATABASE_URL}  # Auto-generada por Railway
STRAPI_ADMIN_SECRET=<secret-seguro>
JWT_SECRET=<jwt-secret-largo>
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=<salt-seguro>
TRANSFER_TOKEN_SALT=<transfer-salt>
```

### Frontend Service
```
Root Directory: elemental/
Build Command: pnpm install && pnpm build
Start Command: pnpm start
Port: 3000

Variables de entorno:
NEXT_PUBLIC_API_URL=https://tu-backend-url.up.railway.app/api
```

---

## 🧪 Testing Local con Backend de Producción

Si quieres probar tu frontend local conectado al backend de producción:

1. Edita `elemental/.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=https://tu-backend-produccion.up.railway.app/api
   ```

2. Reinicia el servidor local:
   ```bash
   cd elemental
   pnpm dev
   ```

3. Para volver a desarrollo local, cambia de nuevo a:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:1337/api
   ```
   Y reinicia `pnpm dev`

---

## 📋 Checklist de Deployment

- [ ] Backend desplegado y funcionando
- [ ] Base de datos configurada (PostgreSQL/MySQL en Railway)
- [ ] Variables de entorno del backend configuradas
- [ ] Variable `NEXT_PUBLIC_API_URL` configurada en frontend
- [ ] Frontend rebuildeado después de agregar la variable
- [ ] CORS configurado en Strapi (`backend/config/middlewares.ts`)
- [ ] Networking: ambos servicios pueden comunicarse

---

## 🔗 Enlaces Útiles

- [Railway Docs - Environment Variables](https://docs.railway.app/develop/variables)
- [Next.js Docs - Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Strapi Deployment Guide](https://docs.strapi.io/dev-docs/deployment)

---

## 🆘 Otros Problemas Comunes

### Build falla por "out of memory"
- Aumentar el plan de Railway o
- Agregar archivo `railway.toml` con configuración de memoria

### CORS errors en producción
Verificar `backend/config/middlewares.ts`:
```typescript
'strapi::cors': {
  enabled: true,
  config: {
    origin: ['https://tu-frontend-url.up.railway.app'],
  }
}
```

### Database connection errors
- Verificar que `DATABASE_URL` esté configurada
- Revisar `backend/config/database.ts` para usar la variable correctamente
