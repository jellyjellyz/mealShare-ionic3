import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import { Event } from '../../models/event';
import { Message } from '../../models/message';
import { Restaurant } from '../../models/restaurtant';
import { EventDataServiceProvider } from '../../providers/event-data-service/event-data-service';
import { OrderByPipe } from '../../pipes/order-by/order-by';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { MessageDataServiceProvider } from '../../providers/message-data-service/message-data-service';
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

  // events: Array<Event> ;
  private events: any = [];
  private showEvents: Event[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private eventService: EventDataServiceProvider,
    private userService: UserDataServiceProvider,
    private messageService: MessageDataServiceProvider,
    private authService: AuthProvider) {

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

    return relations;
  }


  // some functions that are the same with in my-events.ts WITH MODIFICATION
  public joinButtonClicked(event:Event){
    let relationships = this.checkEventRelationshipsToMe(event);
    // console.log(this.checkEventRelationshipsToMe(event))
    let myIndex = event.coming_people_ids.indexOf(this.myId);
    // console.log(event.coming_people_ids);
    if (relationships.indexOf('going') > -1){
      event.coming_people_ids.splice(myIndex,1);
    } else{
      event.coming_people_ids.push(parseInt(this.myId));
    }
    // console.log(event.coming_people_ids);
    this.eventService.updateEvent(event);
    this.messageService.sendMessage(event.key, this.myId, event.host_id, 1);
  }

  public saveButtonClicked(event:Event){
    let relationships = this.checkEventRelationshipsToMe(event);
    let myIndex = event.coming_people_ids.indexOf(this.myId);
    if (relationships.indexOf('saved') > -1){
      event.saved_people_ids.splice(myIndex,1);
    } else{
      event.saved_people_ids.push(parseInt(this.myId));
    }
    this.eventService.updateEvent(event);
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
