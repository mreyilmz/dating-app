import { Component, Input } from '@angular/core';
import { Member } from '../../_models/member';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MembersService } from '../../_services/members.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss',
})
export class MemberCardComponent {
  @Input() member: Member | undefined;

  constructor(
    private memberSerivce: MembersService,
    private toastr: ToastrService
  ) {}

  addLike(member: Member) {
    this.memberSerivce.addLike(member.userName).subscribe({
      next: () => this.toastr.success('You have liked ' + member.knownAs),
    });
  }
}
