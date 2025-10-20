import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserModalComponent } from './user-modal.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, UserModalComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users$: Observable<any[]> | undefined;
  filteredUsers: any[] = [];
  searchForm: FormGroup;
  addUserForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, public dialog: MatDialog) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(term => {
      this.filterUsers(term);
    });
  }

  loadUsers() {
    this.users$ = this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').pipe(
      tap(data => {
        this.filteredUsers = data;
      })
    );
  }

  filterUsers(term: string) {
    if (!this.users$) return;
    this.users$.subscribe(data => {
      this.filteredUsers = data.filter(user =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      );
    });
  }

  onDelete(userId: number) {
    const user = this.filteredUsers.find(u => u.id === userId);
    if (user) {
      const dialogRef = this.dialog.open(UserModalComponent, {
        width: '400px',
        data: { mode: 'delete', user }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.mode === 'delete') {
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== result.userId);
          console.log('کاربر با شناسه', result.userId, 'حذف شد.');
        }
      });
    }
  }

  onEdit(user: any) {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '400px',
      data: { mode: 'edit', user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.mode === 'edit') {
        const index = this.filteredUsers.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.filteredUsers[index] = { ...user, ...result.user };
          console.log('کاربر ویرایش شد:', this.filteredUsers[index]);
        }
      }
    });
  }

  onAddUser() {
    if (this.addUserForm.valid) {
      const newUser = { id: Date.now(), ...this.addUserForm.value };
      this.filteredUsers = [newUser, ...this.filteredUsers];
      this.addUserForm.reset();
      console.log('کاربر جدید اضافه شد:', newUser);
    }
  }
}