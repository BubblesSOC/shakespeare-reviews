import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiKey = 'H3TM28wjL8R4#HTnqk?c';
  private readonly authHeader = new HttpHeaders({
    'x-api-key': this.apiKey
  });
  readonly apiUrl = 'https://shakespeare.podium.com/api/reviews';

  constructor(private httpClient: HttpClient) {}

  getReviews(): Observable<Review[]> {
    return this.httpClient
      .get<Review[]>(this.apiUrl, {
        headers: this.authHeader
      })
      .pipe(
        catchError(err => {
          console.error('failed to fetch reviews', err);
          return of([] as Review[]);
        })
      );
  }

  getReviewById(id: string): Observable<Review | undefined> {
    return this.httpClient
      .get<Review>(`${this.apiUrl}/${id}`, {
        headers: this.authHeader
      })
      .pipe(
        catchError(err => {
          console.error(`failed to fetch review by id ${id}`, err);
          return of(undefined);
        })
      );
  }
}
