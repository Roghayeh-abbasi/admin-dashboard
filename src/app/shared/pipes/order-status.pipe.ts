import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../../core/models/order.model';

@Pipe({
  name: 'orderStatus',
  standalone: true
})
export class OrderStatusPipe implements PipeTransform {
  private statusMap: { [key: string]: string } = {
    PENDING: 'در انتظار',
    SHIPPED: 'ارسال شده',
    CANCELED: 'لغو شده',
    pending: 'در انتظار',
    shipped: 'ارسال شده',
    canceled: 'لغو شده',
    cancelled: 'لغو شده'
  };

  transform(value: OrderStatus | string | undefined): string {
    if (!value) {
      console.warn('Status is undefined or null');
      return 'نامشخص';
    }
    console.log('Pipe input:', value, 'Type:', typeof value);
    const stringValue = value.toString();
    const normalizedValue = stringValue.toUpperCase();
    console.log('Normalized value:', normalizedValue);
    const result = this.statusMap[normalizedValue] || this.statusMap[stringValue] || 'نامشخص';
    console.log('Pipe output:', result);
    return result;
  }
}