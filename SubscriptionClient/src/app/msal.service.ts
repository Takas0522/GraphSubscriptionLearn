import { Injectable } from '@angular/core';
import { UserAgentApplication, Account } from 'msal';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

export class LoginStateModel {
  isLogin = false;
  acccount: Account | null = null;
}

@Injectable({
  providedIn: 'root'
})
export class MsalService {

  private readonly msalApplication = new UserAgentApplication({auth: environment.msalConfig.auth});
  private account: Account | null = null;
  private loginState: BehaviorSubject<LoginStateModel> = new BehaviorSubject<LoginStateModel>(new LoginStateModel());
  get loginState$() {
    return this.loginState.asObservable();
  }

  constructor() {
    this.msalApplication.handleRedirectCallback((err, res) => {
      if (err !== null) {
        console.log(err);
      }
      if (res !== null) {
        console.log(res);
      }
    });
    const ac = this.msalApplication.getAccount();
    if (ac !== null) {
      this.account = ac;
      this.loginState.next({ isLogin: true, acccount: ac });
    }
  }

  async login() {
    if (this.account !== null) {
      return;
    }
    const res = await this.msalApplication.loginPopup({ scopes: environment.msalConfig.graphScopes });
    if (res.account !== null) {
      this.account = res.account;
      this.loginState.next({ isLogin: true, acccount: res.account });
      return;
    }
    this.loginState.next({ isLogin: false, acccount: null });
  }

  async acquireTokenSilent() {
    const token = await this.msalApplication.acquireTokenSilent({ scopes: environment.msalConfig.graphScopes});
    return token.accessToken;
  }
}
