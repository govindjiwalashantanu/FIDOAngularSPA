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
import * as OktaSignIn from '@okta/okta-signin-widget';
import sampleConfig from '../.samples.config';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signIn: any;
  constructor() {
    this.signIn = new OktaSignIn({
      /**
       * Note: when using the Sign-In Widget for an ODIC flow, it still
       * needs to be configured with the base URL for your Okta Org. Here
       * we derive it from the given issuer for convenience.
       */
      baseUrl: sampleConfig.oidc.issuer.split('/oauth2')[0],
      clientId: sampleConfig.oidc.clientId,
      redirectUri: sampleConfig.oidc.redirectUri,
      logo: sampleConfig.oidc.logo,
      features: {
        rememberMe: true,
        selfServiceUnlock: true,
        multiOptionalFactorEnroll: true,
        registration : true,
        autoPush: true,
        router: true,
      },
      i18n: {
        en: {
          'primaryauth.title': 'Sign in to your Rogers Account',
          'registration.signup.label': 'New to Rogers?',
          'password.forgot.email.or.username.placeholder': 'Email or Phone Number',
          'password.forgot.email.or.username.tooltip': 'Email or Phone Number',
          'password.forgot.emailSent.desc' : 'An Email has been sent to {0} with instructions on resetting your password. Click on Use Recovery Token link in the email to change your password.'
        },
      },
      authParams: {
        responseType: ['id_token', 'token'],
        issuer: sampleConfig.oidc.issuer,
        display: 'page',
        scopes: sampleConfig.oidc.scope.split(' '),
      },
    });
  }

  ngOnInit() {
    this.signIn.remove();
    this.signIn.renderEl(
      { el: '#sign-in-widget' },
      (res) => {
        console.log("#######################")
        console.log(res)
        console.log("#######################")
        /**
         * In this flow, the success handler will not be called because we redirect
         * to the Okta org for the authentication workflow.
         */
      },
      (err) => {
        throw err;
      },
    );
  }

}
