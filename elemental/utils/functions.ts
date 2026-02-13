
interface Payment {
    paymentDate: string | Date;
    Paid?: boolean;
    whomustpay?: string;
    downpaymentamount?: string;
}

interface Apartment {
    monthly?: Payment[];
}

interface PersonPaymentSummary {
    name: string;
    payments: Payment[];
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    totalPayments: number;
    paidPayments: number;
}

// fecha completa, por ejemplo: 15 de marzo de 2023

export const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
};

// valores con formato en $ y puntos como separadores de miles 
export const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('de-DE')}`; // Configuración para Colombia
    // O también puedes usar:
    // return `$ ${amount.toLocaleString('de-DE')}`; // Usa puntos como separadores
};

     // function to get the next payment date

 export   const getNextPaymentDate = (apartment: Apartment) => {
        if (!apartment?.monthly) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetear hora para comparar solo fechas

        // Filtrar fechas futuras y ordenarlas
        const futureDates = apartment.monthly
            .filter((payment: Payment) => {
                const paymentDate = new Date(payment.paymentDate);
                paymentDate.setHours(0, 0, 0, 0);
                return paymentDate > today; // Solo fechas futuras
            })
            .sort((a: Payment, b: Payment) => {
                // Ordenar por fecha ascendente
                const dateA = new Date(a.paymentDate);
                const dateB = new Date(b.paymentDate);
                return dateA.getTime() - dateB.getTime();
            });

        // Retornar la primera fecha (la más cercana) o null si no hay fechas futuras
        return futureDates.length > 0 ? futureDates[0] : null;
    };


        // Función para obtener próximos pagos por persona
    export const getUpcomingPaymentsByPerson = (apartment: Apartment) => {
        if (!apartment?.monthly) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return apartment.monthly
            .filter(payment => {
                const paymentDate = new Date(payment.paymentDate);
                return paymentDate > today && !payment.Paid;
            })
            .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())
            .slice(0, 3); // Solo los próximos 3 pagos
    };   


     // Función para dividir pagos por persona
    export const getPaymentsByPerson = (apartment: Apartment) => {
        if (!apartment?.monthly) return [];

        const paymentsByPerson = apartment?.monthly?.reduce((acc, payment) => {
            const person = payment.whomustpay || 'Sin asignar';
            
            if (!acc[person]) {
                acc[person] = {
                    name: person,
                    payments: [],
                    totalAmount: 0,
                    paidAmount: 0,
                    pendingAmount: 0,
                    totalPayments: 0,
                    paidPayments: 0
                };
            }
            
            const amount = parseFloat(payment.downpaymentamount || '0');
            
            acc[person].payments.push(payment);
            acc[person].totalAmount += amount;
            acc[person].totalPayments++;
            
            if (payment.Paid) {
                acc[person].paidAmount += amount;
                acc[person].paidPayments++;
            } else {
                acc[person].pendingAmount += amount;
            }
            
            return acc;
        }, {} as Record<string, PersonPaymentSummary>);

        return Object.values(paymentsByPerson);
    };
