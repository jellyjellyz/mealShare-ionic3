import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageDataServiceProvider } from '../../providers/message-data-service/message-data-service';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { User } from '../../models/user';
import { Message } from '../../models/message';

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
  constructor(public navCtrl: NavController, 
  			  public navParams: NavParams, 
  			  private messageService: MessageDataServiceProvider,
  			  private userService: UserDataServiceProvider) {
    this.messageService.getObservable().subscribe(update => {
      this.messages = messageService.getMessages();
  	});
  	this.userService.getObservable().subscribe(update => {
      this.users = userService.getUsers();
  	});
  	console.log(this.messages);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

}
