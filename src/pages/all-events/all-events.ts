import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import { Event } from '../../models/event';
import { Message } from '../../models/message';
// import { Restaurant } from '../../models/restaurtant';
import { EventDataServiceProvider } from '../../providers/event-data-service/event-data-service';
import { OrderByPipe } from '../../pipes/order-by/order-by';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { MessageDataServiceProvider } from '../../providers/message-data-service/message-data-service';

import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';


/**
 * Generated class for the AllEventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-events',
  templateUrl: 'all-events.html',
})
export class AllEventsPage {
  private myId;
  private myIdNum;

  // events: Array<Event> ;
  private events: any = [];
  private showEvents: Event[] = [];
  private messages: Message[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private eventService: EventDataServiceProvider,
    private userService: UserDataServiceProvider,
    private authService: AuthProvider,
    private alertCtrl: AlertController,
    private messageService: MessageDataServiceProvider
    ) {

      this.messageService.getObservable().subscribe(update => {
        this.messages = messageService.getMessages();
      });

    this.eventService.getObservable().subscribe(update => {
      this.events = eventService.getEvents();
      this.showEvents = eventService.getEvents();
      // this.events.post_date = new Date().getTime();
    })
    this.events = eventService.getEvents();
    this.showEvents = eventService.getEvents();
    // console.log(JSON.stringify(this.showEvents));


    // this.myId = "1";
    this.getLoginUserId().then(id => {
      this.myId = id;
      this.myIdNum = parseInt(this.myId);
    })
  }

  ionViewWillEnter() {
    this.events = this.eventService.getEvents();
    this.showEvents = this.eventService.getEvents();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AllEventsPage');
  }


  private todetail(eventKey: string) {
    this.navCtrl.push(EventDetailPage, {"eventKey": eventKey});
  }

  // TODO: use service to get data
  public getUserImg(userId) {
    if (userId !== "-1" && this.userService.getUserById(userId) != undefined) {
      let userImg = this.userService.getUserById(userId).img;
      // console.log(userImg);
      return userImg;
    } else {
      return "assets/imgs/no-avatar.png";
    }
  }

  // TODO
  private getUserName(host_id: string) {
    return this.userService.getUserNameById(host_id);
  }

  private getEvents(ev) {
    // Reset items back to all of the items
    this.showEvents = this.events;

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.showEvents = this.showEvents.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1
             || item.description .toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      })
    }
  }


  // some functions that are the same with in my-events.ts

  private getLoginUserId(): Promise<string> {
    return new Promise((resolve) => {
      this.authService.getCurrentUser().then((user) => { resolve(user.id) });
    })
  }

  public checkEventRelationshipsToMe(event: Event): string[] {

    let relations: string[] = [];

    if (event.host_id == this.myId) { // if I am the host
      relations.push("host");
    }
    if (event.coming_people_ids.indexOf(parseInt(this.myId)) > -1) { // if I am in the list of going people
      relations.push("going");
    }
    if (event.saved_people_ids.indexOf(parseInt(this.myId)) > -1) { // if I am in the list of  people who saved the event
      relations.push("saved");
    }
    if (event.pending_people_ids.indexOf(parseInt(this.myId)) > -1) { // if I am in the list of  people who pended the event
      relations.push("pending");
    }

    return relations;
  }


  // some functions that are the same with in my-events.ts WITH MODIFICATION
  public joinButtonClicked(event:Event){

    let relationships = this.checkEventRelationshipsToMe(event);

    if (relationships.indexOf('going') > -1 ){ //if already going, then retrieve
      this.presentConfirmNoGoing(relationships, event, this.myIdNum);
    } else if (relationships.indexOf('pending') > -1 ) { // if pending, then retrieve
      event.pending_people_ids.splice(event.pending_people_ids.indexOf(this.myIdNum),1);
    }else{ // the user ask to join, then get pending, and send message to the host
      event.pending_people_ids.push(this.myIdNum);
      this.messageService.sendMessage(event.key, this.myId, event.host_id,1);
    }

    if (relationships.indexOf('saved') > -1){ // if the user has saved the event, then delete from the saved list
      event.saved_people_ids.splice(event.saved_people_ids.indexOf(this.myIdNum),1)
    }

    this.eventService.updateEvent(event);
    this.messageService.sendMessage(event.key, this.myId, event.host_id, 1);
  }

  public saveButtonClicked(event:Event){
    let relationships = this.checkEventRelationshipsToMe(event);
    if (relationships.indexOf('saved') > -1){
      event.saved_people_ids.splice(event.saved_people_ids.indexOf(this.myIdNum),1);
    } else{
      event.saved_people_ids.push(this.myIdNum);
    }
    this.eventService.updateEvent(event);
  }


  private presentConfirmNoGoing(relationships:string[], event:Event, idNum:number) {
    let alert = this.alertCtrl.create({
      title: 'Not Going',
      message: 'Do you decide not to go?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: "Don't go",
          handler: () => {
            event.coming_people_ids.splice(event.coming_people_ids.indexOf(idNum),1);
            if(relationships.indexOf('pending') > -1 ){//in case the data is not clean enough (a user is both going and pending)
              event.pending_people_ids.splice(event.pending_people_ids.indexOf(idNum),1);
            }
            this.eventService.updateEvent(event);
          }
        }
      ]
    });
    alert.present();
  }



  // // TO BE Deleted
  // private getFakeEvents(): Event[] {
  //   return [
  //     {
  //       key: 0,
  //       title: "Mexican Food",
  //       description: "Hola! we are newcomers from Sales department. If you want to meet new friends and taste mexican food, join this group!!!",
  //       post_date: "1543453346630",
  //       meet_date: "1543712546000",
  //       start_time: "1543712546000",
  //       end_time: "1543712546000",
  //       restaurant: new Restaurant(),
  //       coming_people_ids: [2],
  //       pending_people_ids: [3],
  //       host_id: 1,
  //       image_url: "assets/imgs/chipotle.jpg"
  //     },
  //     {
  //       key: 1,
  //       title: "Piazza ad Piazza House, Join Me!",
  //       description: "Welcome all!!!",
  //       post_date: "1543366946000",
  //       meet_date: "1543712546000",
  //       start_time: "1543712546000",
  //       end_time: "1543712546000",
  //       restaurant: new Restaurant(),
  //       coming_people_ids: [1],
  //       pending_people_ids: [],
  //       host_id: 2,
  //       image_url: "assets/imgs/pizzahouse.jpg"
  //     },
  //     {
  //       key: 2,
  //       title: "Welcome!!!!",
  //       description: "Ramen are very popular noodle dishes in Japan, and boiled noodles are basically served in different flavored soup with many toppings. Come and taste it.",
  //       post_date: "1543366046000",
  //       meet_date: "1544490146000",
  //       start_time: "1544490146000",
  //       end_time: "1544490146000",
  //       restaurant: new Restaurant(),
  //       coming_people_ids: [2,3],
  //       pending_people_ids: [],
  //       host_id: 1,
  //       image_url: "assets/imgs/ramen.jpg"
  //     },
  //     {
  //       key: 3,
  //       title: "Salad Group",
  //       description: "Eat salad, be healthy, we could also fit together. Avocado Salad is my favorite, what about you guys? Come and join me!",
  //       post_date: "1543366046000",
  //       meet_date: "1544490146000",
  //       start_time: "1544490146000",
  //       end_time: "1544490146000",
  //       restaurant: new Restaurant(),
  //       coming_people_ids: [2,3],
  //       pending_people_ids: [],
  //       host_id: 1,
  //       image_url: "assets/imgs/salad.png"

  //     }

  //   ]
  // }

}
