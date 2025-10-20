import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, Subscription } from 'rxjs';
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
export class UsersComponent implements OnInit, OnDestroy {
  users$: Observable<any[]> | undefined;
  filteredUsers: any[] = [];
  allUsers: any[] = [];
  searchForm: FormGroup;
  addUserForm: FormGroup;
  private usersSubscription?: Subscription;
  private darkModeListener?: MediaQueryList;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) {
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

    this.darkModeListener = window.matchMedia('(prefers-color-scheme: dark)');
    this.applyDarkMode(this.darkModeListener.matches);
    this.darkModeListener.addEventListener('change', (event) => {
      this.applyDarkMode(event.matches);
    });
  }

  private applyDarkMode(isDark: boolean) {
    if (isDark) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  loadUsers() {
    this.users$ = this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').pipe(
      tap(data => {
        this.allUsers = data;
        this.filteredUsers = [...data];
      })
    );
    this.usersSubscription = this.users$?.subscribe({
      error: (err) => console.error('خطا در لود کاربران:', err)
    });
  }

  filterUsers(term: string) {
    const lowerTerm = term.toLowerCase().trim();
    if (lowerTerm === '') {
      this.filteredUsers = [...this.allUsers];
    } else {
      this.filteredUsers = this.allUsers.filter(user =>
        user.name.toLowerCase().startsWith(lowerTerm) ||
        user.email.toLowerCase().startsWith(lowerTerm)
      );
    }
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
          this.allUsers = this.allUsers.filter(u => u.id !== result.userId);
          this.filterUsers(this.searchForm.get('searchTerm')?.value || '');
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
        const allIndex = this.allUsers.findIndex(u => u.id === user.id);
        if (allIndex !== -1) {
          this.allUsers[allIndex] = { ...this.allUsers[allIndex], ...result.user };
        }
        this.filterUsers(this.searchForm.get('searchTerm')?.value || '');
      }
    });
  }

  onAddUser() {
    if (this.addUserForm.valid) {
      const newUser = { id: Date.now(), ...this.addUserForm.value };
      this.allUsers = [newUser, ...this.allUsers];
      this.filterUsers(this.searchForm.get('searchTerm')?.value || '');
      this.addUserForm.reset();
    }
  }

  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    this.darkModeListener?.removeEventListener('change', () => {});
  }
}
