import { AriaDescriber, FocusMonitor, FOCUS_MONITOR_DEFAULT_OPTIONS } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { AfterViewInit, Directive, ElementRef, HostListener, Inject, Input, NgZone, Optional, PLATFORM_INITIALIZER, Renderer2, ViewContainerRef } from '@angular/core';
import
{
    MAT_TOOLTIP_DEFAULT_OPTIONS,
    MAT_TOOLTIP_SCROLL_STRATEGY,
    MatTooltip,
    MatTooltipDefaultOptions,
    MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
    MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY
} from '@angular/material/tooltip';

@Directive({
  selector: '[appEllipsifyMe]',
  exportAs: 'appEllipsifyMe'
})
export class EllipsifyMeDirective extends MatTooltip implements AfterViewInit {
  @Input()
    get appEllipsifyMe()
    {
        return this.message;
    }
    set appEllipsifyMe(value: string)
    {
        this.message = value;
    }
  domElement: any;
  constructor(@Inject(Overlay) _overlay: Overlay,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(ScrollDispatcher) _scrollDispatcher: ScrollDispatcher,
    _viewContainerRef: ViewContainerRef,
    _ngZone: NgZone,
    @Inject(Platform) _platform: Platform,
    @Inject(AriaDescriber) _ariaDescriber: AriaDescriber,
    @Inject(FocusMonitor) _focusMonitor: FocusMonitor,
    @Inject(MAT_TOOLTIP_SCROLL_STRATEGY) _scrollStrategy: any,
    @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS) _document: Document,
    @Optional() @Inject(Directionality) _dir: Directionality,
    @Optional() @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS)
    _defaultOptions: MatTooltipDefaultOptions) {
      super(
        _overlay,
        elementRef,
        _scrollDispatcher,
        _viewContainerRef,
        _ngZone,
        _platform,
        _ariaDescriber,
        _focusMonitor,
        _scrollStrategy,
        _dir,
        _defaultOptions,
        _document
    );
    this.domElement = this.elementRef.nativeElement; // to get DOM element and store it in global variable
    // setting compulsory required styles to the DOM element
    const elipsifyme = {

    };
    Object.keys(elipsifyme).forEach(newStyle => {
      this.renderer.setStyle(
        this.domElement, `${newStyle}`, elipsifyme[newStyle]
      );
    });
  }

  // to check and add title attribute on the element at the time when application renders first time.
  override ngAfterViewInit(): void {
    // to see effect try removing below two lines and check if the title is added at the first time rendering.
    this.renderer.setProperty(this.domElement, 'scrollTop', 1);
    this.isTitleAttribute();
  }

  @HostListener("window:resize", ["$event.target"])
  isTitleAttribute() {
    // to add or remove title attribute on the element when it is changing width.
    (this.domElement.offsetWidth < this.domElement.scrollWidth) ?
      this.renderer.setAttribute(this.domElement, 'title', this.domElement.textContent) :
      this.renderer.removeAttribute(this.domElement, 'title');
  }

}
