import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImageFallBack]'
})
export class ImageFallBackDirective {
  fallbackUrl: string = 'assets/images/event-default.png';

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  @HostListener('error')
  private errorHandler() {
    this.handleErrorWithImg();
  }

  private handleErrorWithImg() {
    const currentImg = this._el.nativeElement;

    this._renderer.setAttribute(currentImg, 'src', this.fallbackUrl);
  }
}
