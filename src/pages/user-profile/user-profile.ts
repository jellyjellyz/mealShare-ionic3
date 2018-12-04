import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { Group } from '../../models/group';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';

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
   private user: User;
   private users: User[] = [];
   private editProfile: boolean;
   private showProfile: boolean;

   constructor(public navCtrl: NavController, public navParams: NavParams,
    private userService: UserDataServiceProvider) {

    let userId = this.navParams.get('userId');
    if (userId == undefined) {
      userId = 1;
    }
    this.user = this.userService.getUserById(userId);
    this.showProfile = true;

    this.userService.getObservable().subscribe(update => {
      this.users = userService.getUsers();
      this.showProfile=true;
      this.editProfile=false;
      // console.log(this.users)
    })
    this.users = userService.getUsers();
    this.showProfile=true;
    this.editProfile=false
    console.log(this.users)
  }

  edit() {
    this.showProfile = false
    this.editProfile = true;

  }

 save(){
   this.showProfile=true
   this.editProfile=false;
   this.userService.updateUserProfile(this.user);
 }

}
