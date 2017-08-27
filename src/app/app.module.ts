import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginComponent } from '../pages/login/login.component';
import { SharedModule } from '../shared/shared.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { ApiProvider } from '../providers/api/api';

const networkInterface = createNetworkInterface({ uri: 'http://192.168.1.34:3000/graphql' });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    // get the authentication token from local storage if it exists
    req.options.headers.authorization = 'bearer token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTc0YmEzNDY3MDUyNTE0ZDA4MjU4YmUiLCJuYW1lIjoiTWFyZ2UgU2ltcHNvbiIsImVtYWlsIjoibWFyZ2Uuc2ltcHNvbkBnbWFpbC5jb21zIiwicGFzc3dvcmQiOiIkMmEkMTAkUmdwbmxyNE5BWS5GSzFFbUZSRUxuLjVtMUFNL3FGVVJjclVpQW1XbThhTmQ2M09QN1VWTHkiLCJpYXQiOjE1MDE5OTEyMjB9.qgh0d_4IicIjFAV_2qt3FBG9XkUAnjTfC5RnJ8S79Rw'
    next();
  }
}]);

const apolloClient = new ApolloClient({
  networkInterface
});

export function provideClient(): ApolloClient {
  return apolloClient;
}

@NgModule({
  declarations: [
    LoginComponent,
    MyApp,
    MapPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    ApolloModule.forRoot(provideClient),
    IonicModule.forRoot(MyApp),
    SharedModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LoginComponent,
    MapPage,
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GoogleMaps,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider
  ]
})
export class AppModule { }
