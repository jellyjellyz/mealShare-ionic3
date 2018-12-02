import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { Event } from '../../models/event'; 
import { User } from '../../models/user'; 
import { Message } from '../../models/message'; 
import { UserDataServiceProvider } from '../user-data-service/user-data-service';
import { EventDataServiceProvider } from '../event-data-service/event-data-service';
/*
  Generated class for the MessageDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class MessageDataServiceProvider {
 	private nextMessageID: number = 0;
  	private events: Event[] = [];
  	private users: User[] = [];
  	private messages: Message[] = [];
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

  		// retreive events data from firebase
  		this.eventService.getObservable().subscribe(update => {
  			this.events = eventService.getEvents();
  		});
  		// retreive users data from firebase
  		this.userService.getObservable().subscribe(update => {
  			this.users = userService.getUsers();
  		});
  		// retreive messages data from firebase
  		this.receiveMessage();

  		// retreive nextMessageID from firebase
  		let ref = this.db.ref('/nextMessageID');
		ref.on('value', snapshot => {
		    this.nextMessageID = snapshot.val();
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

  	private getNextMessageId(): number {
  		let uniqueID = this.nextMessageID++;
  		let ref = this.db.ref('/');
	    ref.update({nextMessageId: this.nextMessageID});
	    return uniqueID;
  	}

  	public getMessages(): Message[] {
	    let usersClone = JSON.parse(JSON.stringify(this.messages)); // clone another entries to entriesClone
	    return usersClone;
  	}

  	// send message
  	public sendMessage(eventId: number, senderId: number, receiverId: number, messageType: number) {
  		let listRef = this.db.ref('/messages');
  		let prefRef = listRef.push();
  		let dataRecord = {
  			messageId: this.getNextMessageId(),
  			eventId: eventId,
  			senderId: senderId,
  			receiverId: receiverId,	
  			messageType: messageType
  		}
  		prefRef.set(dataRecord);
  	}

  	// receive message
  	private receiveMessage() {
	  	let ref = this.db.ref('/messages');	
	  	ref.on('value', snapshot => {
    		this.messages = []; //start with a blank list
    		snapshot.forEach(childSnapshot => {
	          	let message: Message = {
	          	  messageId: childSnapshot.val().messageId,
	  	          eventId: childSnapshot.val().eventId,
	  	          senderId: childSnapshot.val().senderId,
	  	          receiverId: childSnapshot.val().receiverId,
	  	          messageType: childSnapshot.val().messageType
	  	        };
	  	        console.log(1);
	  	        console.log(message);
	      		this.messages.push(message);	 
      		});
      		console.log(2);
      		console.log(this.messages);

		});
      	// this.notifySubscribers();
      	console.log(3);
	    console.log(this.messages);
	    
  	}

  	// click message
	// when user clicks a message, it will redirect to event detail page
	private clickMessage() {
	}
}


