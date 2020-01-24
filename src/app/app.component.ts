import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { Bank, BANKS, BankData, AuthInfo, INTERVAL } from './model/models';
import { Subscription, Observable, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  readonly requestInfo: Array<Bank> = BANKS;
  banksData: Array<BankData> = [];
  interval$: Observable<number> = timer(0, INTERVAL);
  subscriptions: Subscription = new Subscription();
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.refreshData();
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  refreshData() {
    this.interval$.subscribe(() => {
      if (this.subscriptions) {
        this.banksData = [];
        this.subscriptions.unsubscribe();
      }
      this.getBanksData();
    });
  }

  getBanksData() {
    this.requestInfo.forEach(e => {
      this.subscriptions.add(this.appService.getData(e).subscribe(bankData => this.banksData.push(bankData),
        err => console.error(`Request failed for ${e.bankName} (code:${e.code})`)));
    });
  }

  addStatusColorClass(statusMsg: string): string {
    return statusMsg.startsWith('2') || statusMsg.search(/ok/i) > -1 ? 'text-success' : 'text-danger';
  }

  getStatusText(statusMsg: string): string {
    return statusMsg.startsWith('2') || statusMsg.search(/ok/i) > -1 ? 'OK' : 'ERR';
  }

  stringifyStats(stats: AuthInfo) {
    return JSON.stringify(stats).split(',').join(', ');
  }
}
