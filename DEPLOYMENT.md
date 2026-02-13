# Railway deployment configuration for ElementalApp Monorepo

## Services Configuration

### Backend (Strapi)
- **Root Directory**: `backend/`
- **Build Command**: `pnpm install && pnpm build`  
- **Start Command**: `pnpm start`
- **Port**: `1337` (auto-detected)

### Frontend (Next.js)  
- **Root Directory**: `elemental/`
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`  
- **Port**: `3000` (auto-detected)

## Environment Variables Needed

### Backend (.env):
```
NODE_ENV=production
DATABASE_URL=${DATABASE_URL}  # Railway provides this automatically
STRAPI_ADMIN_SECRET=your-admin-secret-here
JWT_SECRET=your-jwt-secret-here  
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
TRANSFER_TOKEN_SALT=your-transfer-salt
```

### Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## Deployment Steps

1. Connect GitHub repo to Railway
2. Create two services from same repo
3. Configure root directories for each service  
4. Set environment variables
5. Deploy both services
6. Update frontend API URL to point to backend

## Database

Railway provides PostgreSQL automatically. Update `backend/config/database.ts` to use `DATABASE_URL` environment variable.