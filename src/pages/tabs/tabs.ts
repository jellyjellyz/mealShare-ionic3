import { Component } from '@angular/core';

import { AllEventsPage } from '../all-events/all-events';
import { MyEventsPage } from '../my-events/my-events';
import { UserListPage } from '../user-list/user-list';
import { UserProfilePage } from '../user-profile/user-profile';
import { MessagePage } from '../message/message';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MyEventsPage;
  tab2Root = AllEventsPage;
  tab3Root = MessagePage;
  tab4Root = UserListPage;
  tab5Root = UserProfilePage;
  constructor() {

  }
}
