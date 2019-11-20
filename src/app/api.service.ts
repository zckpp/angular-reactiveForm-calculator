import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {tap, map, retryWhen, delayWhen} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  DateUrl = './assets/commitDate.json';
  constructor(private httpClient: HttpClient) {
  }

  readDate(): Observable<any> {
    return this.httpClient.get<any>(this.DateUrl).pipe(
      retryWhen(errors => {
        return errors
          .pipe(
            delayWhen(() => timer(2000)),
            tap(() => console.log('retrying...'))
          );
      } )
    );
  }
}
