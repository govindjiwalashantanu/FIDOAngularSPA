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
import { OktaAuthService } from '@okta/okta-angular';
import sampleConfig from '../.samples.config';
declare let OktaAuth : any;

interface ResourceServerExample {
  label: String;
  url: String;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean;
  resourceServerExamples: Array<ResourceServerExample>;
  userName: string;

  constructor(public oktaAuth: OktaAuthService) {
    this.resourceServerExamples = [
      {
        label: 'Node/Express Resource Server Example',
        url: 'https://github.com/okta/samples-nodejs-express-4/tree/master/resource-server',
      },
      {
        label: 'Java/Spring MVC Resource Server Example',
        url: 'https://github.com/okta/samples-java-spring-mvc/tree/master/resource-server',
      },
    ]
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated)
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (this.isAuthenticated) {
      const userClaims = await this.oktaAuth.getUser();
      this.userName = userClaims.name;
    }else{

      var config = {
      url: 'https://pocrogers.okta.com',

      // Optional config
      issuer: 'https://pocrogers.okta.com/oauth2/default',
      clientId: sampleConfig.oidc.clientId,
      redirectUri: sampleConfig.oidc.redirectUri,

      // Override the default authorize and userinfo URLs
      authorizeUrl: 'https://pocrogers.okta.com/oauth2/default/v1/authorize',
      userinfoUrl: 'https://pocrogers.okta.com/oauth2/default/v1/userinfo',

      // TokenManager config
      tokenManager: {
        storage: 'sessionStorage'
      }
      };
      //console.log(config);

      var authClient = new OktaAuth(config);
      console.log(authClient);

      authClient.token.getWithoutPrompt({
        responseType: ['id_token','token'] // or array of types
      })
      .then(function(tokenOrTokens) {
        //console.log("I AM HERE");
        window.location.href = "/oktaLogin"
      })
      .catch(function(err) {
        // handle OAuthError
      });
    }
  }
}
