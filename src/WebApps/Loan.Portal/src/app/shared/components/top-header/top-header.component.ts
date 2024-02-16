import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent implements OnChanges {
  @ViewChild('searchbar') searchbar: ElementRef;
  @Input() shortUserName;
  @Input() logoPath;
  public shortName: string = '';
  searchText = '';

  toggleSearch: boolean = false;
  constructor(public router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    this.shortName = changes['shortUserName']?.currentValue;
  }

  openSearch() {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }
  searchClose() {
    this.searchText = '';
    this.toggleSearch = false;
  }
  public onLogout() {
    let navData: any = [];
    localStorage.setItem('openedNavigation',navData);
    localStorage.removeItem('Token');
    this.router.navigate(['/']);
  }
}
