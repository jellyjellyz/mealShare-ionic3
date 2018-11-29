import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import { Event } from '../../models/event';
import { Restaurant } from '../../models/restaurtant';

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

  events: Array<Event>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.events = this.getFakeEvents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllEventsPage');
  }

  // getFakeEvents() {
  //   return 
  // }

  private todetail() {
    this.navCtrl.push(EventDetailPage);
  }

}
