import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

registerForm = new FormGroup({
	nama: new FormControl(), 
	email: new FormControl(),
	password: new FormControl(),
	refpassword: new FormControl() 
});

submitAttempt: boolean = false;
label: any = {}; 
emailRegx: any;
passwordRegx: any;
nameRegx: any;
phoneNumberRegx: any;
messageLabel: any;
userdata: any;
 
ionViewDidLoad() {
	this.emailRegx = this.validator.emailRegx;
	this.passwordRegx = this.validator.passwordRegx;
	this.nameRegx = this.validator.nameRegx;
	this.phoneNumberRegx = this.validator.phoneNumberRegx; 
	this.registerForm = this.formBuilder.group({
		nama: ['', Validators.compose([Validators.required, this.validator.nameValidator.bind(this)])],
		email: ['', Validators.compose([Validators.required, this.validator.emailValidator.bind(this)])],
		password: ['', Validators.compose([Validators.required, this.validator.passwordValidator.bind(this)])],
		refpassword: ['', Validators.compose([Validators.required])]
	}, {'validator': this.validator.isMatching});
}

<ion-list>
    <form [formGroup]="registerForm" (ngSubmit)="register()">
    <ion-item> 
      <ion-icon name="contact" item-start></ion-icon> 
      <ion-input formControlName="first_name" type="text"  placeholder="First name"></ion-input>
    </ion-item>
    <ion-item class="no-line error" *ngIf="!registerForm.controls.first_name.valid  && (registerForm.controls.first_name.dirty || submitAttempt) && !registerForm.controls.first_name.pending">
        <p *ngIf="registerForm.value.first_name != ''">First name not valid</p>
        <p *ngIf="registerForm.value.first_name == ''">First name required</p>
    </ion-item>
    <ion-item> 
      <ion-icon name="contact" item-start></ion-icon> 
      <ion-input formControlName="last_name" type="text" placeholder="Last name"></ion-input>
    </ion-item>
    <ion-item class="no-line error" *ngIf="!registerForm.controls.last_name.valid  && (registerForm.controls.last_name.dirty || submitAttempt) && !registerForm.controls.last_name.pending">
        <p *ngIf="registerForm.value.last_name != ''">Last name not valid</p>
        <p *ngIf="registerForm.value.last_name == ''">Last name required</p>
    </ion-item>
    <ion-item> 
      <ion-icon name="mail" item-start></ion-icon> 
      <ion-input formControlName="email" type="email"  placeholder="Email"></ion-input>
    </ion-item>
    <ion-item class="no-line error" *ngIf="!registerForm.controls.email.valid  && (registerForm.controls.email.dirty || submitAttempt) && !registerForm.controls.email.pending">
        <p *ngIf="registerForm.value.email != ''">Email not valid</p>
        <p *ngIf="registerForm.value.email == ''">Email required</p>
    </ion-item>

    <ion-item> 
      <ion-icon name="lock" item-start></ion-icon> 
      <ion-input formControlName="password" type="password" placeholder="Password"></ion-input>
    </ion-item>
    <ion-item class="no-line error" *ngIf="!registerForm.controls.password.valid  && (registerForm.controls.password.dirty || submitAttempt) && !registerForm.controls.password.pending">
        <p *ngIf="registerForm.value.password != ''">Password not valid</p>
        <p *ngIf="registerForm.value.password == ''">Password required</p>
    </ion-item>
    <ion-item> 
      <ion-icon name="lock" item-start></ion-icon> 
      <ion-input formControlName="confirmPassword" type="password"  placeholder="Confirm Password"></ion-input>
    </ion-item>
    <ion-item class="no-line error" *ngIf="registerForm.value.password != registerForm.value.confirmPassword && registerForm.value.confirmPassword != '' && (registerForm.controls.confirmPassword.dirty  || submitRegisterAttempt) && !registerForm.controls.confirmPassword.pending && registerForm.value.password != '' && registerForm.controls.password.valid">
        <p>Confirm password not valid</p>
    </ion-item>
    <ion-item class="no-line error" *ngIf="registerForm.value.confirmPassword == '' && (registerForm.controls.confirmPassword.dirty  || submitRegisterAttempt) && !registerForm.controls.confirmPassword.pending && registerForm.value.password != '' && registerForm.controls.password.valid">
        <p>Confirm password required</p>
    </ion-item>
    <ion-item class="signup_btn">
      <button ion-button >Sign Up</button>
    </ion-item>
    </form>
  </ion-list>