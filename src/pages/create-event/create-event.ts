import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Event } from '../../models/event';
import { Group } from '../../models/group';
import { Restaurant } from '../../models/restaurtant';
import { AllEventsPage } from '../all-events/all-events';
import { EventDataServiceProvider } from '../../providers/event-data-service/event-data-service';
import { RestaurantSelectionPage } from '../restaurant-selection/restaurant-selection';
import { InvitegroupPage } from '../invitegroup/invitegroup';

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

  private event: Event = new Event();
  private res: Restaurant;
  private checkedGroup: Group;

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private eventDataService: EventDataServiceProvider) {

    // observer only creates when someone subscribe to it,
    // i.e. if not subscribe it here, if no one subscribe to it before
    // there will be no observer, 
    // at this time, if call notify subscribers, it will break annoyingly. 
    this.eventDataService.getObservable().subscribe(update => {
    })

    let eventKey = this.navParams.get("eventKey");
    if (eventKey === undefined) {
      this.event = {
        key: 0,
        title: "",
        description: "",
        post_date: new Date().toISOString(),
        meet_date: new Date().toISOString(),
        start_time: new Date(1514808000000).toISOString(),
        end_time: new Date(1514808000000).toISOString(),
        restaurant: new Restaurant(),
        coming_people_ids: [2, 3, 4],
        pending_people_ids: [6, 10],
        host_id: 2,
        image_url: "",
        saved_people_ids:[9999999999999999999] // it seems an empty array would not be saved to Firebase
      };
    };

  }

  ionViewWillEnter() {
    this.res = this.navParams.get('restaurant') || undefined;
    this.checkedGroup = this.navParams.get('group') || undefined;

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad CreateEventPage');
  }

  addEvent() {

    // console.log(this.event.meet_date);

    console.log(this.event.start_time);
    this.event.restaurant = this.res;
    this.event.image_url = this.res.image_url;
    this.eventDataService.addEvent(this.event);
    this.navCtrl.push(AllEventsPage);
  }

  private toSelectRestaurant() {
    this.navCtrl.push(RestaurantSelectionPage);
  }

   private toInviteGroup() {
    this.navCtrl.push(InvitegroupPage);
  }


}
