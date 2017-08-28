import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OAuthService } from '../oauth.service';

import { TabsPage } from '../../tabs/tabs'

@Component({
	selector: 'oauth-providers-list',
	templateUrl: 'oauth-providers.list.html',
	providers: [OAuthService]
})
export class OAuthProvidersListComponent {

	constructor(private oauthService: OAuthService, private nav: NavController) {
		this.oauthService = oauthService;
	}

	public login(source: string) {
		this.oauthService.login(source)
			.then(
				() => this.nav.setRoot(TabsPage),
				error => alert(error)
			);
	}
}