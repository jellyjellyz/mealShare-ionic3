import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
import { User } from '../../models/user';
import { Group } from '../../models/group';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';

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
  private groups: Group[] = [];
  private segment: string = "users";
  private hide: boolean = false;
  private checked: any;
  private groupName: string;
  constructor(public navCtrl: NavController,
  			  public navParams: NavParams,
          private alertCtrl: AlertController,
  			  private userService: UserDataServiceProvider) {
  	// this.loadFakeEntries();
  	this.userService.getObservable().subscribe(update => {
      console.log('updated user list page');
      this.users = userService.getUsers();
      // console.log(JSON.stringify(this.users));
      this.groups = userService.getGroups();
    })
    this.users = userService.getUsers();
    this.groups = userService.getGroups();
    // console.log(this.groups);

    // initialize checked object
    this.initChecked();
  }

  ionViewWillEnter() {
    this.groups = this.userService.getGroups();
  }

  private initChecked() {
    this.checked = {};
    for (var i = 1; i < this.users.length; i++) {
      // if (this.users[i].id !== 1) {
        this.checked[this.users[i].id]=false;
      // }
    }
    // console.log(this.checked);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserListPage');
  }
  private findUser(userId: string): User {
    let user = this.users.find(user => user.id == userId);
    return user;
  }
  private findUserImg(userId: string) {
    return this.findUser(userId).img;
  }
  private saveGroup() {
    this.hide = !this.hide;
    // console.log(this.checked);
    let userIds: string[] = [];
    for (var key in this.checked) {
      if (this.checked[key] === true) {
        userIds.push(key);
      }
    }
    // console.log(userIds);
    let new_group: Group = {
      groupId: 5,
      groupName: this.groupName,
      userIds: userIds
    };
    this.userService.addGroup(new_group);
    this.segment = "groups";
    this.initChecked();
    this.groupName = "";
  }
  private deleteGroup(group: Group) {
    const alert = this.alertCtrl.create({
			title: 'Delete this group',
			subTitle: 'are you sure?',
			buttons: [{
				text: 'Confirm',
				handler: () => {
					this.userService.deleteGroup(group);

					// alert.onDidDismiss(() => {
					// 	this.navCtrl.pop();
					// });
				}
			},
			{
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
					console.log('Buy clicked');
				}
			}]
		});
		alert.present();
  }

  public jump(userId: string) {
  	this.navCtrl.push(UserProfilePage, {"userId": userId});
  }
  private createGroup() {
    this.hide = !this.hide;
    this.segment ="users";
  }

}
