import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { Message } from '../../models/message';

/*
  Generated class for the MessageDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
@Injectable()
export class MessageDataServiceProvider {
	private db: any;
	private messages: Message[] = [];
	private serviceObserver: Observer<any[]>;
	private clientObservable: Observable<any[]>;
	private myId: string;

	constructor() {
		this.db = firebase.database();

		// create observer and observable
		this.clientObservable = Observable.create(observerThatWasCreated => {
			this.serviceObserver = observerThatWasCreated;
		});
		// retreive messages data from firebase
		this.receiveMessage();

		this.getLoginUserId().then(id => {
			this.myId = id;
		})

	}

	public getObservable(): Observable<any[]> {
		return this.clientObservable;
	}

	private notifySubscribers(): void {
		this.serviceObserver.next(undefined);
	}

	public getMessages(): Message[] {
		let messagesClone = JSON.parse(JSON.stringify(this.messages)); // clone another entries to entriesClone
		return messagesClone;
	}

	// send message
	public sendMessage(eventId: string, senderId: string, receiverId: string, messageType: number) {
		let listRef = this.db.ref('/messages');
		let prefRef = listRef.push();
		let message = {
			messageId: 1,
			eventId: eventId,
			senderId: senderId,
			receiverId: receiverId,
			messageType: messageType
		}
		prefRef.set(message);
		console.log(message);
	}

	// receive message
	private receiveMessage() {
		let messageRef = this.db.ref('/messages');
		messageRef.on('value', snapshot => {
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
