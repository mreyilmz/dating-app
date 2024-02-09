import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { User } from '../../_models/user';
import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from 'ng-gallery';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FileUploadComponent } from '../../file-upload/file-upload.component';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    GalleryModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadComponent,
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss',
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: Member | undefined;
  user: User | null = null;
  active: number = 1;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastr: ToastrService
  ) {
    // We do need to subscribe to "currentUser$", but we're going to use the pipe and we're going to specify we just want to take one. So as soon as we have this user, our request is then "completed" and we do not need to "unsubscribe".
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => (this.user = user),
    });
  }
  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: (member) => (this.member = member),
    });
  }

  updateMember() {
    // console.log(this.member);
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: (_) => {
        this.toastr.success('Profil başarılı bir şekilde güncellendi.');
        this.editForm?.reset(this.member); // form.reset() fonskiyonu formu temiz ve dokunulmamış hale getiriyor. argument girilmezse tüm kontroller null olacak, argument girilirse argumentin değerleri form kontrollerine girilecek. İki yönlü veri alışverişi olduğu için, burada girdiğimiz "this.member" güncel durumda.
      },
    });
  }
}
