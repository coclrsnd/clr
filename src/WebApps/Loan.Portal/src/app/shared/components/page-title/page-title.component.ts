import { SharedService } from '../../shared.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {
  public pageTitle: string = '';
  constructor(private titleService: Title, private router: Router, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.changedTitleName.subscribe(title => this.pageTitle = title);
  }

}
