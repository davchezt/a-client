import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { Api } from '../../providers/api/api';

@Component({
  selector: 'page-upload-file',
  templateUrl: 'upload-file.html',
})
export class UploadFilePage {
  imageURI: any;
  imageFileName: any;
  result: any = [];
  showPreview: boolean = false;
  showToolbar:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private transfer: FileTransfer, private camera: Camera, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public apiService: Api, public ref: ChangeDetectorRef) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad UploadFilePage');
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
    }
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 80;
    this.ref.detectChanges();
  }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
    }, (err) => {
      // console.log(err);
      this.presentToast(err);
    });
  }

  uploadFile() {
    let apiURL = this.apiService.url;
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'upload',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      params: {
        user_id: this.result.user_id,
        token: this.result.token
      },
      headers: {}
    }

    fileTransfer.upload(this.imageURI, apiURL + '/upload', options)
    .then((data) => {
      console.log(data)
      this.imageFileName = apiURL + '/data/avatar/crops/ava_' + this.result.user_id + '_ionicfile.jpg';
      loader.dismiss();
      this.presentToast("Berhasil");
      this.showPreview = true;
    }, (err) => {
      console.log(err);
      loader.dismiss();
      this.presentToast(err);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 6000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }

}
