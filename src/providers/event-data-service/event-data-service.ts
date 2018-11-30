import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { environment } from '../../environment/environment';
import { Event } from '../../models/event';

/*
  Generated class for the EventDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventDataServiceProvider {
  private db: any;
  private events: Event[] = [];

  private serviceObserver: Observer<Event[]>;
  private clientObservable: Observable<Event[]>;

  constructor() {
    // create observer an observable
    this.clientObservable = Observable.create(observerThatWasCreated => {
      this.serviceObserver = observerThatWasCreated;
    })
    console.log("in observer constructor", typeof(this.serviceObserver));
    // initiate firebase
    firebase.initializeApp(environment.firebase);
    this.db = firebase.database();

    // retrieve data from firebase
    let listRef = this.db.ref('/events');
    listRef.on('value', snapshot => {
      this.events = [];
      snapshot.forEach(childSnapshot => {
        // copy a new entry
        let event: Event = {
          key: childSnapshot.key,
          title: childSnapshot.val().title,
          description: childSnapshot.val().description,
          post_date: childSnapshot.val().post_date,
          meet_date: childSnapshot.val().meet_date,
          start_time: childSnapshot.val().start_time,
          end_time: childSnapshot.val().end_time,
          restaurant: childSnapshot.val().restaurant,
          coming_people_ids: childSnapshot.val().coming_people_ids,
          pending_people_ids: childSnapshot.val().pending_people_ids,
          host_id: childSnapshot.val().host_id,
          image_url: childSnapshot.val().image_url
        };
        this.events.push(event);
        console.log("inservice");
        console.log(this.events);
      });
      // notify subscribers in all-event page to sync the update
      
      this.notifySubscribers();

    });
  }

  public getEvents(): Event[] {
    let eventsClone = JSON.parse(JSON.stringify(this.events)); // clone another entries to entriesClone
    // console.log("in function getEntries");
    // console.log(this.events);
    // console.log(eventsClone);
    return eventsClone;
  }

  public addEvent(event: Event) {
    if (event != undefined) {
      let listRef = this.db.ref('/events');
      let itemRef = listRef.push();
      let itemRecord = {
        title: event.title,
        description: event.description,
        post_date: new Date(event.post_date).getTime(),
        meet_date: new Date(event.meet_date).getTime(),
        start_time: new Date(event.start_time).getTime(),
        end_time: new Date(event.end_time).getTime(),
        restaurant: "", //to be changed to Restaurant model
        coming_people_ids: event.coming_people_ids,
        pending_people_ids: event.pending_people_ids,
        host_id: event.host_id,
        image_url: event.image_url
      }
      // console.log(itemRecord);
      itemRef.set(itemRecord);
    }
  }

  public getObservable(): Observable<Event[]> {
    return this.clientObservable;
  }

  private notifySubscribers(): void {
    this.serviceObserver.next(undefined);
  }

  public getDates(): string[]{
    let dateNums: string[] = [];

    for(let i = 0; i < this.events.length; i ++){
      let dateNum = this.events[i].meet_date;
      if (dateNums.indexOf(dateNum) > -1) {
        dateNums.push(dateNum);
      }
    }

    console.log(dateNums)

    return dateNums;
  }


}
