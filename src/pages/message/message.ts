import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { MessageDataServiceProvider } from '../../providers/message-data-service/message-data-service';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { EventDataServiceProvider } from '../../providers/event-data-service/event-data-service';

import { Message } from '../../models/message';
import { User } from '../../models/user';
import { Event } from '../../models/event';

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
  constructor(public navCtrl: NavController,
  			  private messageService: MessageDataServiceProvider,
  			  private userService: UserDataServiceProvider,
  			  private eventService: EventDataServiceProvider) {

    this.messageService.getObservable().subscribe(update => {
      this.messages = messageService.getMessages();
  	});
  	this.userService.getObservable().subscribe(update => {
      this.users = userService.getUsers();
  	});
  	this.eventService.getObservable().subscribe(update => {
      this.events = eventService.getEvents();
  	});
  	this.messages = messageService.getMessages();
  	this.users = userService.getUsers();
  	this.events = eventService.getEvents();
    // console.log(this.events);
    // console.log(this.messages);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  private findSender(message: Message): User {
  	let user = this.users.find(user => user.id === message.senderId);
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
  private send_request(message: Message) {

  }
  private accept_request(message: Message) {
    
  }


}
