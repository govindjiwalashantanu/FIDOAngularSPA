/*!
* Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
* The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
*
* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*
* See the License for the specific language governing permissions and limitations under the License.
*/

import { Component, OnInit } from '@angular/core';
import sampleConfig from '../.samples.config';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ActivatedRoute } from "@angular/router";
import * as OktaSignIn from '@okta/okta-signin-widget';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css']
})
export class RegComponent implements OnInit {
  regStepOneForm = this.fb.group({
    accountNo: ['',Validators.required],
    postalCode: ['',[Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
  });

  regStepTwoForm = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    phoneNumber: ['',[Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
  });

  regStepThreeForm = this.fb.group({
    code: ['',Validators.required]
  });

  regStepFourForm = this.fb.group({
    password: ['',Validators.required],
    confirmPassword: ['',Validators.required]
  });

  user: any = {};

  step: any;

  sessionToken: any;

  oktaAuth:any;

  resetToken: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {
    this.step = '1';

  }

  // convenience getter for easy access to form fields
    get f() { return this.regStepOneForm.controls; }

  back(){
    if(this.step=='1') return;
    this.step--;
  }

  continue(){
    if(this.step=='6') return;
    this.step++;
  }

  onStepOneSubmit() {

    // TODO: Use EventEmitter with form value
    this.user.accountNo = this.regStepOneForm.value.accountNo;
    this.user.postalCode = this.regStepOneForm.value.postalCode;
    //this.user.planId = "Generated PlanId";
    console.log(this.user);
    this.http.get("https://selfregistration-demo.glitch.me/").subscribe((data: any) => {
      console.log("planIDDDDDDDDDD======>>>>>>"+data.commands[1].value.planId);
      this.user.planId = data.commands[1].value.planId;
    });
    this.step ++;



}

resendEmail(){
  this.user.login = this.regStepTwoForm.value.email;
  console.log("IAMHEREEEEEEEEEEEEEEEEEEEEIAMHEREEEEEEEEEEEEEEEEEEEEIAMHEREEEEEEEEEEEEEEEEEEEEIAMHEREEEEEEEEEEEEEEEEEEEEIAMHEREEEEEEEEEEEEEEEEEEEE");
  const data = new HttpParams()
      .set('login', this.user.login);

  this.http.post<any>("https://reset-password-okta.glitch.me/resendEmail", data).subscribe(response => {
        console.log(response);
  })
  //this.step ++;
  console.log(this.user);
}

onStepTwoSubmit() {
  this.user.email = this.regStepTwoForm.value.email;
  this.user.login = this.regStepTwoForm.value.phoneNumber;

  const data = new HttpParams()
      .set('email', this.regStepTwoForm.value.email)
      .set('accountNumber', this.user.accountNo)
      .set('postalCode', this.user.postalCode)
      .set('planId', this.user.planId)
      .set('login', this.user.login);

  this.http.post<any>("https://reset-password-okta.glitch.me/activateUser", data).subscribe(response => {
        console.log(response);
  })
  this.step ++;
  console.log(this.user);


}

onStepThreeSubmit() {
  //window.alert("CHEEKY")
  var code = this.regStepThreeForm.value.code;
  console.log(code);

    var eSignIn = new OktaSignIn({baseUrl: 'https://pocrogers.okta.com',
    clientId: sampleConfig.oidc.clientId,
    redirectUri: sampleConfig.oidc.redirectUri,
    logo: sampleConfig.oidc.logo,
    features: {
      rememberMe: true,
      smsRecovery: true,
      selfServiceUnlock: true,
      multiOptionalFactorEnroll: true,
      registration : true,
      autoPush: true,
      router: true,
    },
    authParams: {
      responseType: ['id_token', 'token'],
      issuer: sampleConfig.oidc.issuer,
      display: 'page',
      scopes: sampleConfig.oidc.scope.split(' '),
    },
    recoveryToken: code,
    i18n: {
    en: {
      'primaryauth.title': 'Set Your Password',
      'password.reset': 'Set your Password',
      'password.reset.title': 'Set your Password',
      'password.forgot.email.or.username.placeholder': 'Email or Phone Number',
      'password.forgot.email.or.username.tooltip': 'Email or Phone Number',
      'password.forgot.emailSent.desc' : 'An Email has been sent to {0} with instructions on resetting your password. Click on Use Recovery Token link in the email to change your password.'
    }
  }});
    eSignIn.renderEl({
      el: '#widget-container'
    }, function success(res) {
      if (res.status === 'SUCCESS') {
        this.step++;
      } else {
        console.log(res.status)
        window.alert(res.status)
        this.step ++
        // The user can be in another authentication state that requires further action.
        // For more information about these states, see:
        //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
      }
    });

  //this.step ++;
}

ngOnInit() {
  this.step = '1';
  this.step = this.route.snapshot.paramMap.get("step")
  if(!this.step)this.step='1';
  console.log(this.step);
  this.route.queryParams
    .filter(params => params.resetToken)
    .subscribe(params => {
      console.log(params); // {order: "popular"}

      this.resetToken = params.resetToken;
      // popular
    });
    if(this.resetToken){
      console.log(this.resetToken);
      this.step='0';
      var rSignIn = new OktaSignIn({baseUrl: 'https://pocrogers.okta.com',
        clientId: sampleConfig.oidc.clientId,
        redirectUri: sampleConfig.oidc.redirectUri,
        logo: sampleConfig.oidc.logo,
        features: {
          rememberMe: true,
          smsRecovery: true,
          selfServiceUnlock: true,
          multiOptionalFactorEnroll: true,
          registration : true,
          autoPush: true,
        },
        authParams: {
          responseType: ['id_token', 'token'],
          issuer: sampleConfig.oidc.issuer,
          display: 'page',
          scopes: sampleConfig.oidc.scope.split(' '),
        },
        recoveryToken: this.resetToken,
        i18n: {
        en: {
          'primaryauth.title': 'Set Your Password',
          'password.reset': 'Set your Password',
          'password.reset.title': 'Set your Password',
          'password.forgot.emailSent.desc' : 'An Email has been sent to {0} with instructions on resetting your password. Click on Use Recovery Token link in the email to change your password.'
        }
      }});
      rSignIn.renderEl({
        el: '#widget-container'
      }, function success(res) {
        if (res.status === 'SUCCESS') {

        } else {
          console.log(res.status)
          window.alert(res.status)
          this.step ++
          // The user can be in another authentication state that requires further action.
          // For more information about these states, see:
          //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
        }
      });

    }
}

/*onStepFourSubmit(){
  this.user.password = this.regStepFourForm.value.password;
  console.log(this.user);
  this.step++;
  //TODO: call update user to add password
}*/

}
