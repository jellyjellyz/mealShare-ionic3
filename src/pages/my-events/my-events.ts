import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateEventPage } from '../create-event/create-event';
import { MessagePage } from '../message/message';
import { Event } from '../../models/event';
import { EventDataServiceProvider } from '../../providers/event-data-service/event-data-service';
import { UserDataServiceProvider } from '../../providers/user-data-service/user-data-service';
import { MessageDataServiceProvider } from '../../providers/message-data-service/message-data-service';
import { OrderByPipe } from '../../pipes/order-by/order-by';
import { EventDetailPage } from '../event-detail/event-detail';
import { AuthProvider } from '../../providers/auth/auth';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {
  private myId;
  private myIdNum;
  private events: Event[];
  private schedules: any[];
  private event_type: string;
  private segment: string = "host";
  private messages: Message[] = [];
  private users: User[] = [];


  // public joined: boolean = false;
  // public saved: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public eventService: EventDataServiceProvider,
    public userService: UserDataServiceProvider,
    public messageService: MessageDataServiceProvider,
    private alertCtrl: AlertController,
    private authService: AuthProvider) {
    this.eventService.getObservable().subscribe(update => {
      // this.events = this.eventService.getEvents();
      this.schedules = this.eventService.getSchedule();


      // console.log("get schedule", JSON.stringify(this.schedules));
    });

    this.userService.getObservable().subscribe(update => {
      this.users = userService.getUsers();
    });

    this.messageService.getObservable().subscribe(update => {
      this.messages = messageService.getMessages();
    });

    // this.events = this.eventService.getEvents();
    this.schedules = this.eventService.getSchedule();
    this.event_type = "all";

    // this.myId = "1";
    this.getLoginUserId().then(id => {
      this.myId = id;
      this.myIdNum = parseInt(this.myId);
    })
  }

  ionViewWillEnter() {
    this.schedules = this.eventService.getSchedule();
  }

  private todetail(eventKey: string) {
    this.navCtrl.push(CreateEventPage, { "eventKey": eventKey });
  }

  private toViewdetail(eventKey: string) {
    this.navCtrl.push(EventDetailPage, { "eventKey": eventKey });
  }

  private createEvent() {
    this.navCtrl.push(CreateEventPage);
  }

  private joinEvent(event: Event) {
    this.messageService.sendMessage(event.key, this.myId, event.host_id, 1);
  }

  public getUserImgById(userId) {
    if (userId !== "-1" && this.userService.getUserById(userId) != undefined) {
      let userImg = this.userService.getUserById(userId).img;
      // console.log(userImg);
      return userImg;
    } else {
      return "assets/imgs/no-avatar.png";
    }
  }

  public checkEventRelationshipsToMe(event: Event): string[] {
    // console.log(event.host_id == this.myId)
    let relations: string[] = [];

    if (event.host_id == this.myId) { // if I am the host
      relations.push("host");
    }
    if (event.coming_people_ids.indexOf(parseInt(this.myId)) > -1) { // if I am in the list of going people
      relations.push("going");
    }
    if (event.saved_people_ids.indexOf(parseInt(this.myId)) > -1) { // if I am in the list of  people who saved the event
      relations.push("saved");
    }
    if (event.pending_people_ids.indexOf(parseInt(this.myId)) > -1) { // if I am in the list of  people who saved the event
      relations.push("pending");
    }
    // console.log(event.coming_people_ids)
    return relations;
  }

  private getLoginUserId(): Promise<string> {
    return new Promise((resolve) => {
      this.authService.getCurrentUser().then((user) => { resolve(user.id) });
    })
  }


  public joinButtonClicked(event:Event){
    let relationships = this.checkEventRelationshipsToMe(event);

    if (relationships.indexOf('going') > -1 ){ //if already going, then retrieve
      this.presentConfirmNoGoing(relationships, event, this.myIdNum);
    } else{ // the user ask to join, then get pending, and send message to the host
      event.pending_people_ids.push(this.myIdNum);
      this.messageService.sendMessage(event.key, this.myId, event.host_id,1);
    }

    if (relationships.indexOf('saved') > -1){ // if the user has saved the event, then delete from the saved list
      event.saved_people_ids.splice(event.saved_people_ids.indexOf(this.myIdNum),1)
    }

    this.eventService.updateEvent(event);
  }



  public joinPendingClicked(event:Event){
    let relationships = this.checkEventRelationshipsToMe(event);
    if (relationships.indexOf('pending') > -1){ // if already pending, then retrieve
      event.pending_people_ids.splice(event.pending_people_ids.indexOf(this.myIdNum),1)
    }
    this.eventService.updateEvent(event);
  }



  public saveButtonClicked(event:Event){
    let relationships = this.checkEventRelationshipsToMe(event);
    if (relationships.indexOf('saved') > -1 ){ // if the user has saved the event, then delete from the saved list
      event.saved_people_ids.splice(event.saved_people_ids.indexOf(this.myIdNum),1)
    }else{ // if the user has not saved the event, then add to the saved list
      event.saved_people_ids.push(this.myIdNum);
    }
    this.eventService.updateEvent(event);
  }


  private presentConfirmNoGoing(relationships:string[], event:Event, idNum:number) {
    let alert = this.alertCtrl.create({
      title: 'Not Going',
      message: 'Do you decide not to go?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: "Don't go",
          handler: () => {
            event.coming_people_ids.splice(event.coming_people_ids.indexOf(idNum),1);
            if(relationships.indexOf('pending') > -1 ){//in case the data is not clean enough (a user is both going and pending)
              event.pending_people_ids.splice(event.pending_people_ids.indexOf(idNum),1);
            }
            this.eventService.updateEvent(event);
          }
        }
      ]
    });
    alert.present();
  }





}
