import { Directive, Output, EventEmitter, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { NgslVisibleEvent } from '../../../interfaces/visible-event.interface';

@Directive({
  selector: '[ngslVisible]'
})
export class NgslVisibleDirective implements OnInit, OnDestroy {

  @Input()
  throttleTime: number = 100;

  @Input()
  ignoreVerticalAxis: boolean = false;

  @Input()
  vPercentage: number = 1;

  @Input()
  checkHorizontalAxis: boolean = false;

  @Input()
  hPercentage: number = 1;

  @Input()
  parent: HTMLElement = undefined;

  @Output()
  ngslVisible = new EventEmitter<NgslVisibleEvent>();

  private scrollWatcherSub: Subscription;

  constructor(private elementRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    this.scrollWatcherSub = fromEvent(this.parent || window, 'scroll')
      .pipe(throttleTime(this.throttleTime))
      .subscribe(scrollEvent => {
        const visibleCheckData = this.isElementVisible;
        this.ngslVisible.emit({
          scrollEvent,
          visible: visibleCheckData.visible,
          hVisiblePercentage: visibleCheckData.hPercentage,
          vVisiblePercentage: visibleCheckData.vPercentage
        });
      });
  }

  axisVisibleVerification({
    upperBound,
    lowerBound,
    parentUpperBound,
    parentLowerBound,
    originalSize,
    percentage
  }: {
    upperBound: number;
    lowerBound: number;
    parentUpperBound: number;
    parentLowerBound: number;
    originalSize: number;
    percentage: number;
  }): {
    visible: boolean;
    p: number;
  } {
    let _percentage = Math.min(1, Math.max(percentage, 0));
    let visiblePortion = originalSize;
    if (upperBound < parentUpperBound) {
      visiblePortion -= Math.abs(parentUpperBound - upperBound);
    }

    if (lowerBound > parentLowerBound) {
      visiblePortion -= lowerBound - parentLowerBound;
    }

    const p = visiblePortion / originalSize;

    return {
      visible: p >= _percentage,
      p: Math.max(0, p)
    };
  }

  get isElementVisible(): {
    visible: boolean;
    vPercentage: number;
    hPercentage?: number;
  } {
    const box = this.elementRef.nativeElement.getBoundingClientRect();

    let hAxis = {
      visible: true,
      p: 1
    };

    if (this.checkHorizontalAxis) {
      let parentUpperBound = 0;
      let parentLowerBound = window.innerWidth;
      if (this.parent && this.parent.getBoundingClientRect) {
        const rect = this.parent.getBoundingClientRect();
        parentUpperBound = rect.left;
        parentLowerBound = rect.right;
      }
      hAxis = this.axisVisibleVerification({
        upperBound: box.left,
        lowerBound: box.right,
        parentUpperBound,
        parentLowerBound,
        originalSize: box.width,
        percentage: this.hPercentage
      });
    }

    let vAxis = {
      visible: true,
      p: 1
    };

    if (!this.ignoreVerticalAxis) {
      let parentUpperBound = 0;
      let parentLowerBound = window.innerHeight;
      if (this.parent && this.parent.getBoundingClientRect) {
        const rect = this.parent.getBoundingClientRect();
        parentUpperBound = rect.top;
        parentLowerBound = rect.bottom;
      }
      vAxis = this.axisVisibleVerification({
        upperBound: box.top,
        lowerBound: box.bottom,
        parentUpperBound,
        parentLowerBound,
        originalSize: box.height,
        percentage: this.vPercentage
      });
    }

    return {
      visible: hAxis.visible && vAxis.visible,
      vPercentage: vAxis.p,
      hPercentage: hAxis.p
    };
  }

  ngOnDestroy(): void {
    this.scrollWatcherSub.unsubscribe();
  }

}
