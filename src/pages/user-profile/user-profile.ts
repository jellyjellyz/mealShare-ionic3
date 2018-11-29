import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
	private user: User = new User();
	
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.user = {
	  	id: 5,
	    name: "Ariel",
	    company: "Waymo",
	    availability: true,
	    img: "https://2380ie25r0n01w5tt7mvyi81-wpengine.netdna-ssl.com/wp-content/uploads/2015/12/LA_SIRENITA_SERA%CC%81_RUBIA_joya_life.jpg",
	    bio: "Ariel has a distinctive appearance, with her long, flowing, bright red hair, blue eyes, green mermaid tail and purple seashell bikini top. In the films and television series, she is the seventh-born daughter of King Triton and Queen Athena of an underwater kingdom of Merfolk called Atlantica.[4][5] She is often rebellious, and in the first film, she longs to be a part of the human world. She marries Prince Eric, whom she rescued from a shipwreck, and together they have a daughter, Melody.",
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

}
