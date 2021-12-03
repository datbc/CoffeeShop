import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular'
import * as OktaSignIn from '@okta/okta-signin-widget';
import myappConfig from 'src/app/config/myapp-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthService) { 
    // customer login page
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      features: {
        registration: true
      },
      baseUrl: myappConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myappConfig.oidc.clientId,
      redirectUri: myappConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myappConfig.oidc.issuer,
        scopes: myappConfig.oidc.scopes
      }
    });

  }

  ngOnInit(): void {
    this.oktaSignin.remove();

    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'}, 
      (response) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuthService.signInWithRedirect().then(res => {
            console.log(res);
          });
        }
      },
      (error) => {
        throw error;
      }
    );
  }

}
