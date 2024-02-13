import { CommonModule } from '@angular/common';
import { Component, Input, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements ControlValueAccessor {
  // ControlValueAccessor: Defines an interface that acts as a bridge between the Angular forms API and a native element in the DOM.
  // Reason of using @Self: When we inject something into a constructor, it's going to check to see if it's been used recently, and if it has, it's going to reuse that thing that it's kept in memory. Now when it comes to our inputs, we do not want to reuse another control that was already in memory. We want to make sure that this ngControl is unique to the inputs that we're updating in the DOM and the way that we ensure that is to use this self decorator.

  @Input() label = '';
  @Input() type = 'text';

  constructor(@Self() public ngControl: NgControl) {
    // this TextInputComponent'u temsil ediyor.
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
