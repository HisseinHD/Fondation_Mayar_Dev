import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Actualite {
  _id?: string;
  titre: string;
  contenu: string;
  description?: string;
  image?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActualiteService {
  private apiUrl = `${environment.apiUrl}/actualites`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token || ''}` });
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(catchError((error) => throwError(() => error)));
  }

  getById(id: string): Observable<Actualite> {
    return this.http
      .get<Actualite>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => throwError(() => error)));
  }

  add(data: FormData): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/add`, data, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  update(id: string, data: FormData): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/${id}`, data, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  delete(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError((error) => throwError(() => error)));
  }
}
