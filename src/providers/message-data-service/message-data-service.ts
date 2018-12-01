import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { Event } from '../../models/event'; 

/*
  Generated class for the MessageDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageDataServiceProvider {
  	private events: Event[] = [];
  	private db: any;
	// private users: User[] = [];
	// private groups: Group[] = [];
	private serviceObserver: Observer<any[]>;
	private clientObservable: Observable<any[]>;
	// private nextID: number = 0;
	constructor() {
		this.db = firebase.database();

	    // create observer and observable
	    this.clientObservable = Observable.create(observerThatWasCreated => {
	      this.serviceObserver = observerThatWasCreated;
	    });

	    // retrieve data from firebase
	  	let usersRef = this.db.ref('/events');		
	  	usersRef.on('value', snapshot => {
    		this.events = []; //start with a blank list
    		snapshot.forEach(childSnapshot => {
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
      		});
      		console.log(this.events);
      		this.notifySubscribers();
	    });
	}

	// 1: request to join (host)
	// 2: accept invite (host)
	// 3: reject invite (host)
	// 4: receive invite (participant)	

	
	public getObservable(): Observable<any[]> {
    	return this.clientObservable;
  	}	
  	private notifySubscribers(): void {
    	this.serviceObserver.next(undefined);
  	}

  	// send message
	private sendMessage() {

	}

	// click message
	// when user clicks a message, it will redirect to event detail page
	private clickMessage() {

	}

}
