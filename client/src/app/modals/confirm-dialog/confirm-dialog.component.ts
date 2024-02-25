import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  activeModal = inject(NgbActiveModal);

  @Input() title = '';
  @Input() message = '';
  @Input() btnOkText = '';
  @Input() btnCancelText = '';
  @Input() result = false;

  constructor() {}

  confirm() {
    this.result = true;
    this.activeModal.close();
  }

  decline() {
    this.activeModal.close();
  }
}
