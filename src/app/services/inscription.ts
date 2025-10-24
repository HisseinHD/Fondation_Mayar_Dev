import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InscriptionService {
  private apiUrl = 'http://localhost:3000/api/inscription';

  constructor(private http: HttpClient) {}

  // Inscrire un candidat à une formation
  inscrire(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscrire`, data);
  }

  // Récupérer tous les candidats d’une formation
  getCandidatsParFormation(formationId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/formation/${formationId}`);
  }

  // Récupérer tous les candidats par catégorie (pour admin)
  getCandidatsParCategorie(categorie: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorie`, {
      params: { categorie },
    });
  }

  // Mettre à jour le statut d’un candidat
  updateStatutCandidat(candidatId: string, statut: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${candidatId}/statut`, { statut });
  }
}
