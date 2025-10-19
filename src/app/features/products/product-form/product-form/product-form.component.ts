import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ProductFormComponent>);
  product = inject(MAT_DIALOG_DATA) as Product | null; 

  productForm = this.fb.group({
    id: [0],
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    image: ['', Validators.required],
    description: ['']
  });

  constructor() {
    if (this.product) {
      this.productForm.patchValue({
        id: this.product.id || 0,
        title: this.product.title || '',
        price: this.product.price || 0,
        category: this.product.category || '',
        image: this.product.image || '',
        description: this.product.description || ''
      });
    }
  }

  save() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }
}