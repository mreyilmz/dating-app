import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UserManagementComponent } from '../user-management/user-management.component';
import { PhotoManagementComponent } from '../photo-management/photo-management.component';
import { HasRoleDirective } from '../../_directives/has-role.directive';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    UserManagementComponent,
    PhotoManagementComponent,
    HasRoleDirective,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent {
  active: number = 1;
}
