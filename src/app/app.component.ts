import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { Bank, BankData, AuthInfo } from './model/models';
import { Subscription, Observable, timer } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  readonly requestInfo: Array<Bank> = environment.BANKS;
  banksData: Array<BankData> = [];
  interval$: Observable<number> = timer(0, environment.INTERVAL);
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
      }
      this.getBanksData();
    });
  }

  getBanksData() {
    this.requestInfo.forEach(e => {
      this.subscriptions.add(this.appService.getData(e).subscribe(bankData => this.banksData.push(bankData),
        err => console.error(`Request failed for ${e.bankName} (code:${e.code})`, err)));
    });
  }

  addStatusColorClass(statusMsg: string): string {
    return (statusMsg ? statusMsg.startsWith('2') : false)
    || (statusMsg ? statusMsg.search(/ok/i) > -1 : false) ? 'text-success' : 'text-danger';
  }


  stringifyStats(stats: AuthInfo) {
    const parsed = JSON.stringify(stats).split(',').join(', ');
    return parsed === '{}' ? '' : parsed;
  }
}
