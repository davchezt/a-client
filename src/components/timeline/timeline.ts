import { Component, Input } from '@angular/core';

@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class TimelineComponent {
  @Input('endIcon') endIcon = "calendar";
  constructor() {
  }

}

@Component({
  selector: 'timeline-item',
  template: '<ng-content></ng-content>'
})
export class TimelineItemComponent {
  constructor() {
  }
}

@Component({
  selector:'timeline-time',
  template: '<ion-badge color="agrifarm" style="padding: 6px 10px;"><ion-icon name="bookmark" icon start style="zoom:0.8;"></ion-icon>&nbsp;&nbsp;{{time.subtitle}}</ion-badge> <!--span>{{time.subtitle}}</span--> <span>{{time.title | date: "dd/MM/yyyy" }}</span>'
})
export class TimelineTimeComponent {
  @Input('time') time = { title:"", subtitle:""};
  tmpTime = {}
  constructor() {
  }
}