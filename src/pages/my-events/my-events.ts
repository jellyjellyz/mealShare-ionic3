import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateEventPage } from '../create-event/create-event';
import {Event} from '../../models/event';
import {EventDataServiceProvider} from '../../providers/event-data-service/event-data-service';

@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {
  private events: Event[];
  private dates: any[];
  private event_type: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventService: EventDataServiceProvider) {
    this.eventService.getObservable().subscribe(update => {
      this.events = this.eventService.getEvents();
      this.dates = this.eventService.getDates();
      console.log(this.events);
    });

    this.events = this.eventService.getEvents();
    this.dates = this.eventService.getDates();
    this.event_type = "all";
  }


  private createEvent() {
    this.navCtrl.push(CreateEventPage);
  }


}
