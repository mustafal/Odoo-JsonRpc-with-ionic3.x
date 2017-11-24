import { AddCustomerPage } from '../pages/add-customer/add-customer';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HomePage } from '../pages/home/home';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { MyApp } from './app.component';
import { Network } from '@ionic-native/network';
import { OdooJsonRpc } from '../services/odoojsonrpc';
import { ParallaxDirective } from '../directives/parallax/parallax';
import { ProfilePage } from '../pages/profile/profile';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ViewPage } from '../pages/view/view';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ViewPage,
    ProfilePage,
    ParallaxDirective,
    AddCustomerPage
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
    ProfilePage,
    AddCustomerPage
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
