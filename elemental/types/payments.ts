// Strapi Content Type Interface
export interface Payment {
  id: number;
  downpaymentamount: string; // biginteger en Strapi se maneja como string
  paymentDate: string; // Date en formato ISO string
  idpay: string; // UID único
  whomustpay?: string; // Opcional
  referenceapto: string; // Referencia del apartamento
  apartment: {
    data: {
      id: number;
      attributes: Record<string, unknown>; // Relación con apartment
    };
  };
  whopaid: {
    data: {
      id: number;
      attributes: Record<string, unknown>; // Relación con user
    };
  };
  Paid: boolean;
  publishedAt?: string; // Strapi draft and publish
  createdAt: string;
  updatedAt: string;
}

// Versión simplificada para uso en el frontend
export interface PaymentSimplified {
  id: number;
  downpaymentamount: number;
  paymentDate: Date;
  idpay: string;
  whomustpay?: string;
  referenceapto: string;
  apartmentId: number;
  whopaidId: number;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentCreate {
  downpaymentamount: string;
  paymentDate: string;
  whomustpay?: string;
  referenceapto: string;
  apartment: number; // ID del apartamento
  whopaid: number; // ID del usuario
  Paid: boolean;
}

export interface PaymentUpdate {
  downpaymentamount?: string;
  paymentDate?: string;
  whomustpay?: string;
  referenceapto?: string;
  apartment?: number;
  whopaid?: number;
  Paid?: boolean;
}

export interface PaymentFilters {
  paid?: boolean;
  apartmentId?: number;
  whopaidId?: number;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: string;
  amountMax?: string;
  referenceapto?: string;
}

// API Response Types - Strapi format
export interface PaymentListResponse {
  data: Payment[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface PaymentResponse {
  data: Payment;
  meta: {};
}

// Helper functions para transformar entre formatos
export const transformPaymentFromStrapi = (payment: Payment): PaymentSimplified => ({
  id: payment.id,
  downpaymentamount: parseInt(payment.downpaymentamount),
  paymentDate: new Date(payment.paymentDate),
  idpay: payment.idpay,
  whomustpay: payment.whomustpay,
  referenceapto: payment.referenceapto,
  apartmentId: payment.apartment.data.id,
  whopaidId: payment.whopaid.data.id,
  paid: payment.Paid,
  createdAt: new Date(payment.createdAt),
  updatedAt: new Date(payment.updatedAt),
});

export const transformPaymentToStrapi = (payment: Partial<PaymentSimplified>): PaymentCreate | PaymentUpdate => ({
  downpaymentamount: payment.downpaymentamount?.toString(),
  paymentDate: payment.paymentDate?.toISOString(),
  whomustpay: payment.whomustpay,
  referenceapto: payment.referenceapto,
  apartment: payment.apartmentId,
  whopaid: payment.whopaidId,
  Paid: payment.paid,
});
