import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';

import { OAuthService } from '../../pages/oauth/oauth.service';

import { GoogleOauthProvider } from './google/google-oauth.provider';
import { FacebookOauthProvider } from './facebook/facebook-oauth.provider';

import { OAuthProvidersListComponent } from './list/oauth-providers.list.component';

@NgModule({
	imports: [IonicModule, HttpModule],
	declarations: [
		OAuthProvidersListComponent
    ],
    exports: [
        OAuthProvidersListComponent
    ],
	providers: [
		OAuthService,
		GoogleOauthProvider,
		FacebookOauthProvider
	]
})
export class OAuthModule {
}