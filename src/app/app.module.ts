import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Pages import
import { MyApp } from './app.component';

import { PROVIDERS, PAGES, NATIVES, COMPONENTS } from './app.import';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from "@angular/http";
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

// const config: SocketIoConfig = { url: 'https://agrifarm-server.herokuapp.com', options: {} };
const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

@NgModule({
  declarations: [
    MyApp,
    COMPONENTS,
    PAGES
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md',
      tabsHideOnSubPages: false
    }),
    SocketIoModule.forRoot(config),
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PAGES
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PROVIDERS,
    NATIVES
  ],
  schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class AppModule {}
