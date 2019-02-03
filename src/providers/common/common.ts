import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class Common {
  public loader: any;
  public user: { "user_id": "", "token": "", "name": "", "pic": null, "type": 0};
  public auth: boolean = false;
  public userInroom = [];
  public room = [];

  constructor(public loadingCtrl: LoadingController, private toastCtrl:ToastController) {
    //console.log('Hello Common Provider');
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({content: "Mohon tunngu ..."})
    this.loader.present();
  }

  closeLoading() {
    this.loader.dismiss();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      showCloseButton: true,
      closeButtonText: "ok",
      position: "bottom"
    });
    toast.present();
  }

  initUser() {
    if (localStorage.getItem('userData')) {
      this.user = JSON.parse(localStorage.getItem('userData'));
      this.auth = true;
    }
    this.auth = false;
  }

  getUser() {
    if (localStorage.getItem('userData')) {
      this.user = JSON.parse(localStorage.getItem('userData'));
    }
    return this.user;
  }

  timeSince = (date:any) => {
    let now:any = new Date();
    date = new Date(date);
    let seconds = Math.floor((now - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
  
    if (interval > 1) {
      return interval + " tahun yang lalu";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " bulan yang lalu";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " hari yang lalu";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " jam yang lalu";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " menit yang lalu";
    }
    if (interval == 0 ) {
      return "baru saja";
    }
    return Math.floor(seconds) + " detik yang lalu";
  }

  relative_time = (date?: number) => {
    if (!date) date = new Date().getTime() / 1000;
    var now = new Date().getTime() / 1000;
    var elapsed = Math.round(now - date);

    if (elapsed <= 1) {
      return "baru saja";
    }

    var rounded, title;
    if (elapsed > 31104000) {
      rounded = elapsed / 31104000;
      title = "tahun";
    } else if (elapsed > 2592000) {
      rounded = elapsed / 2592000;
      title = "bulan";
    } else if (elapsed > 604800) {
      elapsed = elapsed / 604800;
      title = "minggu";
    } else if (elapsed > 86400) {
      rounded = elapsed / 86400;
      title = "hari";
    } else if (elapsed > 3600) {
      rounded = elapsed / 3600;
      title = "jam";
    } else if (elapsed > 60) {
      rounded = elapsed / 60;
      title = "menit";
    } else if (elapsed >= 1) {
      rounded = elapsed / 1;
      title = "detik";
    }
    if (rounded > 1) {
      rounded = Math.round(rounded);
      return rounded + " " + title + " yang lalu";
    }
  };

  getHHMM = (t: number) => {
    let d = new Date(t * 1000);
    let h = d.getHours();
    let m = d.getMinutes();
    let a = "";
    let ms = "";
    if (h > 0 && h < 12) {
      a = "AM";
    } else {
      if (h == 0) a = "AM";
      else a = "PM";
    }
    if (m < 10) ms = "0" + m;
    else ms = "" + m;
    return (h == 0 || h == 12 ? 12 : h % 12) + ":" + ms + " " + a;
  };

  timeUntil = (date: string) => {
    date = date + "";
    let dates = date.split("/");
    let year = parseInt(dates[0]);
    let month = parseInt(dates[1]);
    let day = parseInt(dates[2]);
    let hour = 0;
    let minute = 0;
    let second = 0;
    let yrr = 0;
    let eventtext = "menjelang panen";
    let endtext = "Waktu panen tiba";
    let end = new Date(year, month, day, hour, minute, second);
    let now = new Date();
    if (now.getFullYear() < 1900) yrr = now.getFullYear() + 1900;
    let sec = second - now.getSeconds();
    let min = minute - now.getMinutes();
    let hr = hour - now.getHours();
    let dy = day - now.getDate();
    let mnth = month - now.getMonth();
    let yr = year - yrr;
    let daysinmnth = 32 - new Date(now.getFullYear(),now.getMonth(), 32).getDate();
    if (sec < 0) {
      sec = (sec + 60) % 60;
      min--;
    }
    if (min < 0) {
      min = (min + 60) % 60;
      hr--;	
    }
    if (hr < 0) {
      hr = (hr + 24) % 24;
      dy--;	
    }
    if (dy < 0) {
      dy = (dy + daysinmnth) % daysinmnth;
      mnth--;	
    }
    if (mnth < 0) {
      mnth = (mnth + 12) % 12;
      yr--;
    }	
    let dytext = " hari, ";
    let mnthtext = " bulan, ";
    let yrtext = " tahun, ";
    if (yr == 1) yrtext = " tahun, ";
    if (mnth == 1)  mnthtext = " bulan, ";
    if (dy == 1) dytext = " hari, ";
    if(now >= end) {
      // clearTimeout(timerID);
      return endtext;
    }
    else {
      // timerID = setTimeout(() => { "timeUntil" }, 1000);
      return yr + yrtext + mnth + mnthtext + dy + dytext + eventtext;
    }
  }

  timeUntilHours = (date: string) => {
    let startDate = new Date();
    let endDate = new Date(date);
    let dates = (endDate.getTime() - startDate.getTime()) / (24 * 3600) + "";
    
    return parseInt(dates, 10);
  }

  timeUntilDays = (date: string) => {
    let startDate = new Date();
    let endDate = new Date(date);
    let dates = (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000) + "";
    
    return parseInt(dates, 10);
  }

  timeUntilWeeks = (date: string) => {
    let startDate = new Date();
    let endDate = new Date(date);
    let dates = (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000 * 7) + "";
    
    return parseInt(dates, 10);
  }

  timeUntilMonths = (date: string) => {
    let startDate = new Date();
    let endDate = new Date(date);
    
    return (endDate.getMonth() + 12 * endDate.getFullYear()) - (startDate.getMonth() + 12 * startDate.getFullYear());
  }

  timeUntilYears = (date: string) => {
    let startDate = new Date();
    let endDate = new Date(date);
    
    return endDate.getFullYear() - startDate.getFullYear();
  }

}
