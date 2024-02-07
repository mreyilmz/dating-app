import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  // And because it's an observable, we need to subscribe to this, which means we need to think about unsubscribing to this. Now, there's a trick we can use with observables and using the pipe method, and we can open parentheses and say that we only want to take one of this. And that means when we have what we get back from our account service, that means this subscription will complete and it will no longer consume resources in our app.
  // So we wouldn't need to physically unsubscribed from this. This is the equivalent of Netflix giving you the option to buy a single movie rather than subscribing
  accountService.currentUser$.pipe(take(1)).subscribe({
    next: (user) => {
      if (user) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
    },
  });
  return next(req);
};
