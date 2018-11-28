import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantSelectionPage } from './restaurant-selection';

@NgModule({
  declarations: [
    RestaurantSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(RestaurantSelectionPage),
  ],
})
export class RestaurantSelectionPageModule {}
