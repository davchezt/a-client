import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-profile-picture',
  templateUrl: 'profile-picture.html',
})
export class ProfilePicturePage {
  showToolbar: boolean = false;
  hasImage: boolean = false;
  base64Image: string;
  result = {"latitude":null, "longitude":null, "name":"", "pic":null, "token":"", "type":"", "user_id":"0"};

  constructor(public navCtrl: NavController, public navParams: NavParams, public ref: ChangeDetectorRef, private camera: Camera, public http: HttpClient, public apiService: Api, public common: Common) {
    if (localStorage.getItem('userData')) {
      let data = JSON.parse(localStorage.getItem('userData'));
      this.result = data;
    }
  }

  ionViewDidLoad() {
    if (this.result.pic != null) {
      this.base64Image = this.apiService.url + "/" + this.result.pic;
    }
    else {
      this.base64Image = "assets/img/agritama.png";
    }
  }

  ionViewWillEnter() {
  }

  openGalery() {
    this.common.presentLoading();
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL, // FILE_URI || DATA_URL
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.hasImage = true;
      this.common.closeLoading();
      // console.log(imageData);
    }, (err) => {
      this.common.closeLoading();
      this.common.presentToast(err);
    });
  }

  openCamera() {
    this.common.presentLoading();
    const options: CameraOptions = {
      quality: 75, // 100 = crash, 50 default
      destinationType: this.camera.DestinationType.DATA_URL, // FILE_URI || DATA_URL
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.hasImage = true;
      this.common.closeLoading();
      // console.log(imageData);
    }, (err) => {
      this.common.closeLoading();
      this.common.presentToast(err);
    });
  }

  back() {
    this.navCtrl.pop();
  }

  save() {
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    postData.append('foto', this.base64Image);
    
    let data:Observable<any> = this.apiService.upload("/v1/user/foto", postData);
    data.subscribe((result) => {
      console.log(result);
      this.base64Image = result.data.foto;
      this.common.closeLoading();
      this.common.presentToast("Uploaded at: " + result.data.foto);
      this.navCtrl.pop().then(() => {
        this.navParams.get("callback")("1");
      });  
    }, (error) => {
      console.log(error);
      this.common.closeLoading();
      this.common.presentToast(error);
    });
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 80;
    this.ref.detectChanges();
  }

}
