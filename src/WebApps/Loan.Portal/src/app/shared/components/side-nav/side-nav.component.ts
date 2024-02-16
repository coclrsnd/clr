import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AppPermissions } from '../../models/permissions';
import { NavItem } from './nav-item';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Output() fixedSidebar = new EventEmitter<any>();
  appPermissions: AppPermissions = new AppPermissions();

  navItems: NavItem[] = [
    {
      displayName: 'Dashboard',
      disabled: this.authService.hasPermission(this.appPermissions.Dashboard),
      iconName: 'icon-dashboard-selected',
      route: 'dashboard',
    },
    {
      displayName: 'Admin',
      disabled: this.authService.hasPermission(this.appPermissions.Admin),
      iconName: 'icon-search-selected',
      route: this.authService.GetSearchLink(),
      children: [
        // {
        //   displayName: 'Facility Map',
        //   disabled: this.authService.hasPermission(this.appPermissions.SearchFacility),
        //   iconName: '',
        //   route: 'search/facility'
        // },
        // {
        //   displayName: 'Storage Order',
        //   disabled: this.authService.hasPermission(this.appPermissions.StorageOrder),
        //   iconName: '',
        //   route: 'search/rider'
        // },
        // {
        //   displayName: 'Vendor',
        //   disabled: this.authService.hasPermission(this.appPermissions.Vendor),
        //   iconName: '',
        //   route: 'search/vendor'
        // },
        // {
        //   displayName: 'Customer',
        //   disabled: this.authService.hasPermission(this.appPermissions.Customer),
        //   iconName: '',
        //   route: 'search/customer'
        // },
        // {
        //   displayName: 'Railcar',
        //   disabled: this.authService.hasPermission(this.appPermissions.RailCars),
        //   iconName: '',
        //   route: 'search/railcar'
        // },
        {
          displayName: 'Users',
          disabled: this.authService.hasPermission(this.appPermissions.Users),
          iconName: '',
          route: 'search/users'
        }
      ]
    },
    // {
    //   displayName: 'Onboard',
    //   disabled: this.authService.hasPermission(this.appPermissions.OnboardCustomer) || this.authService.hasPermission(this.appPermissions.OnboardVendor),
    //   iconName: 'icon-onboard-deselected',
    //   route: this.authService.GetOnboardLink(),
    //   children: [
    //     {
    //       displayName: 'Customer',
    //       disabled: this.authService.hasPermission(this.appPermissions.OnboardCustomer),
    //       iconName: '',
    //       route: 'on-board/customer/create'
    //     },
    //     {
    //       displayName: 'Vendor',
    //       disabled: this.authService.hasPermission(this.appPermissions.OnboardVendor),
    //       iconName: '',
    //       route: 'on-board/vendor/create'
    //     }
    //   ]
    // },
     {
      displayName: 'Reports',
      disabled: this.authService.hasPermission(this.appPermissions.Reports),
      iconName: 'icon-reports-deselected',
      route: 'reports',
      children: [
        {
          displayName: 'Activity Report',
          disabled: this.authService.hasPermission(this.appPermissions.Reports),
          iconName: '',
          route: 'reports/activity-report'
        },
      ]
    },
  ];
  public isPinned: boolean = false;

  constructor(public router: Router,private authService:AuthService) { }

  ngOnInit(): void {
  }

  public onFixSidebar(): void {
    this.isPinned = !this.isPinned;
    this.fixedSidebar.emit(this.isPinned);
  }

}
