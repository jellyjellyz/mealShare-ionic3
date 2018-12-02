import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateEventPage } from '../create-event/create-event';
import {Event} from '../../models/event';
import {EventDataServiceProvider} from '../../providers/event-data-service/event-data-service';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';

@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {
  private events: Event[];
  private schedules: any[];
  private event_type: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public eventService: EventDataServiceProvider,
    public userService: UserDataServiceProvider) {
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
      console.log(this.schedules)
      this.event_type = "all";
    }


  private createEvent() {
    this.navCtrl.push(CreateEventPage);
  }

  public getUserImgById(userId) {
    if (this.userService.getUserById(userId) != undefined){
      let userImg = this.userService.getUserById(userId).img;
      // console.log(userImg);
      return userImg;
    }
  }




}
