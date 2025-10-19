import { Component, inject, Inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { OrderStatus } from '../../../../core/models/order.model';
import { OrderStatusPipe } from '../../../../shared/pipes/order-status.pipe';

@Component({
  selector: 'app-order-status-form',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule, FormsModule, OrderStatusPipe],
  templateUrl: './order-status-form.component.html',
  styleUrls: ['./order-status-form.component.scss']
})
export class OrderStatusFormComponent {
  dialogRef = inject(MatDialogRef<OrderStatusFormComponent>);
  statuses = Object.values(OrderStatus);
  status = signal<OrderStatus | null>(null); 

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number; status: OrderStatus }) {
    this.status.set(this.data.status); 
  }

  save() {
    if (this.status()) {
      this.dialogRef.close({ status: this.status() });
    }
  }
}