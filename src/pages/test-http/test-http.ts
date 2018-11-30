import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Restaurant } from '../../models/restaurtant';

/**
 * Generated class for the TestHttpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-http',
  templateUrl: 'test-http.html',
})
export class TestHttpPage {
  url: string;
  data: string;
  restaurant: Restaurant;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestHttpPage');
  }

  request() {
    let headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append("Authorization", 'Bearer W7x7s2mi6B6Aik_gXboxmBxo-mMuT7fT_tOa_-pzBPUpl81dxhvweTHzqcy3gMBBpKGUk7EDJ6_Qug9Z_DdqyYRQ1FWLFZAH9_wJuatDDX89dIn1AdpvJEVK-Dt0W3Yx');
    headers.append('Accept', 'application/json');
    headers.append('content-type','application/json');
    
    const requestOptions = new RequestOptions({ headers: headers });

    this.http.get('/api.yelp.com/v3/businesses/search?term=chipotle&latitude=42.299637&longitude=-83.709518', requestOptions)
      .map(res => res.json())
      .subscribe(data => {
        let temp = data['businesses'][0];
        console.log(temp["id"]);
        this.restaurant = new Restaurant();
        this.restaurant.id = temp["id"];
        this.restaurant.name = temp["name"];
        this.restaurant.distance = temp["distance"];
        this.restaurant.categories = temp["categories"][0]["title"];
        this.restaurant.image_url = temp["image_url"];
        this.restaurant.location = temp["location"]["display_address"];
        this.restaurant.price = temp["price"];
        this.restaurant.url = temp["url"];
        this.restaurant.coordinates = {latitude: 0, longitude: 0};
        this.restaurant.coordinates.latitude = temp["coordinates"]["latitude"];
        this.restaurant.coordinates.longitude = temp["coordinates"]["longitude"];
      }, err => {
        console.log(JSON.stringify(err));
      });
  }

}
