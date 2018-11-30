import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

import { RestaurantDetailPage } from '../restaurant-detail/restaurant-detail';
import { Restaurants, Restaurant } from '../../models/restaurtant';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

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
  loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: Http, private inAppBrowser: InAppBrowser,
    public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create();

  }

  ionViewDidLoad() {
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

  getData(): Promise<Restaurants> {
    return this.http.get('./assets/example-data/restaurants.json')
      .toPromise()
      .then(response => response.json() as Restaurants)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  redirect(url: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no',
    }
    const browser = this.inAppBrowser.create(url, '_system', options);
    browser.show();
  }

}
