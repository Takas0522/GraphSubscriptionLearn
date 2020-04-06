import { Component, OnInit } from '@angular/core';
import { MsalService } from '../msal.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-subscription-settings',
  templateUrl: './subscription-settings.component.html',
  styleUrls: ['./subscription-settings.component.scss']
})
export class SubscriptionSettingsComponent implements OnInit {

  isLogin = false;
  expirationDateTime = '';

  constructor(
    private msalService: MsalService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.msalService.loginState$.subscribe(x => {
      this.isLogin = (x.acccount !== null);
    });
  }

  login() {
    this.msalService.login();
  }

  async subscribeSettings() {
    const token = await this.msalService.acquireTokenSilent();
    const header: HttpHeaders = new HttpHeaders().append('Authorization', `Bearer ${token}`);

    const setExpDate = new Date();
    setExpDate.setHours(setExpDate.getHours() + 3);
    const setExpDateJson = setExpDate.toJSON();

    const subscription = {
      changeType: 'created,updated',
      notificationUrl: 'https://webhook-trigger-okawa-test.azurewebsites.net/api/HttpTrigger1?code=UJlAhypIg0RbfO1nv5RNq9t0cUp6udc/AltStmLoUoddaQvhHgjRHw==',
      resource: 'me/events',
      expirationDateTime: setExpDateJson,
      latestSupportedTlsVersion: 'v1_2'
   };

    return this.http.post('https://graph.microsoft.com/v1.0/subscriptions', subscription, { headers: header }).subscribe(res => {
      console.log(res);
      this.expirationDateTime = setExpDateJson;
    });
  }

}
