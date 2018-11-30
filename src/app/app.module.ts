import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
import { RestaurantDetailPage } from '../pages/restaurant-detail/restaurant-detail';
import { EventDataServiceProvider } from '../providers/event-data-service/event-data-service';
import { OrderByPipe } from '../pipes/order-by/order-by';
import { UserDataServiceProvider } from '../providers/user-data-service/user-data-service';

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
    RestaurantDetailPage,
    TabsPage,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
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
    RestaurantDetailPage,
    TabsPage
  ],
  providers: [
    InAppBrowser,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    EventDataServiceProvider,
    UserDataServiceProvider
  ]
})
export class AppModule { }
