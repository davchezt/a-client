import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Platform  } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

@Component({
  selector: 'page-cal-details',
  templateUrl: 'cal-details.html',
})
export class CalDetailsPage {
  calName: string = '';
	events: any = [];
	agriFarmEvent: any = [];
	public date = new Date();

	showToolbar:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private calendar: Calendar, private plt: Platform, public ref: ChangeDetectorRef) {
		this.calName = navParams.get('name');
    if (this.plt.is('ios')) {
      this.calendar.findAllEventsInNamedCalendar(this.calName).then(data => {
        this.events = data;
      });
    } else if (this.plt.is('android')) {
			//let startDate = new Date(Date.now());
    	//let endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
			let start = new Date();
			start.setDate(start.getDate() - 1);
      let end = new Date();
      end.setDate(end.getDate() + 31);
 
      this.calendar.listEventsInRange(start, end).then(data => {
				for (let item of data) {
					if (item.calendar_id == 4) {
						this.agriFarmEvent.push(item);
					}
				}
				this.events = data;
				console.log(this.agriFarmEvent);
      });
    }
  }

	onScroll($event: any) {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 80;
    this.ref.detectChanges();
	}
	
  ionViewDidLoad() {
    //console.log('ionViewDidLoad CalDetailsPage');
  }

  /*
  function relative_time(date) {
			var now = new Date().getTime();
			var elapsed = Math.round(now / 1000) - date;

			if (elapsed <= 1) {
				return 'Baru saja';
			}

			var rounded, title;
			if (elapsed > 31104000) {
				rounded = elapsed / 31104000;
				title = 'tahun';
			} else
			if (elapsed > 2592000) {
				rounded = elapsed / 2592000;
				title = 'bulan';
			} else
			if (elapsed > 604800) {
				elapsed = elapsed / 604800;
				title = 'minggu';
			} else
			if (elapsed > 86400) {
				rounded = elapsed / 86400;
				title = 'hari';
			} else
			if (elapsed > 3600) {
				rounded = elapsed / 3600;
				title = 'jam';
			} else
			if (elapsed > 60) {
				rounded = elapsed / 60;
				title = 'menit';
			}
			else if (elapsed >= 1) {
				rounded = elapsed / 1;
				title = 'detik';
			}
			if (rounded > 1) {
					rounded = Math.round(rounded);
					return rounded + ' ' + title + ' yang lalu';
			}
		}
		function getHHMM(t) {
			var d = new Date(t*1000),
			h = d.getHours(),
			m = d.getMinutes(),
			a = '';
			if (h > 0 && h < 12) {
				a = 'AM';
			}
			else {
				if (h == 0) 
					a = 'AM';
				else
					a = 'PM';
			}
			if (m < 10) m = '0' + m;
			return ((h == 0 || h == 12) ? 12 : h % 12) + ':' + m + ' ' + a;
		};
  */

}
