import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SharedService } from './shared/shared.service';
import { AuthService } from './services/auth.service';
import { UserService } from './login/user-service';
import { APP_CONSTANTS } from './app-constants';
import { ApiService } from './services/api.service';
import { toInteger } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'RailCar';
  topPosToStartShowing = 200;
  isShowDiv: boolean;
  isShowBody: boolean;
  isOnLoginPage: boolean = false;
  LayoutfixedSidebar: boolean = false;
  routeData: any;
  openedNavigation: any;
  menusUniqueByKey: any;
  triggerResize: boolean = false;
  shortUserName: string = APP_CONSTANTS.emptyString;
  public todayDate = new Date().getFullYear();
  orgLogo: string;
  constructor(private translate: TranslateService, private router: Router,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private authService:AuthService,
    private userService: UserService,
    private titleService: Title) {
    translate.setDefaultLang('en');
  }
  ngOnInit() {
    this.setRouteTitleAndOpenedMenu();
  }

  ngAfterViewInit(): void {
    this.renderer.listen(document, 'scroll', () => {
      const scrollPosition = window.document.body.scrollTop || document.documentElement.scrollTop || document.body.scrollTop || 0;
      (scrollPosition >= this.topPosToStartShowing) ? this.isShowBody = true : this.isShowBody = false;
    });
  }
  public scrollTopBody() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.isShowDiv=false;
  }

  public fixedSidebar(event): void {
    this.LayoutfixedSidebar = event;
  }
  public setRouteTitleAndOpenedMenu(): void {
    let navData: any = [];
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      ).subscribe(() => {
        const rt = this.getChild(this.activatedRoute);
        this.scrollTopBody();
        rt.data.subscribe((data: any) => {
          const isUserLoggedIn = this.authService.isLoggedIn();
          this.orgLogo = ApiService.LogoPath;
          data.title === 'Dashboard' ? this.shortUserName = APP_CONSTANTS.emptyString : this.shortUserName;
          if (isUserLoggedIn && this.shortUserName === APP_CONSTANTS.emptyString || data.title === 'Dashboard' ) {
            this.getUserName();
          };
          data.title === 'Login' ||  data.title === 'Sign Up' || data.title === 'Forgot Password' || data.title === 'Reset Password' || data.title === 'Verify Email'? this.isOnLoginPage = false :  this.isOnLoginPage = true;
          let currentTitle = rt.snapshot.data.parent !== undefined ? rt.snapshot.data.parent + ' ' + rt.snapshot.data.title : rt.snapshot.data.title;
          this.sharedService.changeTitle(currentTitle);
        });
          this.sharedService.changedTitleName.subscribe(title => this.title = title);
          this.titleService.setTitle(this.title);
          this.openedNavigation = localStorage.getItem('openedNavigation');
          this.openedNavigation ? navData = JSON.parse(this.openedNavigation) : navData = [];
          navData.push({
            'title': rt.snapshot.data.parent !== undefined ? rt.snapshot.data.parent + ' ' + rt.snapshot.data.title : rt.snapshot.data.title,
            'url': rt.snapshot._routerState.url
          });

          const key = 'url';
          this.menusUniqueByKey = [...new Map(navData.map((item: any) =>[item[key], item])).values()];
          const filteredMenus = this.menusUniqueByKey.filter((item: any) => (item.title.toLowerCase() != 'login' &&
          item.title.toLowerCase() != 'reset password' &&
          item.title.toLowerCase() != 'sign up' &&
          item.title.toLowerCase() != 'forgot password' &&
          item.title.toLowerCase() != 'verify email' &&
          item.title.toLowerCase() != 'page not found'
          ));
          this.sharedService.openedMenus(filteredMenus);
          localStorage.setItem('openedNavigation', JSON.stringify(filteredMenus));
      });
  }
  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  public getUserName(): void {
    setTimeout(() => {
      if(toInteger(ApiService.UserId) > 0){
      this.userService.GetUserByID(+ApiService.UserId).subscribe((response: any) => {
        // get user profile name
        if(response?.data?.users?.nodes[0]?.userName)
        this.shortUserName = this.sharedService.getProfileName(
          response?.data?.users?.nodes[0]?.userName,
          ""
        );
      });
    }
    }, 100);
  }
}
