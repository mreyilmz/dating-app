import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private modalService: NgbModal) {}

  confirm(
    title = 'Onaylama',
    message = 'Bunu yapmak istediğinize emin misiniz?',
    btnOkText = 'Tamam',
    btnCancelText = 'Cancel'
  ): Observable<boolean> {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    return modalRef.closed.pipe(
      map(() => {
        return modalRef.componentInstance.result;
      })
    );
  }
}
