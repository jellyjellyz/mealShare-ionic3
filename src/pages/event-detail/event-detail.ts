import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { Restaurants, Restaurant } from '../../models/restaurtant';
import { Event } from '../../models/event';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { EventDataServiceProvider } from '../../providers/event-data-service/event-data-service';
import { resolveDefinition } from '@angular/core/src/view/util';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { User } from '../../models/user';


/**
 * Generated class for the EventDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {

  res: any = {}; // TODO: change it to corresponding data model
  private loading: any;
  private eventKey: string;
  private event: Event;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: Http, private inAppBrowser: InAppBrowser,
    public loadingCtrl: LoadingController,
    public eventService: EventDataServiceProvider, public userService: UserDataServiceProvider) {

    this.loading = this.loadingCtrl.create();
    this.eventKey = this.navParams.get("eventKey");
    eventService.getEventById(this.eventKey).then(snapshot => {
      this.event = {
        key: snapshot.key,
        title: snapshot.val().title,
        description: snapshot.val().description,
        post_date: snapshot.val().post_date,
        meet_date: snapshot.val().meet_date,
        start_time: snapshot.val().start_time,
        end_time: snapshot.val().end_time,
        restaurant: snapshot.val().restaurant,
        coming_people_ids: snapshot.val().coming_people_ids,
        pending_people_ids: snapshot.val().pending_people_ids,
        host_id: snapshot.val().host_id,
        image_url: snapshot.val().image_url,
        saved_people_ids:["9999999999999999999"] // it seems an empty array would not be saved to Firebase

      }
      // console.log(JSON.stringify(this.event));
    });
  }


  ionViewWillEnter() {
    this.loading.present();
    this.getData()
      .then(data => {
        this.res = data.restaurants[0];
        this.loading.dismiss();
      });
  }

  private gotoRestDetail() {
    this.navCtrl.push(RestaurantDetailPage);
  }

  private getData(): Promise<Restaurants> {
    return this.http.get('./assets/example-data/restaurants.json')
      .toPromise()
      .then(response => response.json() as Restaurants)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private redirect(url: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no',
    }
    const browser = this.inAppBrowser.create(url, '_system', options);
    browser.show();
  }

  private getUserById(userId: number): User {
    return this.userService.getUserById(userId);
  }

}
