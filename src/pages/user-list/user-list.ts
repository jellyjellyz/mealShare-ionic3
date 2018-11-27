import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserListPage');
  }

  private jump() {
  	this.navCtrl.push(UserProfilePage); 
  }

}
