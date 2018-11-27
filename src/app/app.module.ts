import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyEventsPage } from '../pages/my-events/my-events';
import { AllEventsPage } from '../pages/all-events/all-events';
import { UserListPage } from '../pages/user-list/user-list';
import { MessagePage } from '../pages/message/message';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { CreateEventPage } from '../pages/create-event/create-event';

@NgModule({
  declarations: [
    MyApp,
    MyEventsPage,
    AllEventsPage,
    UserListPage,
    MessagePage,
    UserProfilePage,
    EventDetailPage,
    CreateEventPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          statusbarPadding: true
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyEventsPage,
    AllEventsPage,
    UserListPage,
    MessagePage,
    UserProfilePage,
    EventDetailPage,
    CreateEventPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
