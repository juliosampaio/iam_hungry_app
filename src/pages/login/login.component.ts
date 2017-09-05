import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IOauthLoginLister } from '../oauth/oauth.listener.interface';

import { LoginService } from './login.service';


@Component({
    selector    : 'login-component',
    templateUrl : 'login.component.html',
    styles      : ['login.component.scss']
})
export class LoginComponent implements IOauthLoginLister {

    constructor(private nav: NavController, private service: LoginService){

    }

    onLogin(res) {
        this.service.getProfile()
            .then(
                (r) => console.log(r),
                (r) => console.error(r))
            .catch((r) => console.info(r));
    }

    onLoginError(e) {
        alert(e);
    }

    onCatch(e) {
        alert(e);
    }

}