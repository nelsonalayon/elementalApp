import { Payment } from "./payments";

// Interface base sin relaciones (para listados simples)
export interface ApartmentBase {
  id: number;
  documentId: string;  // Nuevo en Strapi v5
  idapto: number;
  name: string;
  apartmentvalue?: number;
  link: string;
  deliverDate?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Interface completa con relaciones (cuando haces populate)
export interface Apartment extends ApartmentBase {
  payments?: Payment[];
  monthly?: Payment[];
}

// Interface simplificada para el frontend
export interface ApartmentSimplified {
  id: number;
  idapto: number;
  name: string;
  apartmentvalue?: number;
  link: string;
  deliverDate?: Date;
  paymentsCount?: number;
  totalPayments?: number;
  lastPaymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Para requests de creación/actualización
export interface ApartmentCreate {
  idapto: number;
  name: string;
  apartmentvalue?: number;
  link: string;
  deliverDate?: string;
}

export interface ApartmentUpdate {
  idapto?: number;
  name?: string;
  apartmentvalue?: number;
  link?: string;
  deliverDate?: string;
}

// Para respuestas de API
export interface ApartmentListResponse {
  data: Apartment[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ApartmentResponse {
  data: Apartment;
  meta: {};
}