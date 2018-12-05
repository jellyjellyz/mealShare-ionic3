import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signup: FormGroup;
  loading: any;
  errorMessage: string = '';

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public fAuthService: AuthProvider
  ) {

    this.signup = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  doSignup(value){
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doRegister(value)
    .then(res => {
      this.fAuthService.doLogin(value)
      .then(res => {
        this.nav.push(TabsPage);
        this.loading.dismiss();
      }, error => this.errorMessage = error.message)
    }, err => this.errorMessage = err.message)
  }

}

