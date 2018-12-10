import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Event } from '../../models/event';
import { Group } from '../../models/group';
import { Restaurant } from '../../models/restaurtant';
import { AllEventsPage } from '../all-events/all-events';
import { EventDataServiceProvider } from '../../providers/event-data-service/event-data-service';
import { RestaurantSelectionPage } from '../restaurant-selection/restaurant-selection';
import { InvitegroupPage } from '../invitegroup/invitegroup';
import { User } from '../../models/user';
import { Message } from '../../models/message';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { MessageDataServiceProvider } from '../../providers/message-data-service/message-data-service';
import { MyEventsPage } from '../my-events/my-events';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the CreateEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})
export class CreateEventPage {

  private event: Event = new Event();
  private res: Restaurant;
  private checkedGroup: Group;
  private loading: any;
  private myId: string;

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private eventDataService: EventDataServiceProvider,
    private userService: UserDataServiceProvider,
    private messageService: MessageDataServiceProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthProvider) {
    this.loading = this.loadingCtrl.create();

    // observer only creates when someone subscribe to it,
    // i.e. if not subscribe it here, if no one subscribe to it before
    // there will be no observer,
    // at this time, if call notify subscribers, it will break annoyingly.
    this.eventDataService.getObservable().subscribe(update => {
      // this.event = eventDataService.getEventById(eventKey);
    })

    this.getLoginUserId().then(id => {
      this.myId = id;
      console.log(this.myId);
    })

    let eventKey = this.navParams.get("eventKey");
    if (eventKey === undefined) {
      this.event = {
        key: "0",
        title: "",
        description: "",
        post_date: new Date().toISOString(),
        meet_date: new Date().toISOString(),
        start_time: new Date(1514808000000).toISOString(),
        end_time: new Date(1514808000000).toISOString(),
        restaurant: undefined,
        coming_people_ids: ["-1"],
        pending_people_ids: ["-1"],
        host_id: "-1",
        image_url: "",
        saved_people_ids: ["9999999999999999999"] // it seems an empty array would not be saved to Firebase
      }
    } else {
      this.loading.present();
      eventDataService.getEventById(eventKey).then((snapshot) => {
        this.event = {
          key: snapshot.key,
          title: snapshot.val().title,
          description: snapshot.val().description,
          post_date: snapshot.val().post_date,
          meet_date: new Date(snapshot.val().meet_date).toISOString(),
          start_time: new Date(snapshot.val().start_time).toISOString(),
          end_time: new Date(snapshot.val().end_time).toISOString(),
          restaurant: snapshot.val().restaurant,
          coming_people_ids: snapshot.val().coming_people_ids,
          pending_people_ids: snapshot.val().pending_people_ids,
          host_id: snapshot.val().host_id,
          image_url: snapshot.val().image_url,
          saved_people_ids: ["9999999999999999999"] // it seems an empty array would not be saved to Firebase
        }
        this.res = this.event.restaurant;
        this.loading.dismiss();
      });
    };

  }

  ionViewWillEnter() {
    // after choose restaurant in select restaurant page
    this.res = this.navParams.get('restaurant') || undefined;
    this.checkedGroup = this.navParams.get('group') || undefined;
    console.log(this.checkedGroup);


    // after click edit as a host.
    if (!this.res) {
      this.res = this.event.restaurant;
    }


  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad CreateEventPage');
  }

  private addEvent() {
    let emptyField = this.checkValidEvent(this.event);
    // console.log(emptyField);
    if (emptyField) {
      this.presentAlert(emptyField);
    } else {
      this.event.host_id = this.myId;
      this.event.restaurant = this.res;
      this.event.image_url = this.res.image_url;
      this.event.pending_people_ids = this.checkedGroup.userIds;
      let temp = new Date(this.event.meet_date);
      let month = temp.getUTCMonth();
      let date = temp.getUTCDate();
      let year = temp.getUTCFullYear();
      this.event.meet_date = new Date(year, month, date).toISOString();

      this.eventDataService.addEvent(this.event);
      this.sendMessage();
      this.navCtrl.pop();
    }

  }

  private updateEvent() {
    let emptyField = this.checkValidEvent(this.event);
    if (emptyField) {
      this.presentAlert(emptyField);
    } else {

      if (this.res) {
        this.event.restaurant = this.res;
        this.event.image_url = this.res.image_url;
      }

      // this.event.pending_people_ids = this.checkedGroup.userIds;
      let temp = new Date(this.event.meet_date);
      let month = temp.getUTCMonth();
      let date = temp.getUTCDate();
      let year = temp.getUTCFullYear();
      this.event.meet_date = new Date(year, month, date).toISOString();
      this.event.pending_people_ids = this.checkedGroup ? this.checkedGroup.userIds : this.event.pending_people_ids;

      // console.log(this.event.end_time);
      this.eventDataService.updateEvent(this.event);
      this.navCtrl.pop();
    }
  }

  private toSelectRestaurant() {
    this.navCtrl.push(RestaurantSelectionPage);
  }

  private toChangeRestaurant(resId: string) {
    this.navCtrl.push(RestaurantSelectionPage, { "resId": resId });
  }

  private toInviteGroup() {
    this.navCtrl.push(InvitegroupPage);
  }

  private getUserById(userId: string): User {
    return this.userService.getUserById(userId);
  }

  private getUserNameById(userId: string) {
    // console.log(JSON.stringify(this.userService.getUserById(userId)));
    return this.userService.getUserNameById(userId);
  }

  private getLoginUserId(): Promise<string> {
    return new Promise((resolve) => {
      this.authService.getCurrentUser().then((user) => { resolve(user.id) });
    })

  }

  private sendMessage() {
    console.log("send message");
    this.messageService.updateEvent(this.event.key, "pending_people_ids", this.event.pending_people_ids);
    for (var receiverId in this.event.pending_people_ids) {
      this.messageService.sendMessage(this.event.key, this.event.host_id, this.event.pending_people_ids[receiverId], 4);
    }
  }

  private deleteEvent() {
    const alert = this.alertCtrl.create({
      title: 'Delete this event',
      subTitle: 'are you sure?',
      buttons: [{
        text: 'Confirm',
        handler: () => {
          this.eventDataService.deleteEvent(this.event.key);

          alert.onDidDismiss(() => {
            this.navCtrl.pop();
          });
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

  private checkValidEvent(event: Event): string {
    if (event.title == "") {
      return "title";
    } else if (event.description == "") {
      return "description";
    } else if (this.res == undefined) {
      return "restaurant";
    } else {
      return undefined;
    }

  }

  private presentAlert(message) {
    const alert = this.alertCtrl.create({
      title: `${message} field is empty`,
      subTitle: 'Please fill it out😁',
      buttons: ['Got it!']
    });
    alert.present();
  }


}
