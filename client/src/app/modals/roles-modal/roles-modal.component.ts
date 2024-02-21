import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.scss',
})
export class RolesModalComponent {
  activeModal = inject(NgbActiveModal);

  @Input() username = '';
  @Input() availableRoles: any[] = [];
  @Input() selectedRoles: any[] = [];

  updateChecked(checkedValue: string) {
    const index = this.selectedRoles.indexOf(checkedValue);
    index !== -1
      ? this.selectedRoles.splice(index, 1)
      : this.selectedRoles.push(checkedValue);
  }
}
