import { Component } from '@angular/core';
import { UserAgentApplication } from 'msal';
import { environment } from 'src/environments/environment';
import { MsalService } from './msal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  constructor(
    private msalService: MsalService
  ) {}
}
