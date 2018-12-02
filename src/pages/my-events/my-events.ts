import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateEventPage } from '../create-event/create-event';
import { MessagePage } from '../message/message';
import { Event } from '../../models/event';
import { EventDataServiceProvider } from '../../providers/event-data-service/event-data-service';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { MessageDataServiceProvider } from '../../providers/message-data-service/message-data-service';


@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {
  private myId: number = 1;
  private events: Event[];
  private schedules: any[];
  private event_type: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public eventService: EventDataServiceProvider,
    public userService: UserDataServiceProvider,
    public messageService: MessageDataServiceProvider) {
      this.eventService.getObservable().subscribe(update => {
        this.events = this.eventService.getEvents();
        this.schedules = this.eventService.getSchedule();
        console.log(this.events);
        console.log(this.schedules);
      });

      this.userService.getObservable().subscribe(update => {
        // this.events = this.eventService.getEvents();
        // this.schedules = this.eventService.getSchedule();
        // console.log(this.events);
        // console.log(this.schedules);
      });

      this.events = this.eventService.getEvents();
      this.schedules = this.eventService.getSchedule();
      this.event_type = "all";
    }


  private createEvent() {
    this.navCtrl.push(CreateEventPage);
  }

  private joinEvent(event: Event) {
    this.messageService.sendMessage(Number(event.key), this.myId, event.host_id, 1);
  }

  public getUserImgById(userId) {
    if (this.userService.getUserById(userId) != undefined){
      let userImg = this.userService.getUserById(userId).img;
      // console.log(userImg);
      return userImg;
    }
  }

  public checkEventRelationshipToMe(event: Event): string{
    if ( event.host_id == 1) { // if I(1) am the host
        return "host";
    } else if ( event.coming_people_ids.indexOf(1) > -1 ) { // if I(1) am in the list of going people
        return "going";

    } else if ( event.saved_people_ids.indexOf(1) > -1 ) { // if I(1) am in the list of  people who saved the event
        return "saved";
    }
    
  }

}
