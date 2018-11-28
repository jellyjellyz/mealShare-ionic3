import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
import { User } from '../../models/user';

/**
 * Generated class for the UserListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})
export class UserListPage {
  private users: User[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.loadFakeEntries();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserListPage');
  }

  private loadFakeEntries() {
  	this.users = [
      {
        id: 1,
	    name: "Woody",
	    company: "Google",
	    availability: 1,
	    img: "assets/imgs/avatar-ts-woody.png",
	    bio: "How are you?",
      },
      {
        id: 2,
	    name: "Buzz Lightyear",
	    company: "Amazon",
	    availability: 0,
	    img: "assets/imgs/avatar-ts-buzz.png",
	    bio: "Bonjour!",
      },
      {
        id: 3,
	    name: "Jessie",
	    company: "Microsoft",
	    availability: 1,
	    img: "assets/imgs/avatar-ts-jessie.png",
	    bio: "Hello",
      },
      {
        id: 4,
	    name: "Mr. Potato Head",
	    company: "Uber",
	    availability: 1,
	    img: "assets/imgs/avatar-ts-potatohead.png",
	    bio: "Have you had a meal today?",
      }];      

  }
  public jump() {
  	this.navCtrl.push(UserProfilePage); 
  }

}
