import { Injectable } from '@angular/core';
import { Common } from '../../providers/common/common';

@Injectable()
export class LogerProvider {

  constructor(public common: Common) {
  }

  info(input: any, toString?: boolean) {
    if (toString) input = this.isObject(input) ? JSON.stringify(input, null, 2) : input;
    console.log('%c📢 INFO => ', 'color: #fff; background: #0091ea; padding: 2px; 4px; border-radius: 4px; border: 2px solid #000', input);
    if (!toString) this.common.presentToast('📢 ' + input);
  }

  warnig(input: any, toString?: boolean) {
    if (toString) input = this.isObject(input) ? JSON.stringify(input, null, 2) : input;
    console.warn('%c🚫 WARNING => ', 'color: #000; background: #ffeb3b; padding: 2px; 4px; border-radius: 4px; border: 2px solid #000', input);
    if (!toString) this.common.presentToast('🚫 ' + input);
  }

  error(input: any, toString?: boolean) {
    if (toString) input = this.isObject(input) ? JSON.stringify(input, null, 2) : input;
    console.error('%c⛔ ERROR => ', 'color: #fff; background: #e53935; padding: 2px; 4px; border-radius: 4px; border: 2px solid #000', input);
    if (!toString) this.common.presentToast('⛔ ' + input);
  }
  
  success(input: any, toString?: boolean) {
    if (toString) input = this.isObject(input) ? JSON.stringify(input, null, 2) : input;
    console.log('%c📢 SUCCESS => ', 'color: #fff; background: #009385; padding: 2px; 4px; border-radius: 4px; border: 2px solid #000', input);
    if (!toString) this.common.presentToast('📢 ' + input);
  }

  isObject(input): boolean {
    if (typeof input === 'object') {
      return true;
    }

    return false;
  }

}
