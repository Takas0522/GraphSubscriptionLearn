import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';

interface ISignalRConnectionInfo {
  url: string;
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private readonly baseUrl = 'https://webhook-trigger-okawa-test.azurewebsites.net/api/';
  private message: BehaviorSubject<any> = new BehaviorSubject(undefined);
  private hubConnection: HubConnection;
  get message$() {
    return this.message.asObservable();
  }

  constructor(
    private http: HttpClient
  ) { }

  private getConnectionInfo(): Observable<ISignalRConnectionInfo> {
    const requestUrl = `${this.baseUrl}negotiate`;
    return this.http.get<ISignalRConnectionInfo>(requestUrl);
  }

  settingInit() {
    this.getConnectionInfo().subscribe(info => {
        const options = {
            accessTokenFactory: () => info.accessToken
        };

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(info.url, options)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.hubConnection.start().catch(err => console.error(err.toString()));

        this.hubConnection.on('notify', (data: any) => {
            console.log(data);
            this.message.next(data);
        });
    });
  }
}
