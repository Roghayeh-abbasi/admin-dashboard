export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  CANCELED = 'canceled'
}

export interface Order {
  id: number;
  userId: number;
  userName?: string; 
  products: { productId: number; title: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}