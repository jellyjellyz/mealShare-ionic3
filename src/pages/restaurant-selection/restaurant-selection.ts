import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Restaurant } from '../../models/restaurtant';
import { Http, Headers, RequestOptions } from '@angular/http';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
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
  private loading: any;
  private checkedRestaurantId: string;
  private checkedRestaurant: Restaurant;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http, public loadingCtrl: LoadingController,
    private inAppBrowser: InAppBrowser, private geolocation: Geolocation) {
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad() {
    this.loading.present();
    let headers = new Headers();
    const requestOptions = new RequestOptions({ headers: headers });

    let geoOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };
    this.geolocation.getCurrentPosition(geoOptions).then((resp) => {
      let lat = resp.coords.latitude;
      let lon = resp.coords.longitude;

      headers.append("Access-Control-Allow-Origin", "*");
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      headers.append("Authorization", 'Bearer W7x7s2mi6B6Aik_gXboxmBxo-mMuT7fT_tOa_-pzBPUpl81dxhvweTHzqcy3gMBBpKGUk7EDJ6_Qug9Z_DdqyYRQ1FWLFZAH9_wJuatDDX89dIn1AdpvJEVK-Dt0W3Yx');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');


      this.http.get(`/api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}`, requestOptions)
        .map(res => res.json())
        .subscribe(data => {
          let rests = data['businesses'];
          this.restaurants = [];
          for (let temp of rests) {
            let res = new Restaurant();
            res.id = temp["id"];
            res.name = temp["name"];
            res.distance = Math.round(temp["distance"] * 0.01) / 10;
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

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    console.log('ionViewDidLoad SelectionPage');

  }

  private redirect(url: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no',
    }
    const browser = this.inAppBrowser.create(url, '_system', options);
    browser.show();
  }


  private checkCardIsunSelected(id: string) {
    if (this.checkedRestaurantId !== undefined && id !== this.checkedRestaurantId) {
      return true;
    }
    return false;
  }

  private saveRestaurant() {
    this.checkedRestaurant = this.restaurants.find((ele) => {return ele.id === this.checkedRestaurantId});
    // console.log(JSON.stringify(this.checkedRestaurant));
    this.navCtrl.getPrevious().data.restaurant = this.checkedRestaurant;
    this.navCtrl.pop();
  }

}
