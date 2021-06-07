import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

import { ApiService } from './api.service';
import { Review } from '../models/review.model';

describe('ApiService', () => {
  let httpTestingController: HttpTestingController;
  let apiService: ApiService;
  let expectedReview: Review = {
    rating: 0.8,
    publish_date: '2016-09-05T23:25:47.642350Z',
    id: '9783221620868',
    body: 'The fool doth think he is wise, but the wise man knows himself to be a fool.',
    author: 'Kaley Schiller'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getReviews()', () => {
    const expectedReviews: Review[] = [expectedReview];

    it('should provide the api key in the headers for authorization', () => {
      apiService
        .getReviews()
        .subscribe(reviews => expect(reviews).toEqual(expectedReviews));
      const req = httpTestingController.expectOne(request =>
        request.headers.has('x-api-key')
      );
      expect(req.request.method).toEqual('GET');
      req.flush(expectedReviews);
    });

    it('should return expected reviews', () => {
      apiService
        .getReviews()
        .subscribe(reviews => expect(reviews).toEqual(expectedReviews));
      const req = httpTestingController.expectOne(apiService.apiUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(expectedReviews);
    });

    it('should be OK returning no reviews', () => {
      apiService
        .getReviews()
        .subscribe(reviews => expect(reviews.length).toEqual(0));
      const req = httpTestingController.expectOne(apiService.apiUrl);
      req.flush([]);
    });

    it('should return an empty array if there is an error', () => {
      apiService
        .getReviews()
        .subscribe(reviews => expect(reviews.length).toEqual(0));
      const req = httpTestingController.expectOne(apiService.apiUrl);
      req.flush('', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getReviewById()', () => {
    let apiUrl: string;

    beforeEach(() => {
      apiUrl = `${apiService.apiUrl}/${expectedReview.id}`;
    });

    it('should provide the api key in the headers for authorization', () => {
      apiService
        .getReviewById(expectedReview.id)
        .subscribe(review => expect(review).toEqual(expectedReview));
      const req = httpTestingController.expectOne(
        request => request.headers.has('x-api-key') && request.url === apiUrl
      );
      expect(req.request.method).toEqual('GET');
      req.flush(expectedReview);
    });

    it('should return expected review for provided id', () => {
      apiService
        .getReviewById(expectedReview.id)
        .subscribe(review => expect(review).toEqual(expectedReview));
      const req = httpTestingController.expectOne(apiUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(expectedReview);
    });

    it('should return `undefined` if there is an error', () => {
      apiService
        .getReviewById('1')
        .subscribe(review => expect(review).toEqual(undefined));
      const req = httpTestingController.expectOne(`${apiService.apiUrl}/1`);
      req.flush('', { status: 404, statusText: 'Not Found' });
    });
  });
});
