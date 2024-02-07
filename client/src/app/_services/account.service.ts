import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = environment.apiUrl;

  // We're also going to create an observable inside our account service so that other components can use the account service to ascertain whether or not a user is logged in. And we're going to use a special kind of observable for this called a "behavior subject", which allows us to give an observable an initial value that we can then use elsewhere in our app.
  private currentUserSource = new BehaviorSubject<User | null>(null); // Inside the account service, and we're going to set this equal to a new behavior subject, and we're going to specify its type as "User". And we're going to give it an initial value of "null". And so this can be used outside of the account service.
  currentUser$ = this.currentUserSource.asObservable(); // We're going to create another field called current user dollar. And the dollar is a convention to signify that this is an "observable". And we're going to set this to this current user source as observable.

  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) localStorage.setItem('user', JSON.stringify(user));
        // So also inside the account service, as well as setting the information inside local storage, we're also going to update our current user source with the user if we successfully log in. So following the setting of the item in local storage, we're going to say let's not current use a source. Then we're going to say what its next value is and we're going to pass in that user.
        this.currentUserSource.next(user);
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        // return user; "user" dönmemize gerek olmadığı için kaldırdık
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
