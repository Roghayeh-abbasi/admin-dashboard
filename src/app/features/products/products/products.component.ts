import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../../core/services/product.service';
import { CardComponent } from '../../../shared/components/card/card/card.component';
import { Product } from '../../../core/models/product.model';
import { trigger, style, animate, transition } from '@angular/animations';
import { ProductFormComponent } from '../product-form/product-form/product-form.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    CardComponent,
    ProductFormComponent
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductsComponent {
  productService = inject(ProductService);
  dialog = inject(MatDialog);

  products = signal<Product[]>([]);
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('');
  categories = computed(() => [...new Set(this.products().map(p => p.category))]);
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    return this.products().filter(p =>
      p.title.toLowerCase().includes(query) &&
      (!category || p.category === category)
    );
  });

  constructor() {
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }

  filterProducts() {
    // سیگنال‌ها خودکار آپدیت می‌شن
  }

  openProductForm(product?: Product) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      data: product ? { ...product } : null, 
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const productData: Product = {
          id: product?.id || 0, 
          title: result.title,
          price: Number(result.price),
          category: result.category,
          image: result.image,
          description: result.description || product?.description 
        };

        if (product?.id && productData.id) {
          this.productService.updateProduct(product.id, productData).subscribe({
            next: (updated) => {
              this.products.update(products => 
                products.map(p => p.id === updated.id ? { ...p, ...updated } : p)
              );
            },
            error: (err) => {
              console.error('خطا در ویرایش محصول:', err);
            }
          });
        } else {
          this.productService.addProduct(productData).subscribe({
            next: (newProduct) => {
              this.products.update(products => [...products, newProduct]);
            },
            error: (err) => {
              console.error('خطا در افزودن محصول:', err);
            }
          });
        }
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('آیا مطمئن هستید؟')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products.update(products => products.filter(p => p.id !== id));
        },
        error: (err) => {
          console.error('خطا در حذف محصول:', err);
        }
      });
    }
  }
}