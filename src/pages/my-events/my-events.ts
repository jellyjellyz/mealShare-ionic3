import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateEventPage } from '../create-event/create-event';
import { MessagePage } from '../message/message';
import { Event } from '../../models/event';
import { EventDataServiceProvider } from '../../providers/event-data-service/event-data-service';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { MessageDataServiceProvider } from '../../providers/message-data-service/message-data-service';
import { OrderByPipe } from '../../pipes/order-by/order-by';
import { EventDetailPage } from '../event-detail/event-detail';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {
  private myId;
  private myIdNum;
  private events: Event[];
  private schedules: any[];
  private event_type: string;
  private segment: string = "host";

  // public joined: boolean = false;
  // public saved: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public eventService: EventDataServiceProvider,
    public userService: UserDataServiceProvider,
    public messageService: MessageDataServiceProvider,
    private authService: AuthProvider) {
    this.eventService.getObservable().subscribe(update => {
      // this.events = this.eventService.getEvents();
      this.schedules = this.eventService.getSchedule();
      // console.log(this.events);
      console.log(this.schedules);
      // console.log(this.events);

      // console.log("get schedule", JSON.stringify(this.schedules));
    });

    this.userService.getObservable().subscribe(update => {
      // this.events = this.eventService.getEvents();
      // this.schedules = this.eventService.getSchedule();
      // console.log(this.events);
      // console.log(this.schedules);
    });

    // this.events = this.eventService.getEvents();
    this.schedules = this.eventService.getSchedule();
    this.event_type = "all";

    // this.myId = "1";
    this.getLoginUserId().then(id => {
      this.myId = id;
      this.myIdNum = parseInt(this.myId);
    })
  }

  ionViewWillEnter() {
    this.schedules = this.eventService.getSchedule();
  }

  private todetail(eventKey: string) {
    this.navCtrl.push(CreateEventPage, { "eventKey": eventKey });
  }

  private toViewdetail(eventKey: string) {
    this.navCtrl.push(EventDetailPage, { "eventKey": eventKey });
  }

  private createEvent() {
    this.navCtrl.push(CreateEventPage);
  }

  private joinEvent(event: Event) {
    this.messageService.sendMessage(event.key, this.myId, event.host_id, 1);
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

  public checkEventRelationshipsToMe(event: Event): string[] {
    // console.log(event.host_id == this.myId)
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
    // console.log(event.coming_people_ids)
    return relations;
  }

  private getLoginUserId(): Promise<string> {
    return new Promise((resolve) => {
      this.authService.getCurrentUser().then((user) => { resolve(user.id) });
    })
  }


  public joinButtonClicked(event:Event){
    let relationships = this.checkEventRelationshipsToMe(event);

    if (relationships.indexOf('going') > -1 ){
      event.coming_people_ids.splice(event.coming_people_ids.indexOf(this.myIdNum),1)
    }else{
      event.coming_people_ids.push(this.myIdNum);
    }
    this.eventService.updateEvent(event);
  }

  public saveButtonClicked(event:Event){
    let relationships = this.checkEventRelationshipsToMe(event);
    if (relationships.indexOf('saved') > -1 ){
      event.saved_people_ids.splice(event.saved_people_ids.indexOf(this.myIdNum),1)
    }else{
      event.saved_people_ids.push(this.myIdNum);
    }
    this.eventService.updateEvent(event);
  }

}