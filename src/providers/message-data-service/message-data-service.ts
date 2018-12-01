import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { Event } from '../../models/event'; 
import { User } from '../../models/user'; 
import { UserDataServiceProvider } from '../user-data-service/user-data-service';
import { EventDataServiceProvider } from '../event-data-service/event-data-service';
/*
  Generated class for the MessageDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageDataServiceProvider {
  	private events: Event[] = [];
  	private users: User[] = [];
  	private db: any;
	// private users: User[] = [];
	// private groups: Group[] = [];
	private serviceObserver: Observer<any[]>;
	private clientObservable: Observable<any[]>;
	// private nextID: number = 0;
	constructor(private userService: UserDataServiceProvider,
				private eventService: EventDataServiceProvider) {
		this.db = firebase.database();

	    // create observer and observable
	    this.clientObservable = Observable.create(observerThatWasCreated => {
	      this.serviceObserver = observerThatWasCreated;
	    });

	    // retreive events and users data from firebase
	   	this.eventService.getObservable().subscribe(update => {
      		this.events = eventService.getEvents();
  		});
	  	this.userService.getObservable().subscribe(update => {
      		this.users = userService.getUsers();
  		});


	}

	// 1: request to join (host)
	// -- press "join", push event to message.ts, get  
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
