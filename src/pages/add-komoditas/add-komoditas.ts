import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Slides, Content } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';

@Component({
  selector: 'page-add-komoditas',
  templateUrl: 'add-komoditas.html',
})
export class AddKomoditasPage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild('footerInput') footerInput;
  @ViewChild(Content) content: Content;
  @ViewChild('inputJumlah') inputJumlah;
  @ViewChild('inputUsia') inputUsia;
  
  pageId: any;
  lahanId: any ;
  currentPage: number = 0;
  tottalPages: number;
  disableBack: boolean = true;
  disableNext: boolean = true;
  finish: boolean = false;
  done: boolean = false;
  saved: boolean = false;
  slide = [];
  userData = {"id_lahan":"", "id_rumus":"", "jumlah":"", "usia":"", "tanam":"", "panen":""};
  result: any = [];
  rumusData: any = [];
  showToolbar: boolean;
  hasFocus: boolean = false;
  callbackFnc: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public apiService: Api, public common: Common, public ref: ChangeDetectorRef) {
    this.pageId = this.navParams.get('pageId');
    this.lahanId = this.navParams.get('lahanId');
    this.callbackFnc = this.navParams.get("callback");
    this.userData.id_lahan = this.lahanId;
    this.slide = [ {
      name: "komoditas"
    }, {
      name: "jumlah"
    }, {
      name: "usia"
    }];
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
      this.getRumusList();
    }

    window.addEventListener('native.keyboardshow', (e) => {
      this.footerInput.nativeElement.style.bottom = (<any>e).keyboardHeight + 'px';
    });

    window.addEventListener('native.keyboardhide', () => {
      this.footerInput.nativeElement.style.bottom = '0';
    });
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    this.userData.id_lahan = this.lahanId;
    const nodeList = document.querySelectorAll('._gmaps_cdv_');

    for (let k = 0; k < nodeList.length; ++k) {
        nodeList.item(k).classList.remove('_gmaps_cdv_');
    }
  }

  dismiss() {
    if (this.callbackFnc) {
      this.navCtrl.pop().then(() => {
        this.callbackFnc("1");
      });
    }
    else {
      this.viewCtrl.dismiss();
    }
  }

  scrlTop() {
    this.hasFocus = false;
    var that = this;
    setTimeout(function() {
      that.content.scrollToTop();
    }, 100);
  }

  scrlBottom() {
    this.hasFocus = true;
    var that = this;
    setTimeout(function() {
      that.content.scrollToBottom();
    }, 100);
  }

  setBlurInput() {
    if (this.currentPage == 1) { // Nama Lahan
      this.inputJumlah.setBlur();
    }
    if (this.currentPage == 2) { // Lokasi Lahan
      this.inputUsia.setBlur();
    }
  }

  onChangeKomoditas(val) {
    this.disableNext = false;
  }

  onChangeLahan(val) {
    this.disableNext = false;
  }

  checkValue(ev) {
    let val = ev.target.value;
    this.disableNext = true;
    if (val.length >= 3) {
      this.disableNext = false;
    }
  }

  checkValueUsia() {
    if (this.userData.usia != "") {
      this.done = true;
    }
    else {
      this.done = false;
    }
  }

  goNext() {
    this.content.scrollTo(0, 0);
    this.slides.lockSwipes(false);
    let page = this.currentPage + 1;
    this.goToSlide(page);
  }

  goPrev() {
    this.content.scrollTo(0, 0);
    this.slides.lockSwipes(false);
    let page = this.currentPage - 1;
    this.goToSlide(page);
  }

  goToSlide(page: number) {
    this.slides.slideTo(page, 500);
    this.slides.lockSwipes(true);
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.currentPage = currentIndex;
    if (this.currentPage == 0) {
      this.disableBack = true;
    }
    else {
      this.disableBack = false;
    }
    if (this.currentPage == this.slide.length - 1) {
      this.finish = true;
    }
    else {
      this.finish = false;
    }
    if (this.currentPage == 0) {
      if (this.userData.id_rumus != "") {
        this.disableNext = false;
      }
      else {
        this.disableNext = true;
      }
    }
    if (this.currentPage == 1) {
      if (this.userData.jumlah != "") {
        this.disableNext = false;
      }
      else {
        this.disableNext = true;
      }
    }
    if (this.currentPage == 2) {
      if (this.userData.usia != "") {
        this.done = true;
      }
      else {
        this.done = false;
      }
    }
  }

  save() {
    // let res: any = [];
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    postData.append('id_lahan', this.userData.id_lahan);
    postData.append('id_rumus', this.userData.id_rumus);
    postData.append('jumlah', this.userData.jumlah);
    postData.append('usia', this.userData.usia);
    let userData = this.apiService.post("v1/komoditas/add", postData);
    userData.subscribe((result) => {
      this.content.scrollTo(0, 0);
      // res = result;
      // this.rumusData = res.data;
      this.common.closeLoading();
      this.saved = true;
      /*if (this.callbackFnc) {
        this.navCtrl.pop().then(() => {
          this.callbackFnc("1");
        });
      }
      else {
        this.dismiss();
      }*/
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  reset() {
    this.saved = false;
    this.done = false;
    this.disableBack = true;
    this.disableNext = true;
    this.userData.id_rumus = "";
    this.userData.jumlah = "";
    this.userData.usia = "";
    this.userData.tanam = "";
    this.userData.panen = "";
    
    this.slides.lockSwipes(false);
    let page = this.currentPage - (this.slide.length - 1);
    this.slides.slideTo(page, 500);
    this.slides.lockSwipes(true);
  }

  getRumusList() {
    let res: any = [];
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    let userData = this.apiService.post("v1/rumus", postData);
    userData.subscribe((result) => {
      res = result;
      this.rumusData = res.data;
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  onScroll($event: any) {
    if ($event === null) return;
    
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 10;
    this.ref.detectChanges();
  }

}
