import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { User } from '../../models/user';
import { Group } from '../../models/group';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { database } from 'firebase';

/**
 * Generated class for the InvitegroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invitegroup',
  templateUrl: 'invitegroup.html',
})
export class InvitegroupPage {

  private users: User[] = [];
  private groups: Group[] = [];
  private segment: string;
  private hide: boolean;
  private checkedGroupId: string;
  private checkedGroup: Group;
  private loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userService: UserDataServiceProvider,
    private loadingCtrl: LoadingController,
    ) {

    this.userService.getObservable().subscribe(update => {
      this.users = userService.getUsers();
      this.groups = userService.getGroups();
    })
    this.users = userService.getUsers();
    this.groups = userService.getGroups();
    console.log(JSON.stringify(this.groups));
    this.segment = "all";
    this.hide = true;
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllEventsPage');

  }

  private getUserNameById(userId: string) {
    // console.log(JSON.stringify(this.userService.getUserById(userId)));
    return this.userService.getUserNameById(userId);
  }

  public getUserImgById(userId) {
    if (userId !== "-1" && this.userService.getUserById(userId) != undefined) {
      let userImg = this.userService.getUserById(userId).img;
      // console.log(userImg);
      return userImg;
    } else {
      return "assets/imgs/no-avatar.png";
    }
  }


  private checkCardIsunSelected(id: string) {
    // if (this.checkedGroupId !== undefined && id !== this.checkedGroupId) {
    //   return true;
    // }
    return false;
  }

  private saveGroup() {

    // console.log("in save group page");
    this.navCtrl.getPrevious().data.group = this.groups.find((ele) => { return ele["groupId"] === Number(this.checkedGroupId) });
    // console.log(this.navCtrl.getPrevious().data);
    this.navCtrl.pop();

  }
}
