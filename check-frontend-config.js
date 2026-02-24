// Script de diagnóstico para verificar la configuración del frontend
// Ejecutar con: node check-frontend-config.js

console.log('🔍 Verificando configuración del Frontend ElementalApp\n');
console.log('================================================\n');

// 1. Verificar archivo .env.local
const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(__dirname, 'elemental', '.env.local');
const envExamplePath = path.join(__dirname, 'elemental', '.env.example');

console.log('📁 Archivos de configuración:');
console.log(`   .env.local: ${fs.existsSync(envLocalPath) ? '✅ Existe' : '❌ No existe'}`);
console.log(`   .env.example: ${fs.existsSync(envExamplePath) ? '✅ Existe' : '❌ No existe'}\n`);

// 2. Leer contenido de .env.local
if (fs.existsSync(envLocalPath)) {
    console.log('📋 Contenido de .env.local:');
    const content = fs.readFileSync(envLocalPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));

    if (lines.length === 0) {
        console.log('   ⚠️  El archivo está vacío o solo tiene comentarios\n');
    } else {
        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                const isLocalhost = value.includes('localhost') || value.includes('127.0.0.1');
                const emoji = isLocalhost ? '🏠' : '🌐';
                console.log(`   ${emoji} ${key.trim()} = ${value.trim()}`);
            }
        });
        console.log('');
    }
} else {
    console.log('⚠️  No se encontró .env.local');
    console.log('   Para desarrollo local, crea este archivo copiando .env.example:\n');
    console.log('   cp elemental/.env.example elemental/.env.local\n');
}

// 3. Verificar configuración en api.ts
const apiTsPath = path.join(__dirname, 'elemental', 'lib', 'api.ts');
if (fs.existsSync(apiTsPath)) {
    console.log('📄 Archivo de configuración API:');
    const apiContent = fs.readFileSync(apiTsPath, 'utf-8');

    if (apiContent.includes('getBaseURL')) {
        console.log('   ✅ Función getBaseURL() implementada (detección automática de entorno)\n');
    } else if (apiContent.includes('NEXT_PUBLIC_API_URL')) {
        console.log('   ✅ Usa variable de entorno NEXT_PUBLIC_API_URL\n');
    } else {
        console.log('   ⚠️  No se detectó configuración de URL de API\n');
    }
}

// 4. Recomendaciones
console.log('================================================');
console.log('📝 Recomendaciones:\n');
console.log('🏠 DESARROLLO LOCAL:');
console.log('   1. Asegúrate que .env.local tenga:');
console.log('      NEXT_PUBLIC_API_URL=http://localhost:1337/api');
console.log('   2. Inicia el backend: cd backend && pnpm develop');
console.log('   3. Inicia el frontend: cd elemental && pnpm dev\n');

console.log('🚀 PRODUCCIÓN (Railway):');
console.log('   1. En Railway, servicio Frontend, añadir variable:');
console.log('      NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api');
console.log('   2. Hacer REDEPLOY completo del frontend');
console.log('   3. Verificar en consola del navegador que las peticiones');
console.log('      vayan a la URL de producción, no a localhost\n');

console.log('================================================\n');
console.log('✨ Para más ayuda, ver: RAILWAY_TROUBLESHOOTING.md\n');
