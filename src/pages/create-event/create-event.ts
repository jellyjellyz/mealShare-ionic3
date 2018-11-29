import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Event } from '../../models/event';
import { Restaurant } from '../../models/restaurtant';
import { AllEventsPage, events } from '../all-events/all-events';

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

  private event: Event = {
    title: "",
    description: "",
    post_date: new Date().toISOString(),
    meet_date: new Date().toISOString(),
    start_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    restaurant: new Restaurant(),
    coming_people_ids: [],
    pending_people_ids: [],
    host_id: 2,
    image_url: "assets/imgs/ramen.jpg"
  };
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventPage');
  }

  addEvent() {
    events.push(this.event);
    console.log(events.length);
    this.navCtrl.push(AllEventsPage, {events});
  }

}
