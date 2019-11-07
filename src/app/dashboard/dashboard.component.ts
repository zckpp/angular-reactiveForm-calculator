import {Component, OnInit} from '@angular/core';
import {FormControl, FormBuilder, FormArray, FormGroup} from '@angular/forms';
import {map, startWith, debounceTime, tap, distinctUntilChanged, filter, switchMap, mergeMap} from 'rxjs/operators';
import {commitDate} from '../commit-date';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  calculatorForm: FormGroup;
  minDate = new Date(commitDate.minDate);
  maxDate = new Date(commitDate.maxDate);

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.calculatorForm = this.fb.group({
      date: [new Date()],
      amountPerPay: [''],
      amountAnnual: [''],
    });
    this.calculateAnnualAmount();
  }

  calculateAnnualAmount() {
    this.calculatorForm.get('date').valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(val => this.calculateValue());
    // tslint:disable-next-line:max-line-length
    this.calculatorForm.get('amountPerPay').valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(val => this.calculateValue());
  }

  calculateValue() {
    const date = this.calculatorForm.get('date').value;
    const amountPerPay = this.calculatorForm.get('amountPerPay').value;
    let count = 0;
    if (date !== null && amountPerPay > 0) {
      commitDate.date.forEach(dateString => {
        const dateObj = new Date(dateString);
        if (dateObj < date) {
          count++;
        } else if (dateObj > date) {
          return;
        }
      });
      count = 24 - count;
      this.calculatorForm.get('amountAnnual').setValue(amountPerPay * count, {emitEvent: false});
    }
  }

  reset() {
    this.calculatorForm.get('amountPerPay').setValue(0, {emitEvent: false});
    this.calculatorForm.get('amountAnnual').setValue(0, {emitEvent: false});
  }
}
