import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, Content  } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

import { CalDetailsPage } from '../cal-details/cal-details';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';
import { LahanPage } from '../lahan/lahan';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  @ViewChild(Content) content: Content;

  calendars:any = [];
  agriFarmCalendar:any = [];
  showToolbar:boolean = false;
  result: any = [];
  jadwal: any = [];
  jadwalSemua: any = [];
  today: any = new Date();
  adaJadwal: boolean = false;
  adaJadwalSemua: boolean = false;
  items: any = [];

  // Calendar
  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  eventList: any;
  selectedEvent: any;
  isSelected: any;
  currentClick: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private calendar: Calendar, private plt: Platform, public ref: ChangeDetectorRef, private alertCtrl: AlertController, public apiService: Api, public common: Common) {
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
    }
    this.plt.ready().then(() => {
      this.calendar.listCalendars().then((data) => {
        this.calendars = data;
        for (let cal of data) {
          if (cal.name == "davchezt@gmail.com") {
            this.agriFarmCalendar = cal;
          }
        }
        console.log(data);
      }, (err) => {
        console.log(err);
      });
    });
  }

  onScroll($event: any){
    // hari ini 320
    // panen mendatang 455
    let scrollTop = $event.scrollTop;
    // console.log(scrollTop);
    this.showToolbar = scrollTop >= 10;
    this.ref.detectChanges();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CalendarPage');
  }

  scrollTo(to) {
    this.content.scrollTo(0, to, 500);
  }

  ionViewWillEnter() {
    this.date = new Date();
    this.monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Augustus","September","Oktober","November","Desember"];
    this.getDaysOfMonth();
    this.loadEventThisMonth();
    this.getJadwal();
    this.getSemuaJadwal();
  }

  getJadwal() {
    let resultData: any = [];
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let userData = this.apiService.post("v1/kalendar/tanggal", postData);
    userData.subscribe((result) => {
      resultData = result;
      this.jadwal = resultData.data;
      this.adaJadwal = false;
      if (this.jadwal.length > 0) {
        this.adaJadwal = true;
      }
    }, (error) => {
      console.log(error);
      this.common.presentToast(error);
    });
  }

  getSemuaJadwal() {
    let resultData: any = [];;
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let userData = this.apiService.post("v1/kalendar/jadwal", postData);
    userData.subscribe((result) => {
      resultData = result;
      this.adaJadwalSemua = false;
      this.jadwalSemua = resultData.data;
      this.items = this.jadwalSemua;
      if (this.jadwalSemua.length > 0) {
        this.adaJadwalSemua = true;
      }
    }, (error) => {
      console.log(error);
      this.common.presentToast(error);
    });
  }

  openLahan(id) {
    this.navCtrl.push(LahanPage, { id: id });
  }

  createCalendar() {
    this.calendar.createCalendar("Agri Farm").then(
      (msg) => { console.log(msg); },
      (err) => { console.log(err); }
    );
  }

  deleteCalendar() {
    this.calendar.deleteCalendar("Agri Farm").then(
      (msg) => { console.log(msg); },
      (err) => { console.log(err); }
    );
  }

  addEvent(cal) {
    let date = new Date();
    let options = { calendarId: cal.id, calendarName: cal.name, url: 'https://google.com', firstReminderMinutes: 15, calendarColor: '#32db64' };
 
    //this.calendar.createEventInteractivelyWithOptions('Test Events', 'Jakarta', 'Special Notes', date, date, options).then(res => {
    this.calendar.createEventWithOptions('My new Event', 'Jakarta', 'Special Notes', date, date, options).then(res => {
    }, err => {
      console.log('err: ', err);
      alert('err: ' + err);
    });
  }
 
  openCal(cal) {
    this.navCtrl.push(CalDetailsPage, { name: cal.name })
  }

  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if(this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }
  
    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }
  
    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for (var ii = 0; ii < thisNumOfDays; ii++) {
      this.daysInThisMonth.push(ii+1);
    }
  
    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    // var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
    for (var iii = 0; iii < (6-lastDayThisMonth); iii++) {
      this.daysInNextMonth.push(iii+1);
    }
    var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
    if(totalDays<36) {
      for(var iiii = (7-lastDayThisMonth); iiii < ((7-lastDayThisMonth)+7); iiii++) {
        this.daysInNextMonth.push(iiii);
      }
    }
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
    this.currentClick = 0;
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
    this.currentClick = 0;
  }

  loadEventThisMonth() {
    this.eventList = new Array();
    var startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    var endDate = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0);
    this.calendar.listEventsInRange(startDate, endDate).then(
      (msg) => {
        msg.forEach(item => {
          this.eventList.push(item);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkEvent(day) {
    var hasEvent = false;
    var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
    this.eventList.forEach(event => {
      if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
        hasEvent = true;
      }
    });
    return hasEvent;
  }

  selectDate(day) {
    this.currentClick = day;
    this.isSelected = false;
    this.selectedEvent = new Array();
    var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
    this.eventList.forEach(event => {
      if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
        this.isSelected = true;
        this.selectedEvent.push(event);
      }
    });
  }

  deleteEvent(evt) {
    // console.log(new Date(evt.startDate.replace(/\s/, 'T')));
    // console.log(new Date(evt.endDate.replace(/\s/, 'T')));
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.calendar.deleteEvent(evt.title, evt.location, evt.notes, new Date(evt.startDate.replace(/\s/, 'T')), new Date(evt.endDate.replace(/\s/, 'T'))).then(
              (msg) => {
                console.log(msg);
                this.loadEventThisMonth();
                this.selectDate(new Date(evt.startDate.replace(/\s/, 'T')).getDate());
              },
              (err) => {
                console.log(err);
              }
            )
          }
        }
      ]
    });
    alert.present();
  }

}
