import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { MessageDataServiceProvider } from '../../providers/message-data-service/message-data-service';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { EventDataServiceProvider } from '../../providers/event-data-service/event-data-service';

import { Message } from '../../models/message';
import { User } from '../../models/user';
import { Event } from '../../models/event';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  private messages: Message[] = [];
  private users: User[] = [];
  private events: Event[] = [];
  private myId: string;

  constructor(public navCtrl: NavController,
    private messageService: MessageDataServiceProvider,
    private userService: UserDataServiceProvider,
    private eventService: EventDataServiceProvider,
    private authService: AuthProvider
  ) {

    this.messageService.getObservable().subscribe(update => {
      this.messages = this.messageService.getMessages();
    });
    this.userService.getObservable().subscribe(update => {
      this.users = this.userService.getUsers();
    });
    this.eventService.getObservable().subscribe(update => {
      this.events = this.eventService.getEvents();
    });
    this.messages = this.messageService.getMessages();
    this.users = this.userService.getUsers();
    this.events = this.eventService.getEvents();
    // console.log(this.events);
    // console.log(this.messages);

    this.getLoginUserId().then(id => {
      this.myId = id;
      console.log(this.myId);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  private findSender(message: Message): User {
    let user = this.users.find(user => user.id == message.senderId);
    return user;
  }
  private findSenderName(message: Message) {
    return this.findSender(message).name;
  }
  private findSenderImg(message: Message) {
    return this.findSender(message).img;
  }
  private findEvent(message: Message): Event {
    let event = this.events.find(event => event.key == message.eventId);
    return event;
  }
  private findEventTitle(message: Message) {
    return this.findEvent(message).title;
  }


  private accept_invite(message: Message) {
    let invite_userId = message.senderId;
    let invite_event = this.findEvent(message);
    // console.log(invite_userId);
    // console.log(invite_event);
    // console.log(invite_event.coming_people_ids.indexOf(this.myId));
    if (invite_event.coming_people_ids.indexOf(this.myId) == -1) {
      // console.log("join");
      invite_event.coming_people_ids.push(this.myId);
      let idx = invite_event.pending_people_ids.indexOf(this.myId);
      if (idx > -1) {
        invite_event.pending_people_ids.splice(idx, 1);
      }

      this.messageService.sendMessage(invite_event.key, this.myId, invite_userId, 2);
      this.messageService.updateEvent(invite_event.key, "pending_people_ids", invite_event.pending_people_ids);
      this.messageService.updateEvent(invite_event.key, "coming_people_ids", invite_event.coming_people_ids);
    }
  }

  private reject_invite(message: Message) {
    let invite_userId = message.senderId;
    let invite_event = this.findEvent(message);

    let idx_coming = invite_event.coming_people_ids.indexOf(this.myId); //should be -1, but just to double check
    if (idx_coming > -1) {
      invite_event.coming_people_ids.splice(idx_coming, 1);
      this.messageService.updateEvent(invite_event.key, "coming_people_ids", invite_event.coming_people_ids);
    }

    let idx = invite_event.pending_people_ids.indexOf(this.myId);
    if (idx > -1) {
      invite_event.pending_people_ids.splice(idx, 1);
      this.messageService.updateEvent(invite_event.key, "pending_people_ids", invite_event.pending_people_ids);
    }

    this.messageService.sendMessage(invite_event.key, this.myId, invite_userId, 3);
  }


  private accept_request(message: Message) {
    let request_userId = message.senderId;
    let request_event = this.findEvent(message);

    if (request_event.coming_people_ids.indexOf(request_userId) == -1) {
      request_event.coming_people_ids.push(request_userId);
      // console.log(request_event.coming_people_ids);
      let idx = request_event.pending_people_ids.indexOf(this.senderId);
      if (idx > -1) {
        request_event.pending_people_ids.splice(idx, 1);
      }
      this.messageService.sendMessage(request_event.key, this.myId, request_userId, 6);
      this.messageService.updateEvent(request_event.key, "pending_people_ids", request_event.pending_people_ids);
      this.messageService.updateEvent(request_event.key, "coming_people_ids", request_event.coming_people_ids);

    }
    console.log("accept");
  }


  private reject_request(message: Message) {
    let request_userId = message.senderId;
    let request_event = this.findEvent(message);

    let idx_coming = request_event.coming_people_ids.indexOf(request_userId); //should be -1, but just to double check
    if (idx_coming > -1) {
      request_event.coming_people_ids.splice(idx_coming, 1);
      this.messageService.updateEvent(request_event.key, "coming_people_ids", request_event.coming_people_ids);
    }

    let idx = request_event.pending_people_ids.indexOf(request_userId);
    if (idx > -1) {
      request_event.pending_people_ids.splice(idx, 1);
      this.messageService.updateEvent(request_event.key, "pending_people_ids", request_event.pending_people_ids);
    }

    this.messageService.sendMessage(request_event.key, this.myId, request_userId, 5);
  }






  private checkSenderGoingOrNot(message: Message) {
    let request_userId = message.senderId;
    let request_event = this.findEvent(message);
    if (request_event.coming_people_ids.indexOf(request_userId) > -1) {
      return true;
    }
    return false;
  }

  private checkSenderPendingOrNot(message: Message) {
    let request_userId = message.senderId;
    let request_event = this.findEvent(message);
    if (request_event.pending_people_ids.indexOf(request_userId) > -1) {
      return true;
    }
    return false;
  }

  private checkMeGoingOrNot(message: Message) {
    let invite_event = this.findEvent(message);
    if (invite_event.coming_people_ids.indexOf(this.myId) > -1) {
      return true;
    }
    return false;
  }

  private checkMePendingOrNot(message: Message) {
    let invite_event = this.findEvent(message);
    if (invite_event.pending_people_ids.indexOf(this.myId) > -1) {
      return true;
    }
    return false;
  }

  private getLoginUserId(): Promise<string> {
    return new Promise((resolve) => {
      this.authService.getCurrentUser().then((user) => { resolve(user.id) });
    })

  }
}
