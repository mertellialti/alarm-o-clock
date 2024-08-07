import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appIonPickerValueAccessor]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonPickerValueAccessorDirective,
      multi: true
    }
  ]
})
export class IonPickerValueAccessorDirective implements ControlValueAccessor {
  private onChange: any;
  private onTouched: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('ionChange', ['$event.target.value'])
  handleChange(value: any) {
    this.onChange(value);
  }

  writeValue(value: any): void {
    this.renderer.setProperty(this.el.nativeElement, 'value', value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }
}
