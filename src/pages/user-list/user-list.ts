import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  private checked = {};
  constructor(public navCtrl: NavController,
  			  public navParams: NavParams,
  			  private userService: UserDataServiceProvider) {
  	// this.loadFakeEntries();
  	this.userService.getObservable().subscribe(update => {
      this.users = userService.getUsers();
      // console.log(JSON.stringify(this.users));
      this.groups = userService.getGroups();
    })
    this.users = userService.getUsers();
    this.groups = userService.getGroups();
    // console.log(this.groups);

    // initialize checked object
    for (var i = 1; i < this.users.length; i++) {
      this.checked[this.users[i].id]=false;
    }
    console.log(this.checked);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserListPage');
  }

  private saveGroup() {
    this.hide = !this.hide;
    console.log(this.checked);
    let userIds: string[] = [];
    for (var key in this.checked) {
      if (this.checked[key] === true) {
        userIds.push(key);
      }
    }
    console.log(userIds);
    let new_group: Group = {
      groupId: 5,
      groupName: "Eating Out Group",
      userIds: userIds
    };
    this.userService.addGroup(new_group);
  }

  // private loadFakeEntries() {
  // 	this.users = [
  //     {
  //       id: 1,
	//     name: "Woody",
	//     company: "Google",
	//     availability: true,
	//     img: "assets/imgs/avatar-ts-woody.png",
	//     bio: "How are you?"
  //     },
  //     {
  //       id: 2,
	//     name: "Buzz Lightyear",
	//     company: "Amazon",
	//     availability: false,
	//     img: "assets/imgs/avatar-ts-buzz.png",
	//     bio: "Bonjour!"
  //     },
  //     {
  //       id: 3,
	//     name: "Jessie",
	//     company: "Microsoft",
	//     availability: true,
	//     img: "assets/imgs/avatar-ts-jessie.png",
	//     bio: "Hello"
  //     },
  //     {
  //       id: 4,
	//     name: "Mr. Potato Head",
	//     company: "Uber",
	//     availability: false,
	//     img: "assets/imgs/avatar-ts-potatohead.png",
	//     bio: "Have you had a meal today?"
  //     },
  //     {
  //       id: 5,
	//     name: "Ariel",
	//     company: "Waymo",
	//     availability: true,
	//     img: "https://2380ie25r0n01w5tt7mvyi81-wpengine.netdna-ssl.com/wp-content/uploads/2015/12/LA_SIRENITA_SERA%CC%81_RUBIA_joya_life.jpg",
	//     bio: "Ariel has a distinctive appearance, with her long, flowing, bright red hair, blue eyes, green mermaid tail and purple seashell bikini top. In the films and television series, she is the seventh-born daughter of King Triton and Queen Athena of an underwater kingdom of Merfolk called Atlantica.[4][5] She is often rebellious, and in the first film, she longs to be a part of the human world. She marries Prince Eric, whom she rescued from a shipwreck, and together they have a daughter, Melody."
  //     }];
  //     this.groups = [
  //     {
  //     	groupId: 1,
  //     	userIds: [1, 2]
  //     },
  //     {
  //     	groupId: 2,
  //     	userIds: [3, 4]
  //     }];

  // }
  public jump(userId: string) {
  	this.navCtrl.push(UserProfilePage, {"userId": userId});
  }
  private createGroup() {
    this.hide = !this.hide;
  }

}
