import { CommonModule } from '@angular/common';
import { Component, Input, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgbAlertModule,
  NgbDateStruct,
  NgbDatepickerConfig,
  NgbDatepickerModule,
  NgbInputDatepickerConfig,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbDatepickerModule,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [NgbInputDatepickerConfig],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label = '';
  maxDate = new Date();
  model: NgbDateStruct | undefined;

  constructor(
    @Self() public ngControl: NgControl,
    config: NgbDatepickerConfig
  ) {
    this.ngControl.valueAccessor = this;
    config.maxDate = {
      year: this.maxDate.getFullYear() - 18,
      month: 1,
      day: 15,
    };
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
