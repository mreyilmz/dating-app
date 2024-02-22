import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  NgbNav,
  NgbNavChangeEvent,
  NgbNavItem,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeAgoPipe } from '../../_pipes/time-ago.pipe';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    GalleryModule,
    TimeAgoPipe,
    MemberMessagesComponent,
  ],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberNavTabs', { static: true }) memberNavTabs?: NgbNav;
  activeTab?: number; // -----------------------------------------------------------------------------------
  member: Member = {} as Member;
  active: number = 1;
  images: GalleryItem[] = [];
  messages: Message[] = [];
  user?: User;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    public presenceService: PresenceService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }
  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => (this.member = data['member']),
    });

    this.route.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab();
      },
    });

    this.getImages();
  }

  onTabActivated() {
    if (this.active === 4 && this.user)
      this.messageService.createHubConnection(this.user, this.member.userName);
    else {
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  selectTab(tab: number = 4) {
    this.active = tab;
    this.onTabActivated();
  }

  // loadMessages() {
  //   if (this.member)
  //     this.messageService.getMessageThread(this.member.userName).subscribe({
  //       next: (messages) => (this.messages = messages),
  //     });
  // }

  getImages() {
    if (!this.member) return;
    for (const photo of this.member?.photos) {
      this.images.push(
        new ImageItem({
          src: photo.url,
          thumb: photo.url,
        })
      );
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  }
}
