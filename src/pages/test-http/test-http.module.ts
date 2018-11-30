import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestHttpPage } from './test-http';

@NgModule({
  declarations: [
    TestHttpPage,
  ],
  imports: [
    IonicPageModule.forChild(TestHttpPage),
  ],
})
export class TestHttpPageModule {}
