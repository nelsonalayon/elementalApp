// Script para consultar pagos directamente del backend
const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:1337/api';

// Función helper para hacer peticiones HTTP
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const request = http.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ data: jsonData });
                } catch (error) {
                    reject(new Error('Error parsing JSON: ' + error.message));
                }
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.setTimeout(5000, () => {
            reject(new Error('Request timeout'));
        });
    });
}

async function queryPaymentsData() {
    try {
        console.log('🔍 Consultando apartamentos con pagos...\n');

        // Obtener apartamentos con sus pagos poblados
        const response = await makeRequest(`${BASE_URL}/apartments?populate=monthly`);

        if (!response.data || !response.data.data) {
            console.log('❌ No se encontraron datos');
            return;
        }

        const apartments = response.data.data;
        console.log(`📊 Total apartamentos encontrados: ${apartments.length}\n`);

        // Crear lista de todos los pagos con info del apartamento
        const paymentsList = [];

        apartments.forEach(apartment => {
            console.log('\n🏠 Procesando apartamento:', apartment.id);
            console.log('Propiedades:', Object.keys(apartment));

            const aptData = {
                id: apartment.id,
                idapto: apartment.idapto,
                name: apartment.name,
                value: apartment.apartmentvalue
            };

            console.log('📋 Datos apartamento:', aptData);

            if (apartment.monthly && Array.isArray(apartment.monthly)) {
                console.log(`💰 Pagos encontrados: ${apartment.monthly.length}`);

                apartment.monthly.forEach(payment => {
                    console.log('💸 Procesando pago:', payment.id);

                    paymentsList.push({
                        paymentId: payment.id,
                        apartmentId: aptData.id,
                        apartmentNumber: aptData.idapto,
                        apartmentName: aptData.name,
                        apartmentValue: aptData.value,
                        amount: payment.downpaymentamount,
                        paid: payment.Paid,
                        paymentDate: payment.paymentDate,
                        whomustpay: payment.whomustpay || 'Sin asignar',
                        referenceapto: payment.referenceapto,
                        idpay: payment.idpay
                    });
                });
            } else {
                console.log('❌ No se encontraron pagos para este apartamento');
                console.log('Monthly field:', apartment.monthly);
            }
        });

        // Mostrar resumen
        console.log('📋 LISTA DE PAGOS CON INFORMACIÓN DEL APARTAMENTO');
        console.log('='.repeat(80));

        if (paymentsList.length === 0) {
            console.log('❌ No se encontraron pagos');
            return;
        }

        // Ordenar por apartamento y fecha
        paymentsList.sort((a, b) => {
            if (a.apartmentNumber !== b.apartmentNumber) {
                return a.apartmentNumber - b.apartmentNumber;
            }
            return new Date(a.paymentDate) - new Date(b.paymentDate);
        });

        paymentsList.forEach((payment, index) => {
            const status = payment.paid ? '✅ PAGADO' : '❌ PENDIENTE';
            const amount = payment.amount ? `$${parseInt(payment.amount).toLocaleString()}` : 'Sin monto';
            const date = new Date(payment.paymentDate).toLocaleDateString('es-ES');

            console.log(`${index + 1}. ${status}`);
            console.log(`   🏠 Apartamento: ${payment.apartmentName} (ID: ${payment.apartmentNumber})`);
            console.log(`   💰 Monto: ${amount}`);
            console.log(`   📅 Fecha: ${date}`);
            console.log(`   👤 Debe pagar: ${payment.whomustpay}`);
            console.log(`   🔗 Referencia: ${payment.referenceapto || 'Sin referencia'}`);
            console.log(`   🆔 ID Pago: ${payment.idpay || payment.paymentId}`);
            console.log('');
        });

        // Estadísticas
        const totalPagos = paymentsList.length;
        const pagados = paymentsList.filter(p => p.paid).length;
        const pendientes = totalPagos - pagados;
        const totalMontoPagado = paymentsList
            .filter(p => p.paid)
            .reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
        const totalMontoPendiente = paymentsList
            .filter(p => !p.paid)
            .reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);

        console.log('📈 ESTADÍSTICAS GENERALES');
        console.log('='.repeat(40));
        console.log(`📊 Total pagos: ${totalPagos}`);
        console.log(`✅ Pagados: ${pagados}`);
        console.log(`❌ Pendientes: ${pendientes}`);
        console.log(`💰 Monto pagado: $${totalMontoPagado.toLocaleString()}`);
        console.log(`⏳ Monto pendiente: $${totalMontoPendiente.toLocaleString()}`);

    } catch (error) {
        console.error('❌ Error consultando datos:', error.message);

        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            console.error('🔴 No se puede conectar al backend. ¿Está Strapi funcionando en http://localhost:1337?');
        }
    }
}

// Ejecutar
queryPaymentsData();