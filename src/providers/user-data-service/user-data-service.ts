import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';
import { environment } from '../../environment/environment';
import { User } from '../../models/user';
import { Group } from '../../models/group';
/*
  Generated class for the UserDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserDataServiceProvider {
	private db: any;
	private users: User[] = [];
	private groups: Group[] = [];
	private serviceObserver: Observer<any[]>;
	private clientObservable: Observable<any[]>;
	private nextID: number = 0;
  	constructor() {
	  	this.db = firebase.database();

	    // create observer and observable
	    this.clientObservable = Observable.create(observerThatWasCreated => {
	      this.serviceObserver = observerThatWasCreated;
	    });

	    // retrieve data from firebase
	  	let usersRef = this.db.ref('/users2');		
	  	usersRef.on('value', snapshot => {
    		this.users = []; //start with a blank list
    		snapshot.forEach(childSnapshot => {
	          	let user: User = { 
	  	          id: childSnapshot.val().id,
	  	          name: childSnapshot.val().name,
	  	          company: childSnapshot.val().company,
	  	          availability: childSnapshot.val().availability,
	  	          img: childSnapshot.val().img,
	  	          bio: childSnapshot.val().bio
	  	        };
	  	        console.log(user);
	      		this.users.push(user);	 
      		});
      		this.notifySubscribers();
	    });
	    let groupsRef = this.db.ref('/groups');	
	  	groupsRef.on('value', snapshot => {
    		this.groups = []; //start with a blank list
    		snapshot.forEach(childSnapshot => {
	          	let group: Group = { 
	  	          groupId: childSnapshot.val().groupId,
	  	          userIds: childSnapshot.val().userIds
	  	        };
	  	        console.log(group);
	      		this.groups.push(group);
	      	});		
	        // notify subscriber in home page to sync the update
	    	this.notifySubscribers();
	 	});

  	}
  	public getObservable(): Observable<any[]> {
    	return this.clientObservable;
  	}	
  	private notifySubscribers(): void {
    	this.serviceObserver.next(undefined);
  	}
	public getUsers(): User[] {
	    let usersClone = JSON.parse(JSON.stringify(this.users)); // clone another entries to entriesClone
	    return usersClone;
		}
		
	public getUserById(userId: number): User {
		for (let i = 0; i < this.users.length; i ++){
			if (this.users[i].id == userId){
				let userClone: User = JSON.parse(JSON.stringify(this.users[i]));
				return userClone;
			}
		}

	}


  	public getGroups(): Group[] {
	    let usersClone = JSON.parse(JSON.stringify(this.groups)); // clone another entries to entriesClone
	    return usersClone;
  	}

  	public addUsers() {
	    let listRef = this.db.ref('/users2');
	    let prefRef = listRef.push();
	    let dataRecord = [
      {
        id: 1,
	    name: "Woody",
	    company: "Google",
	    availability: true,
	    img: "assets/imgs/avatar-ts-woody.png",
	    bio: "How are you?",
      },
      {
        id: 2,
	    name: "Buzz Lightyear",
	    company: "Amazon",
	    availability: false,
	    img: "assets/imgs/avatar-ts-buzz.png",
	    bio: "Bonjour!",
      },
      {
        id: 3,
	    name: "Jessie",
	    company: "Microsoft",
	    availability: true,
	    img: "assets/imgs/avatar-ts-jessie.png",
	    bio: "Hello",
      },
      {
        id: 4,
	    name: "Mr. Potato Head",
	    company: "Uber",
	    availability: false,
	    img: "assets/imgs/avatar-ts-potatohead.png",
	    bio: "Have you had a meal today?",
      },
      {
        id: 5,
	    name: "Ariel",
	    company: "Waymo",
	    availability: true,
	    img: "https://2380ie25r0n01w5tt7mvyi81-wpengine.netdna-ssl.com/wp-content/uploads/2015/12/LA_SIRENITA_SERA%CC%81_RUBIA_joya_life.jpg",
	    bio: "Ariel has a distinctive appearance, with her long, flowing, bright red hair, blue eyes, green mermaid tail and purple seashell bikini top. In the films and television series, she is the seventh-born daughter of King Triton and Queen Athena of an underwater kingdom of Merfolk called Atlantica.[4][5] She is often rebellious, and in the first film, she longs to be a part of the human world. She marries Prince Eric, whom she rescued from a shipwreck, and together they have a daughter, Melody.",
      }];
	    prefRef.set(dataRecord);
  	}

}
