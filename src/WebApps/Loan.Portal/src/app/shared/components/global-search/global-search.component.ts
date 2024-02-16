import { Component, OnInit, HostListener, ViewChild, ElementRef, Input,EventEmitter, Output  } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import * as cloneDeep_ from 'lodash';
const cloneDeep = cloneDeep_;
import { Router } from '@angular/router';
/**
 * component for global search
 */
@Component({
    selector: 'app-global-search',
    styleUrls: ['./global-search.component.scss'],
    templateUrl: './global-search.component.html'
})

/**
 * class for GlobalSearchComponent
 * @implements OnInit
 */
export class GlobalSearchComponent implements OnInit {
    /** input for application ID from parent app */ @Input() applicationId: string;
    /** instance of form group */ globalSearchForm: UntypedFormGroup;
    /** list to be displayed as search result */ globalList: any[] = [];
    /** copy of list to be displayed as search result */ globalListCopy: any[] = [];
    /** boolean to show/hide search results list */ isSearch = false;
    /** path for search image */
    /** reference of imSearchBar */ @ViewChild('imSearchBar', { static: true }) imSearchBar: ElementRef;
    inputHasValue = false;
    /** variable for holding menu permissions for user */ accessibleUrls: any;
    /** flag to track if global search is open/close */ isGlobalSearchOpen = false;
    callResumeSubscription: any;
    @Output() applicationChange = new EventEmitter<{ url: string,  sameApp: boolean}>();
    /**
     * constructor
     * @param translate instance of TranslateService
     * @param fb instance of FormBuilder
     */
    constructor(public translate: TranslateService, public fb: UntypedFormBuilder, public http: HttpClient, public router: Router) {
        this.globalSearchForm = this.fb.group({
            globalSearch: [''],
            page: true,
            navigation: true
        });
        this.accessibleUrls = [];
    }

    @HostListener('document:click', ['$event'])
    handleDocumentEvent(event: any) {
       this.closeGlobalSearch(event);
    }

    /** ngOnInit */
    ngOnInit() {
      const isMenuExists = localStorage.getItem('openedNavigation');
      if (isMenuExists) {
        JSON.parse(isMenuExists)?.forEach((item: any) => {
          this.accessibleUrls.push(item.url);
      });
      }
    }

    /**
     * host listener for key down
     * @param event: event details
     */
    @HostListener('keydown', ['$event'])
    setRestKeyboardNav(event: any) {
      const eventName = event.target['name'];
        switch (event.keyCode) {
            case 13:
                if (eventName === 'globalSearch') {
                    this.onGlobalSearch(event?.target['value']);
                    setTimeout(() => {
                        this.imSearchBar.nativeElement.focus();
                    }, 800);
                }
                break;
            case 27:
                if (eventName === 'globalSearch') {
                    this.isSearch = false;
                    this.globalSearchForm.controls['globalSearch']?.setValue('');
                }
                break;
        }
    }

    /**
     * host listener for keyup
     */
    @HostListener('keyup', ['$event'])
    addGlobalSearchClass(event: any) {
        if (event.target.getAttribute('data-item') === 'globalSearch' || this.imSearchBar.nativeElement.focus === true) {
            document.getElementById('im-global-search-parent')?.classList.add('focus-within');
            if (this.imSearchBar.nativeElement.value !== '') {
                this.inputHasValue = true;
            } else {
                this.inputHasValue = false;
            }
        } else {
            document.getElementById('im-global-search-parent')?.classList.remove('focus-within');
        }
    }

    /**
     * method to focus search input text box on click
     */
    openSearch(val: any) {
        document.getElementById('im-global-search-parent')?.classList.add('focus-within');
        if (!this.isGlobalSearchOpen) {
            this.imSearchBar.nativeElement.selectionStart = val?.length;
            this.imSearchBar.nativeElement.selectionEnd = val?.length;
        }
        this.isGlobalSearchOpen = true;
    }

    /**
     * method to escape special characters
     * @param term input string
     * @returns escaped string
     */
    escapeSpecialCharacter(term: any) {
        const specialCharArr = ['(', ')'];
        specialCharArr.forEach(char => {
            if (term.indexOf(char) !== -1) {
                term = term.split(char).join('\\' + char);
                // term = term.replace(char, '\\' + char);
            }
        });
        return term;
    }

    /**
     * method to search data
     * @param term search text entered by user
     */
    onGlobalSearch(term: any) {
        term = this.escapeSpecialCharacter(term);
        this.isSearch = true;
        const win = document.getElementsByClassName('targetItem')[0] as HTMLElement;
        if (win) { win.scrollTo(); }
        this.globalSearchForm.controls['page'].setValue(false);
        this.globalSearchForm.controls['navigation'].setValue(false);
        this.filterSearchResults(null);
    }

    /**
     * method to translate input text value
     * @param searchString string that matches from sitemap
     * @param value defines type of search string
     */
    getFormattedSearchString(searchString: any, value: any) {
        const stringArray = searchString.split(' ').map((str: any) => {
            if (value === 'navigation') {
                return this.translate.instant(`navigation.${str}`);
            } else if (value === 'page') {
                return this.translate.instant(`label.${str}`);
            }
        });
        return stringArray.join(' ');
    }

