import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AdminService } from '../../_services/admin.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  availableRoles = ['Admin', 'Moderator', 'Member'];

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users) => (this.users = users),
    });
  }

  openRolesModal(user: User) {
    const modalRef = this.modalService.open(RolesModalComponent);
    modalRef.componentInstance.username = user.username;
    modalRef.componentInstance.availableRoles = this.availableRoles;
    modalRef.componentInstance.selectedRoles = [...user.roles];
    modalRef.closed.subscribe({
      next: () => {
        const selectedRoles = modalRef.componentInstance.selectedRoles;
        if (!this.arrayEqual(selectedRoles, user.roles)) {
          this.adminService
            .updateUserRoles(user.username, selectedRoles!)
            .subscribe({
              next: (roles) => (user.roles = roles),
            });
        }
      },
    });
  }

  private arrayEqual(arr1: any, arr2: any) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
}
