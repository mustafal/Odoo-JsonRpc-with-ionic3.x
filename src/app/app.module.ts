import { ViewPage } from '../pages/view/view';
import { LoginPage } from '../pages/login/login';
import { OdooJsonRpc } from '../services/odoojsonrpc';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ViewPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ViewPage,
    ProfilePage
  ],
  providers: [
    Network,
    StatusBar,
    SplashScreen,
    OdooJsonRpc,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
