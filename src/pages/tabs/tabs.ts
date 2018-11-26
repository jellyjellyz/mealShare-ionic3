import { Component } from '@angular/core';

import { AllEventsPage } from '../all-events/all-events';
import { MyEventsPage } from '../my-events/my-events';
import { UserListPage } from '../user-list/user-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MyEventsPage;
  tab2Root = AllEventsPage;
  tab3Root = UserListPage;

  constructor() {

  }
}
