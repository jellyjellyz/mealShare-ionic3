import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Restaurants, Restaurant } from '../../models/restaurtant';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

/**
 * Generated class for the RestaurantDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-restaurant-detail',
  templateUrl: 'restaurant-detail.html',
})
export class RestaurantDetailPage {

  res: any = {};
  loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: Http, private inAppBrowser: InAppBrowser,
    public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create();
    this.getData()
      .then(data => {
        this.res = data.restaurants[0];
        console.log(this.res.price);
      });
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantDetailPage');
  }

}
