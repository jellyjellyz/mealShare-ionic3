import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { User } from '../../models/user';
import { Group } from '../../models/group';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { AuthProvider } from '../../providers/auth/auth';

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

  private users: User[] = [];
  private editProfile: boolean;
  private showProfile: boolean;
  private user: User = new User();
  private showAvatarChoice: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userService: UserDataServiceProvider,
    public fAuthService: AuthProvider,
    public app: App) {


    if (this.navParams.get('userId') == undefined) {
      this.fAuthService.getCurrentUser().then((data) => {
        let userId = data.id;
        let useremail = data.email;

        this.userService.getUserById2(data.id).then((user) => {
          if (user != null) {
            console.log("get user");
            this.user = user;
          } else {
            console.log("here");
            this.user = this.userService.createUserById(userId, useremail);
          }
        })


      });
    } else {
      let userId = this.navParams.get('userId');
      this.userService.getUserById2(userId).then((data) => {
        this.user = data;
        console.log(JSON.stringify(this.user))
      });
    }

    this.showProfile = true;

    this.userService.getObservable().subscribe(update => {
      this.users = userService.getUsers();
      this.showProfile = true;
      this.editProfile = false;
      // console.log(this.users)
    })
    this.users = userService.getUsers();
    this.showProfile = true;
    this.editProfile = false
    console.log(this.users)
  }

  edit() {
    this.showProfile = false
    this.editProfile = true;
    this.showAvatarChoice = true;

  }


  save() {
    this.showProfile = true
    this.editProfile = false;
    this.userService.updateUser(this.user);
  }


  logout() {
    this.fAuthService.doLogout()
      .then((res) => {
        this.app.getRootNav().pop();
      }, (error) => {
        console.log("Logout error", error);
      });
  }

  chooseImg(img: string) {
    console.log("cilck");
    this.user.img = img;
  }

}