    /**
     * method to create final array
     * @param formattedArray input array
     * @param term search term entered by user
     */
    getFilteredArray(formattedArray: any, term: any) {
        const filteredArray = formattedArray.filter((element: any) => {
            return new RegExp(term, 'gi').test(element.searchString);
        });
        return filteredArray.map((obj:any) => {
            const strArray = obj.description.split(' ').map((str: any) => this.translate.instant(`navigation.${str}`));
            obj.description = strArray.join(' > ');
            delete obj.searchString;
            return obj;
        });
    }

    /**
     * method to filter results based on user's selection of checkboxes
     * @param event event details
     */
    filterSearchResults(event: any) {
        if (event && event !== null) {
            event.stopPropagation();
        }
        // filtering data according to page
        const pageResult = this.globalListCopy.filter((itm: any) => itm.type === 'page');
        // filtering data according to navigation
        const navigationResult = this.globalListCopy.filter((itm: any) => itm.type === 'navigation');
        if (event && this.globalSearchForm.controls[event.target.name]) {
            this.globalSearchForm.controls[event.target.name].setValue(event.target.checked);
            // this.globalSearchForm.controls[event.target.name].value = event.target.checked;
        }
        let temp: any[] = [];
        // when page filter is selected, page filtered data is appended in temp list
        if (this.globalSearchForm.controls['navigation']?.value) {
            temp = temp.concat(navigationResult);
        }
        // when navigation filter is selected, navigation filtered data is appended in temp list
        if (this.globalSearchForm.controls['page'].value) {
            temp = temp.concat(pageResult);
        }
        // if none of the filters is selected entire data is appended in temp list
        if (!this.globalSearchForm.controls['page']?.value && !this.globalSearchForm.controls['navigation']?.value) {
            temp = temp.concat(this.globalListCopy);
        }
        this.globalList = JSON.parse(JSON.stringify(temp));
    }
    /**
     * method to check if call pause
     * @param item page to be navigated to
     */
    checkIfCallPause(item: any) {
        this.redirectUrl(item);
    }

    /**
     * method to navigate to clicked page
     * @param item page to be navigated to
     */
    redirectUrl(item: any) {
      const menuData = localStorage.getItem('openedNavigation');
      if (menuData) {
        const dataFromStorage = JSON.parse(menuData).filter((menu: any) => {
          if (item.description.split(' > ')[1] === this.translate.instant(`navigation.${menu.code}`)
          && this.translate.instant(menu.applicationId) === item.applicationId) {
              return menu;
          }
      });
      if (this.applicationId === dataFromStorage[0].applicationId) {
        const url = item.url.trim().split('/')[1];
        this.router.navigate([url]);
        this.applicationChange.emit({url: '', sameApp: true});
    } else {
        const URL_PATH = location.href;
        const CLIENT_PATH = URL_PATH.substring(0, URL_PATH.indexOf('/client'));
        // const END_PATH = this.resourcePath[dataFromStorage[0].applicationId]
        //     .replace('index.html', item.url);
       // window.location.href = CLIENT_PATH + END_PATH;
         // window.location.href = CLIENT_PATH + END_PATH;
        // const finalPath: string = CLIENT_PATH + END_PATH;
       //  this.applicationChange.emit({url: finalPath, sameApp: false});
    }
      }

        this.isSearch = false;
        this.inputHasValue = false;
        this.globalSearchForm.controls['globalSearch']?.setValue('');
    }

    /**
     * method to clear search text
     */
    clearText() {
        this.globalSearchForm.reset();
        this.globalList = [];
        this.isSearch = false;
        this.inputHasValue = false;
        const input = (document.getElementById('im-search-bar') as HTMLFormElement)['value'];
        if(input === '' && input === null) {
            this.globalSearchForm.controls['globalSearch']?.setValue('');
        }
    }
    setFocuses() {
        document.getElementById('im-search-bar')?.focus();
    }
    closeSearch(event: any){
        const htmlInput = event.target.value;
        if(!htmlInput || htmlInput === '' || htmlInput === null) {
            this.isGlobalSearchOpen = false;
            document.getElementById('im-global-search-parent')?.classList.remove('focus-within');
        }
    }

    /**
     * function to close drop down on outside click
     */
    closeGlobalSearch(event: any) {
        if (event.target.getAttribute('data-item') !== 'globalSearch') {
            this.isSearch = false;
            this.clearText();
            this.isGlobalSearchOpen = false;
            document.getElementById('im-global-search-parent')?.classList.remove('focus-within');
        }
    }

    focusOutInput() {
        if(document.getElementById('im-global-search-parent')) {
            this.isSearch = false;
            this.clearText();
            this.isGlobalSearchOpen = false;
            document.getElementById('im-global-search-parent')?.classList.remove('focus-within');
        }
    }
}




