import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { HomeComponent } from './home/home.component';
import { BusyService } from './_services/busy.service';
import { SpinnerComponent } from './spinner/spinner.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavComponent,
    HomeComponent,
    SpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(
    private accountService: AccountService,
    private busyService: BusyService
  ) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  readBusyCount() {
    return this.busyService.getRequestCount();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
