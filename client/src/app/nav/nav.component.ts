import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbDropdownModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  model: any = {};

  // async pipe
  // And when we use the async pipe, then that's going to automatically subscribe and unsubscribe for us.

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {}

  /*   getCurrentUser() {
    this.accountService.currentUser$.subscribe({
      // And this effectively turns our user object into a "Boolean" by using these "double exclamation marks". And if we have a user that's going to return "true", if we do not have a user, it's going to return "false".
      next: (user) => (this.loggedIn = !!user),
      error: (error) => console.log(error),
    });
  }
 */
  login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => this.router.navigateByUrl('/members'),
      error: (error) => this.toastr.error(error.error),
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
