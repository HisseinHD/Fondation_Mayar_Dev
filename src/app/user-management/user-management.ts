import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  loadUsers() {
    this.http.get<User[]>(this.apiUrl, this.getAuthHeaders()).subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error(err),
    });
  }

  openEditModal(user: User) {
    this.selectedUser = { ...user };
  }

  closeEditModal() {
    this.selectedUser = null;
  }

  saveUser() {
    if (!this.selectedUser) return;

    this.http
      .put(`${this.apiUrl}/${this.selectedUser._id}`, this.selectedUser, this.getAuthHeaders())
      .subscribe({
        next: () => {
          this.loadUsers();
          this.closeEditModal();
        },
        error: (err) => console.error(err),
      });
  }

  openDeleteModal(user: User) {
    this.userToDelete = user;
  }

  closeDeleteModal() {
    this.userToDelete = null;
  }

  confirmDelete() {
    if (!this.userToDelete) return;

    this.http.delete(`${this.apiUrl}/${this.userToDelete._id}`, this.getAuthHeaders()).subscribe({
      next: () => {
        this.loadUsers();
        this.closeDeleteModal();
      },
      error: (err) => console.error(err),
    });
  }
}
