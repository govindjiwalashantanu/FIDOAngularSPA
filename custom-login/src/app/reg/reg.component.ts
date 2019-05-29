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
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from "@angular/router";

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
    console.log()
  }

  back(){
    if(this.step=='1') return;
    this.step--;
  }

  continue(){
    if(this.step=='5') return;
    this.step++;
  }

  onStepOneSubmit() {

    // TODO: Use EventEmitter with form value
    this.user.accountNo = this.regStepOneForm.value.accountNo;
    this.user.postalCode = this.regStepOneForm.value.postalCode;
    this.user.planId = "Generated PlanId";
    console.log(this.user);
    this.step ++;

    /*this.http.get("https://selfregistration-demo.glitch.me/").subscribe((data: any) => {
      console.log(this.model);
    }, (err) => {
      console.error(err);
      this.failed = true;
    });*/

  }

  onStepTwoSubmit() {
    this.user.email = this.regStepTwoForm.value.email;
    console.log(this.user);
    this.step ++;
    // TODO: Call Okta Create User
  }

  onStepFourSubmit(){
    this.user.password = this.regStepFourForm.value.password;
    console.log(this.user);
    this.step++;
    //TODO: call update user to add password
  }

}
