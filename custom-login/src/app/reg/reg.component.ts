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
import * as $ from 'jquery';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css']
})
export class RegComponent implements OnInit {
  regStepOneForm = this.fb.group({
    accountNo: ['',Validators.required],
    postalCode: ['',Validators.required],
  });

  regStepTwoForm = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    confirmEmail: ['',[Validators.required, Validators.email]]
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
  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {
    this.step = '1';
  }

  ngOnInit() {
    this.step = '1';
    this.step = this.route.snapshot.paramMap.get("step")
    if(!this.step)this.step='1';
  }

  back(){
    if(this.step=='1') return;
    this.step--;
  }

  sendUser(){
    console.log("SNEFNONFOINOISNBFUOUIFBSUIFHIUFHUI")
    var email = $('input[formcontrolname="email"]').val()
    $({
      url: "https://reset-password-okta.glitch.me/activateUser",
      data: {
        "email": email
      },
      cache: false,
      type: "get",
      success: function(response) {
        console.log(response)
      },
      error: function(xhr) {

      }
    });
  }

  continue(){
    if(this.step=='6') return;
    this.step++;
  }

  onStepOneSubmit() {

    // TODO: Use EventEmitter with form value
    this.user.accountNo = this.regStepOneForm.value.accountNo;
    this.user.postalCode = this.regStepOneForm.value.postalCode;
    this.user.planId = "Generated PlanId";
    console.log(this.user);
    this.step ++;



}

onStepTwoSubmit() {
  var email = $('input[formcontrolname="email"]').val()
  this.user.email = email
  this.user.login = email
  // $.ajax({
  //   url: "https://reset-password-okta.glitch.me/activateUser",
  //   data: {
  //     email: email,
  //     accountNumber: this.user.accountNo,
  //     postalCode: this.user.postalCode
  //
  //   },
  //   cache: false,
  //   type: "get",
  //   success: function(response) {
  //     console.log(response)
  //   },
  //   error: function(xhr) {
  //
  //   }
  // });
  const data = new HttpParams()
      .set('email', email)
      .set('accountNumber', this.user.accountNo)
      .set('postalCode', this.user.postalCode);
      this.http.post<any>("https://reset-password-okta.glitch.me/activateUser", data).subscribe(response => {
        console.log(response)
      })

  console.log(this.user);
  this.step ++;

}

onStepThreeSubmit() {
  window.alert("CHEEKY")
  var code = $('input[formcontrolname="code"]').val()
  $(document).ready(function(){
    var signIn = new OktaSignIn({baseUrl: 'https://pocrogers.okta.com',
    logo: sampleConfig.oidc.logo,
    recoveryToken: code,
    i18n: {
    en: {
      'primaryauth.title': 'Set Your Password'
    }
  }});
    signIn.renderEl({
      el: '#widget-container'
    }, function success(res) {
      if (res.status === 'SUCCESS') {
        console.log('Do something with this sessionToken', res.session.token);
        res.session.setCookieAndRedirect('http://localhost:8080/login');
      } else {
        console.log(res.status)
        window.alert(res.status)
        this.step ++
        // The user can be in another authentication state that requires further action.
        // For more information about these states, see:
        //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
      }
    });
  });

  //this.step ++;
}

onStepFourSubmit(){
  this.user.password = this.regStepFourForm.value.password;
  console.log(this.user);
  this.step++;
  //TODO: call update user to add password
}

}
