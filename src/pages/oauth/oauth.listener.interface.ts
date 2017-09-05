export interface IOauthLoginLister {
    onLogin(res : any) : void;
    onLoginError(err: any) : void;
    onCatch(err: any) : void;
}