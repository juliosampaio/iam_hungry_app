import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiProvider } from '../../providers/api/api';
import { OAuthService } from '../oauth/oauth.service';
import { OAuthProfile } from '../oauth/models/oauth-profile.model';

@Injectable()
export class LoginService {

    constructor(private api: ApiProvider, private oauth: OAuthService) {

    }

   getProfile(): Promise<any> {
        return this.oauth
            .getProfile()
            .then(profile => {
                return this.api.userExists(profile.email).map((exists) => {
                    if (exists) {
                        return this.signinUserFromOAuthProfile(profile);
                    } else {
                        return this.createUserFromOAuthProfile(profile);
                    }
                }).toPromise();
            });
    }

    signinUserFromOAuthProfile(profile: OAuthProfile): Promise<any> {
        return this.api.signinUser(profile.email, profile.providerId);
    }

    createUserFromOAuthProfile({email, firstName, lastName, providerId}: OAuthProfile): Promise<any> {
        const name = [firstName, lastName].join(' ');
        return this.api.createUser(name, email, providerId);
    }

}