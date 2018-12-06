import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'firebase/database';
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
  private myId: string;

  private serviceObserver: Observer<Event[]>;
  private clientObservable: Observable<Event[]>;

  constructor() {
    // create observer an observable
    this.clientObservable = Observable.create(observerThatWasCreated => {
      this.serviceObserver = observerThatWasCreated;
    })

    // initiate firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }

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
          image_url: childSnapshot.val().image_url,
          saved_people_ids: childSnapshot.val().saved_people_ids,
        };
        this.events.push(event);

      });
      // notify subscribers in all-event page to sync the update

      //sort this.events chronologically -- use pipe in html
      // this.events.sort((a, b) => Number(a.start_time) - Number(b.start_time))

      this.notifySubscribers();



    });

    this.getLoginUserId().then(id => {
      this.myId = id;
    })
  }

  public getEvents(): Event[] {
    let eventsClone = JSON.parse(JSON.stringify(this.events)); // clone another entries to entriesClone
    // console.log("in function getEntries");
    // console.log(this.events);
    // console.log(eventsClone);
    return eventsClone;
  }

  public updateEvent(event: Event) {
    let parentRef = this.db.ref(`/events/`);
    let childRef = parentRef.child(event.key);
    let cloneEvent = {
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
      image_url: event.image_url,
      saved_people_ids: event.saved_people_ids
    }
    // console.log(JSON.stringify(event));
    childRef.set(cloneEvent);
    // this.notifySubscribers();
  }

  public addEvent(event: Event) {
    if (event != undefined) {
      let listRef = this.db.ref(`/events`);
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
        image_url: event.image_url,
        saved_people_ids: event.saved_people_ids
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
    if (this.serviceObserver === undefined) {
      // create observer and observable
      this.clientObservable = Observable.create(observerThatWasCreated => {
        this.serviceObserver = observerThatWasCreated;
      });
    }
    this.serviceObserver.next(undefined);
  }

  public getSchedule(): any[] {
    let dateNums: number[] = []; // used to check if a date already eaxists in scheduleItems
    let scheduleItems: any[] = []; // [{date:1432535, events: [{events[i]}, ...]}, ...]
    let events: Event[] = this.getEvents();

    for (let i = 0; i < events.length; i++) {
      let dateNum = events[i].meet_date;

      if (dateNums.indexOf(dateNum) == -1) { // if the date is not in schedule, then create a new array under the date with this event
        dateNums.push(dateNum);

        let newSchedule = {};
        newSchedule['date'] = dateNum;
        newSchedule['relationships'] = [];
        newSchedule['relationships'].push(this.checkEventRelationshipToMe(events[i], this.myId));
        newSchedule['events'] = [];
        newSchedule['events'].push(events[i]);

        scheduleItems.push(newSchedule);
      } else if (dateNums.indexOf(dateNum) > -1) { // if the sate exists, then push the event into the array
        for (let j = 0; j < scheduleItems.length; j++) {
          if (scheduleItems[j].date == dateNum) {
            let relationship = this.checkEventRelationshipToMe(events[i], this.myId);
            if (scheduleItems[j].relationships.indexOf(relationship) == -1) { // if there's no such relationship before, now add it
              scheduleItems[j].relationships.push(relationship)
            }
            scheduleItems[j].events.push(events[i])
          }
        };
      }
    }
    // console.log("in devide schedual",JSON.stringify(scheduleItems));
    return scheduleItems;
  }


  private checkEventRelationshipToMe(event: Event, myId = "1"): string {
    if (event.host_id == myId) { // if I am the host
      return "host";
    } else if (event.coming_people_ids.indexOf(myId) > -1) { // if I am in the list of going people
      return "going";
    } else if (event.saved_people_ids != undefined) {
      if (event.saved_people_ids.indexOf(myId) > -1) { // if I am in the list of  people who saved the event
        return "saved";
      }
    } else {
      return "else";
    }
  }

  public deleteEvent(eventKey: string) {
    let parentRef = this.db.ref('/events');
    let childRef = parentRef.child(eventKey);
    childRef.remove();
    return;
  }

  private getLoginUserId(): Promise<string> {
    return new Promise((resolve) => {
      this.getCurrentUser().then((user) => { resolve(user.id) });
    })
  }
  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function (user) {
        let userModel = {
          id: "",
          name: "",
          email: "",
        };
        if (user) {
          userModel.name = user.displayName;
          userModel.email = user.email;
          if (user.uid == "IleDWkpCJ6ZcQjgokdi8mS689W92") {
            userModel.id = "1";
            return resolve(userModel);
          } else {
            userModel.id = user.uid;
            return resolve(userModel);
          }

        } else {
          reject('No user logged in');
        }
      })
    })
  }


}
