import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { Message } from '../../models/message';

// import { User } from '../../models/user';
// import { Event } from '../../models/event';
// import { UserDataServiceProvider } from '../user-data-service/user-data-service';
// import { EventDataServiceProvider } from '../event-data-service/event-data-service';
/*
  Generated class for the MessageDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
@Injectable()
export class MessageDataServiceProvider {
	private db: any;
	private nextMessageID: number = 0;
	private messages: Message[] = [];
	// private users: User[] = [];
	// private events: Event[] = [];
	private serviceObserver: Observer<any[]>;
	private clientObservable: Observable<any[]>;
	private myId: string;

	// private nextID: number = 0;
	constructor() {
		this.db = firebase.database();

		// create observer and observable
		this.clientObservable = Observable.create(observerThatWasCreated => {
			this.serviceObserver = observerThatWasCreated;
		});
		// retreive messages data from firebase
		this.receiveMessage();

		// retreive nextMessageID from firebase
		let ref = this.db.ref('/nextMessageID');
		ref.on('value', snapshot => {
			this.nextMessageID = snapshot.val();
		});

		// this.myId = "1";
		this.getLoginUserId().then(id => {
			this.myId = id;
		})

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
		ref.update({ nextMessageId: this.nextMessageID });
		return uniqueID;
	}

	public getMessages(): Message[] {
		let messagesClone = JSON.parse(JSON.stringify(this.messages)); // clone another entries to entriesClone
		return messagesClone;
	}

	// send message
	public sendMessage(eventId: string, senderId: string, receiverId: string, messageType: number) {
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
		this.notifySubscribers();
	}

	// receive message
	private receiveMessage() {
		let ref = this.db.ref('/messages');
		ref.on('value', snapshot => {
			this.messages = []; //start with a blank list
			snapshot.forEach(childSnapshot => {
				if (childSnapshot.val().receiverId == this.myId) {
					let message: Message = {
						messageId: childSnapshot.val().messageId,
						eventId: childSnapshot.val().eventId,
						senderId: childSnapshot.val().senderId,
						receiverId: childSnapshot.val().receiverId,
						messageType: childSnapshot.val().messageType
					};
					// console.log(1);
					// console.log(message);
					this.messages.push(message);
				}
			});
			// this.notifySubscribers();
			// console.log(2);
			// console.log(this.messages);
		});
		//  	console.log(3);
		// console.log(this.messages);

	}
	public updateEvent(eventId: string, attribute: string, value: any) {
		let ref = this.db.ref('/events').child(eventId);
		ref.update({ [attribute]: value });
	}
	// click message
	// when user clicks a message, it will redirect to event detail page
	// private clickMessage() {
	// }

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
