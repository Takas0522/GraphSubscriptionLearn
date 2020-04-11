import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../signal-r.service';
import { MsalService } from '../msal.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Event } from '@microsoft/microsoft-graph-types';
import { formatDate } from '@angular/common';

class EventData {

  subject = '';
  lastModifiedDateTime: Date | null = null;
  changeType: 'created' | 'updated' | 'deleted' | null = null;

  constructor(
    data: Event,
    changeType: 'created' | 'updated' | 'deleted' | null
  ) {
    this.subject = data.subject;
    this.lastModifiedDateTime = new Date(data.lastModifiedDateTime);
    this.changeType = changeType;
  }
}

@Component({
  selector: 'app-subscription-watch',
  templateUrl: './subscription-watch.component.html',
  styleUrls: ['./subscription-watch.component.scss']
})
export class SubscriptionWatchComponent implements OnInit {

  subscribeEventDatas: EventData[] = [];

  constructor(
    private signalRService: SignalRService,
    private msalService: MsalService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.signalRService.settingInit();
    this.signalRService.message$.subscribe(
      (x: {userId: string, eventId: string, changeType: 'created' | 'updated' | 'deleted' | null} | undefined) => {
        if (typeof(x) === 'undefined') {
          return;
        }
        this.getEventData(x.userId, x.eventId, x.changeType);
    });
  }

  private async getEventData(userId: string, eventId: string, changeType: 'created' | 'updated' | 'deleted' | null) {
    const token = await this.msalService.acquireTokenSilent();
    const header: HttpHeaders = new HttpHeaders().append('Authorization', `Bearer ${token}`);
    const url = `https://graph.microsoft.com/v1.0/users/${userId}/events/${eventId}`;
    return this.http.get<Event>(url, { headers: header }).subscribe(res => {
      console.log(res);
      const addData = new EventData(res, changeType);
      console.log(addData)
      this.subscribeEventDatas.unshift(addData);
    });
  }

}
