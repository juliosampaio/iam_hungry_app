import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IOathProvider } from '../oauth.provider.interface';
import { OAuthProfile } from '../models/oauth-profile.model';
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { Facebook } from 'ng2-cordova-oauth/core';
import { Config } from '../../../config';
interface ILoginResponse {
    access_token: string;
}
interface IProfileResponse {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

@Injectable()
export class FacebookOauthProvider implements IOathProvider {
    private cordovaOauth: OauthCordova;
    private http: Http;
    private config: Config;
    private facebook: Facebook;

    constructor(http: Http, config: Config) {
        this.http = http;
        this.config = config;
        this.facebook = new Facebook({ clientId: config.facebook.appId, appScope: config.facebook.scope });
        this.cordovaOauth = new OauthCordova();
    }

    login(): Promise<any> {
        return this.cordovaOauth.logInVia(this.facebook)
            .then((x: ILoginResponse) => x.access_token);
    }

    getProfile(accessToken): Promise<any> {
        let query = `access_token=${accessToken}&fields=${this.config.facebook.fields.join()}&format=json`;
        let url = `${this.config.facebook.apiUrl}me?${query}`;
        return this.http.get(url)
            .map(x => x.json())
            .map((x: IProfileResponse) => {
                let profile: OAuthProfile = {
                    providerId: x.id,
                    firstName: x.first_name,
                    lastName: x.last_name,
                    email: x.email,
                    provider: 'facebook'
                };
                return profile;
            })
            .toPromise();
    }
}