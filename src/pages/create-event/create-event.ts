import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Event } from '../../models/event';
import { Restaurant } from '../../models/restaurtant';

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
    post_date: new Date(1514782800000).toISOString(),
    meet_date: new Date(1514782800000).toISOString(),
    start_time: new Date(1514804400000).toISOString(),
    end_time: new Date(1514826000000).toISOString(),
    restaurant: new Restaurant(),
    coming_people_ids: [],
    pending_people_ids: [],
    host_id: -1
  };
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventPage');
  }

  addEvent() {
    console.log(typeof(this.event.meet_date));
    console.log(this.event.start_time);
    console.log(this.event.end_time);
  }
}
