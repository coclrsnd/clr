// import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// import { Router } from '@angular/router';
// @Component({
//   selector: 'app-opened-pages',
//   templateUrl: './opened-pages.component.html',
//   styleUrls: ['./opened-pages.component.scss']
// })
// export class OpenedPagesComponent implements OnChanges {
//   @Input() menusUniqueByKey: any;
//   public navItems: any;
//   public openedNavigation: any;
//   constructor(public router: Router) { }

//   ngOnChanges(changes: SimpleChanges): void {
//       let navData = changes['menusUniqueByKey'].currentValue;
//       this.navItems = navData;

//   }

//   public removeMenu(item: any) {
//     const matchedIndex = this.navItems.findIndex((el: any) => el.url === item.url);
//     this.navItems.splice(matchedIndex, 1);
//     localStorage.setItem('openedNavigation', JSON.stringify(this.navItems));
//     matchedIndex !== 0 ? this.router.navigate([this.navItems[matchedIndex-1].url]) : this.router.navigate([this.navItems[matchedIndex].url])
//   }

// }












import {
  Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChildren, QueryList, ElementRef, AfterViewInit,
  ViewEncapsulation, ChangeDetectorRef, AfterViewChecked, DoCheck, OnChanges, SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-opened-pages',
  templateUrl: './opened-pages.component.html',
  styleUrls: ['./opened-pages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OpenedPagesComponent implements OnInit, AfterViewInit, AfterViewChecked, OnChanges {
  @Input() menusUniqueByKey: any;
  @Input() LayoutfixedSidebar: boolean;
  public openedNavigation: any;
  @ViewChildren('vcMenuItems') vcMenuItems: QueryList<ElementRef>;
  public subMenuLength = 8;
  public ddlSubmenu: any = [[]];
  public ddlMenu: any = [];
  public tabName: string = '';
  public reinitMenu = false;
  public arrangeMenuRetry: number = 0;


  public menuItems: any;
  public showDDLPopUp = false;

  public selectedIndex: number = -1;
  public isFirstTimeDone = false;
  constructor(private ac: ActivatedRoute,
    public router: Router,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.menuItems = this.menusUniqueByKey;
    if (this.menuItems && this.menuItems.length) {
      this.menuItems.sort((a: any, b: any) => (a.OrderNumber > b.OrderNumber) ? 1 : -1);
    }
    this.ac.queryParams
      .subscribe((q) => {
        this.tabName = q['Tab'] ? q['Tab'] : '';
        if (this.isFirstTimeDone) {
          this.showSelectedMenu(this.tabName);
        } else {
          this.showSelectedMenu(this.tabName);
        }
      });
    setTimeout(() => {
      this.arrangeMenus();
    }, 1000);
  }

  public removeMenu(item: any) {
    const matchedIndex = this.menuItems.findIndex((el: any) => el.url === item.url);
    this.menuItems.splice(matchedIndex, 1);
    localStorage.setItem('openedNavigation', JSON.stringify(this.menuItems));
    matchedIndex !== 0 ? this.router.navigate([this.menuItems[matchedIndex - 1].url]) : this.router.navigate([this.menuItems[matchedIndex].url]);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menusUniqueByKey']) {
      let navData = changes['menusUniqueByKey']?.currentValue;
      this.menuItems = navData;
      this.showDDLPopUp = false;
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.arrangeMenus();
  }

  @HostListener('window:click', ['$event'])
  onClickOutside(event: any) {

  }



  ngAfterViewInit() {

    setTimeout(() => {
      this.arrangeMenus();
    }, 100);
    if (this.isFirstTimeDone === false && this.tabName !== '') {
      setTimeout(() => {
        this.showSelectedMenu(this.tabName);
        this.cd.detectChanges();
      }, 11);
    }
    this.isFirstTimeDone = true;
    this.reinitMenu = true;
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }



  public onMenuSettingClick() {
    // this.menuSettingClicked.emit();
  }

  arrangeMenus() {
    this.ddlMenu.splice(0, this.ddlMenu.length);
    this.ddlSubmenu = [[]];

    const menuArray = this.vcMenuItems.toArray();
    if ((!menuArray || menuArray.length === 0) && this.arrangeMenuRetry <= 5) {
      this.arrangeMenuRetry = this.arrangeMenuRetry + 1;
      setTimeout(() => {
        this.arrangeMenus();
      }, 10);
      return;
    }
    if (menuArray && menuArray.length > 0) {
      const firstMenu = menuArray[0].nativeElement;
      const length = menuArray.length;

      for (let i = 0; i < length; i++) {
        menuArray[i].nativeElement.style.display = '';
        if (firstMenu.offsetTop !== menuArray[i].nativeElement.offsetTop) {
          menuArray[i].nativeElement.style.display = 'none';
          this.ddlMenu.push(this.menuItems[i]);
        }
      }
    }

    if (this.ddlMenu.length > 0) {
      let maxMenus = 0;
      let subMenuIndex = 0;
      const subMenuArra = [];
      if (this.ddlMenu) {
        //this.ddlMenu.sort((a: any, b: any) => a.TabName.localeCompare(b.TabName))

        this.ddlMenu.forEach((element: any) => {
          if (maxMenus < this.subMenuLength) {
            this.ddlSubmenu[subMenuIndex][maxMenus] = element;
            maxMenus = maxMenus + 1
          } else {
            maxMenus = 1;
            subMenuIndex = subMenuIndex + 1;
            this.ddlSubmenu.push([[]]);
            this.ddlSubmenu[subMenuIndex][0] = element;
          }
        });
      }
    }
  }


  showSelectedMenu(TabName: any) {
    let fromDDL = false;

    // this.showDDLPopUp = false;
    this.selectedIndex = this.menuItems && this.menuItems.findIndex((e: any) => {
      return e.TabName === TabName;
    });
    setTimeout(() => {
      const subIndex = this.ddlMenu.findIndex((e: any) => {
        return e.TabName === TabName;
      });

      if (subIndex > -1) {
        fromDDL = true;
      }

      if (fromDDL) {
        this.reinitMenu = false;
        const index = this.menuItems.findIndex((e: any) => {
          return e.TabName === TabName;
        });
        const obj = this.menuItems.splice(index, 1);
        this.menuItems.splice(0, 0, obj[0]);
        setTimeout(() => {
          this.selectedIndex = 0;
          this.arrangeMenus();
          // this.menuClicked.emit(this.menuItems[0]);
          this.cd.detectChanges();
        }, 120);
        //
      } else {
        this.cd.detectChanges();
        if (this.menuItems && this.menuItems.length > 0 && this.selectedIndex >= 0) {
          // this.menuClicked.emit(this.menuItems[this.selectedIndex]);
        }
      }
    }, 100);
  }

  onMenuClick(event: any, i: any, fromDDL = false) {
    // if (!fromDDL) {
    //   this.showDDLPopUp = false;
    // }

    this.router.navigate([event.url]);
    this.onDDLClick();
  }

  onDDLClick() {
    this.showDDLPopUp = !this.showDDLPopUp;
  }

  public defaultMenu(): void {
    this.selectedIndex = -1;
  }

  public refreshMenuItem(): void {
    this.menuItems = [...this.menuItems];
    this.arrangeMenus();
  }
}


