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
      },
      {
        id: 5,
	    name: "Ariel",
	    company: "Waymo",
	    availability: 1,
	    img: "https://2380ie25r0n01w5tt7mvyi81-wpengine.netdna-ssl.com/wp-content/uploads/2015/12/LA_SIRENITA_SERA%CC%81_RUBIA_joya_life.jpg",
	    bio: "Ariel has a distinctive appearance, with her long, flowing, bright red hair, blue eyes, green mermaid tail and purple seashell bikini top. In the films and television series, she is the seventh-born daughter of King Triton and Queen Athena of an underwater kingdom of Merfolk called Atlantica.[4][5] She is often rebellious, and in the first film, she longs to be a part of the human world. She marries Prince Eric, whom she rescued from a shipwreck, and together they have a daughter, Melody.",
      }];      

  }
  public jump() {
  	this.navCtrl.push(UserProfilePage); 
  }

}
