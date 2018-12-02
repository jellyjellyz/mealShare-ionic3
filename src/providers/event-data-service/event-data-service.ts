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
        console.log(this.events);
      });
      // notify subscribers in all-event page to sync the update

      //sort this.events chronologically
      this.events.sort((a,b) => Number(a.start_time) - Number(b.start_time))
      
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
        restaurant: event.restaurant, 
        coming_people_ids: event.coming_people_ids,
        pending_people_ids: event.pending_people_ids,
        host_id: event.host_id,
        image_url: event.image_url
      }
      // console.log(itemRecord);
      itemRef.set(itemRecord);
    }
  }

  public getEventById(eventId: string) {
    let parentRef = this.db.ref('/events');
    let childRef = parentRef.child(eventId);
    return childRef.once('value');
  }

  public getObservable(): Observable<Event[]> {
    return this.clientObservable;
  }

  private notifySubscribers(): void {
    this.serviceObserver.next(undefined);
  }

  public getSchedule(): string[]{
    let dateNums: string[] = []; // used to check if a date already eaxists in scheduleItems
    let scheduleItems: any[] = []; // [{date:1432535, events: [{events[i]}, ...]}, ...]


    for(let i = 0; i < this.events.length; i ++){
      let dateNum = this.events[i].meet_date;

      if (dateNums.indexOf(dateNum) == -1) { // if the date is not in schedule, then create a new array under the date with this event
        dateNums.push(dateNum);

        let newSchedule = {};
        newSchedule['date'] = dateNum;
        newSchedule['events'] = [];
        newSchedule['events'].push(this.events[i]);

        scheduleItems.push(newSchedule);
      } else if (dateNums.indexOf(dateNum) > 1) { // if the sate exists, then push the event into the array
        for(let j = 0; j < scheduleItems.length; j ++){
          if(scheduleItems[j].date == dateNum){
            scheduleItems[j].events.push(this.events[i])
          }
        };
      }
    }

    // console.log(dateNums)
    return scheduleItems;
  }


}
