import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OAuthService } from '../oauth.service';

import { IOauthLoginLister } from '../oauth.listener.interface';

@Component({
	selector: 'oauth-providers-list',
	templateUrl: 'oauth-providers.list.html',
	providers: [OAuthService]
})
export class OAuthProvidersListComponent {

	@Input('listener')
	private loginListener: IOauthLoginLister;

	constructor(private oauthService: OAuthService) {
		this.oauthService = oauthService;
	}

	public login(source: string) {
		this.oauthService.login(source)
			.then(
				(res) => this.loginListener.onLogin(res),
				(err) => this.loginListener.onLoginError(err)
			)
			.catch((err) => this.loginListener.onCatch(err));
	}
}