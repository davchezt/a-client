import { Component } from '@angular/core';
import { MenuController, NavController, Platform } from 'ionic-angular';
import { Common } from '../../providers/common/common';

import { WellcomePage } from '../wellcome/wellcome';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;
  dir: string = 'ltr';
  showToolbar:boolean = false;

  constructor(public navCtrl: NavController, public menu: MenuController, public platform: Platform, public common: Common/*, private statusBar: StatusBar*/) {
    this.dir = platform.dir();
    this.slides = [{
        title: 'NAVIGASI LAHAN',
        description: 'Geser kiri atau kanan pada lahan akan membuka pilihan untuk lahan tersebut',
        image: 'assets/img/1.png',
      },
      {
        title: 'PILIHAN LAHAN',
        description: 'dengan menekan tombol titik tiga pada sudut kanan lahan anda akan menemukan pilihan untuk lahan terpilih seperti menambahkan komoditas, mengubah, melihat bahkan menghapus',
        image: 'assets/img/2.png',
      },
      {
        title: 'TUTORIAL III',
        description: 'DESKRIPSI TUTORIAL',
        image: 'assets/img/ica-slidebox-img-3.png',
      }];

    if (localStorage.getItem('skipIntro')) {
      this.startApp();
    }
  }

  ionViewDidLoad() {
  }

  startApp() {
    this.common.presentLoading();
    localStorage.setItem('skipIntro', 'true');
    setTimeout(() => this.toWelcomePage(), 0);
  }

  toWelcomePage() {
    this.navCtrl.setRoot(WellcomePage, {openPage: 1}, {
      animate: true,
      direction: 'forward'
    });
    this.common.closeLoading();
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
    //this.menu.close();
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    //this.menu.enable(true);
  }

}
