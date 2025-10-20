import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'edit' ? 'ویرایش کاربر' : 'حذف کاربر' }}</h2>
    <mat-dialog-content>
      <p *ngIf="data.mode === 'delete'">آیا مطمئن هستید که می‌خواهید کاربر {{ data.user.name }} را حذف کنید؟</p>
      <form *ngIf="data.mode === 'edit'" [formGroup]="editForm" (ngSubmit)="onSave()">
        <mat-form-field>
          <input matInput placeholder="نام" formControlName="name" />
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="ایمیل" formControlName="email" />
        </mat-form-field>
        <button mat-button type="submit" [disabled]="editForm.invalid">ذخیره</button>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">لغو</button>
      <button mat-button *ngIf="data.mode === 'delete'" (click)="onDeleteConfirm()">حذف</button>
    </mat-dialog-actions>
  `
})
export class UserModalComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      name: [data.user.name, Validators.required],
      email: [data.user.email, [Validators.required, Validators.email]]
    });
  }

  onSave() {
    if (this.editForm.valid) {
      this.dialogRef.close({ mode: 'edit', user: this.editForm.value });
    }
  }

  onDeleteConfirm() {
    this.dialogRef.close({ mode: 'delete', userId: this.data.user.id });
  }

  onCancel() {
    this.dialogRef.close();
  }
}