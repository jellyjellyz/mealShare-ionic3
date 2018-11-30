import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Restaurant } from '../../models/restaurtant';
import { Http, Headers, RequestOptions } from '@angular/http';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import 'rxjs/add/operator/map';

/**
 * Generated class for the RestaurantSelectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-restaurant-selection',
  templateUrl: 'restaurant-selection.html',
})
export class RestaurantSelectionPage {

  private restaurants: Array<Restaurant>;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: Http, public loadingCtrl: LoadingController,
              private inAppBrowser: InAppBrowser) {
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad() {
    this.loading.present();
    let headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append("Authorization", 'Bearer W7x7s2mi6B6Aik_gXboxmBxo-mMuT7fT_tOa_-pzBPUpl81dxhvweTHzqcy3gMBBpKGUk7EDJ6_Qug9Z_DdqyYRQ1FWLFZAH9_wJuatDDX89dIn1AdpvJEVK-Dt0W3Yx');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    const requestOptions = new RequestOptions({ headers: headers });

    this.http.get('/api.yelp.com/v3/businesses/search?term=chipotle&latitude=42.299637&longitude=-83.709518', requestOptions)
      .map(res => res.json())
      .subscribe(data => {
        let rests = data['businesses'];
        this.restaurants = [];
        for(let temp of rests) {
          let res = new Restaurant();
          res.id = temp["id"];
          res.name = temp["name"];
          res.distance = temp["distance"];
          res.categories = temp["categories"][0]["title"];
          res.image_url = temp["image_url"];
          res.location = temp["location"]["display_address"];
          res.price = temp["price"];
          res.url = temp["url"];
          res.coordinates = { latitude: 0, longitude: 0 };
          res.coordinates.latitude = temp["coordinates"]["latitude"];
          res.coordinates.longitude = temp["coordinates"]["longitude"];
          this.restaurants.push(res);
        }
        this.loading.dismiss(); 
      }, err => {
        console.log(JSON.stringify(err));
      });
    console.log('ionViewDidLoad SelectionPage');

  }

  redirect(url: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no',
    }
    const browser = this.inAppBrowser.create(url, '_system', options);
    browser.show();
  }



}
