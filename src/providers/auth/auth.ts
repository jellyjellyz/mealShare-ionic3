import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { environment } from '../../environment/environment';

import 'firebase/database';
import 'firebase/auth';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  private db: any;
  constructor() {
    // initiate firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
    this.db = firebase.database();
  }
  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        resolve();
      } else {
        reject();
      }
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
          userModel.id = user.uid;
          userModel.name = user.displayName;
          userModel.email = user.email;
          return resolve(userModel);
        } else {
          reject('No user logged in');
        }
      })
    })
  }

}
