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
  subscriptionDatas: { id: string, resource: string, changeType: string, expirationDateTime: Date }[] = [];
  displayedColumns: string[] = ['resource', 'changeType', 'expirationDateTime', 'update', 'delete'];

  constructor(
    private msalService: MsalService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.msalService.loginState$.subscribe(x => {
      this.isLogin = (x.acccount !== null);
    });
    this.getSubscriptionSettings();
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
      this.getSubscriptionSettings();
    });
  }

  async getSubscriptionSettings() {
    const token = await this.msalService.acquireTokenSilent();
    const header: HttpHeaders = new HttpHeaders().append('Authorization', `Bearer ${token}`);

    return this.http.get('https://graph.microsoft.com/v1.0/subscriptions',  { headers: header }).subscribe(res => {
      const datas: any[] = (res as any).value;
      this.subscriptionDatas = datas.map(m => {
        return {
          id: m.id,
          changeType: m.changeType,
          expirationDateTime: new Date(m.expirationDateTime),
          resource: m.resource
        };
      });
    });
  }

  async updateSubscription(id: string) {
    const token = await this.msalService.acquireTokenSilent();
    const header: HttpHeaders = new HttpHeaders().append('Authorization', `Bearer ${token}`);

    const setExpDate = new Date();
    setExpDate.setHours(setExpDate.getHours() + 3);
    const setExpDateJson = setExpDate.toJSON();

    const subscription = {
      expirationDateTime: setExpDateJson
   };

    this.http.patch(`https://graph.microsoft.com/v1.0/subscriptions/${id}`, subscription , { headers: header }).subscribe(res => {
      console.log(res);
      this.getSubscriptionSettings();
    });
  }

  async deleteSubscription(id: string) {
    const token = await this.msalService.acquireTokenSilent();
    const header: HttpHeaders = new HttpHeaders().append('Authorization', `Bearer ${token}`);

    this.http.delete(`https://graph.microsoft.com/v1.0/subscriptions/${id}`, { headers: header }).subscribe(res => {
      console.log(res);
      this.getSubscriptionSettings();
    });
  }

}
