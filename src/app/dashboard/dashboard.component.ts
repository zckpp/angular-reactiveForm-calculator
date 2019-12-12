import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  calculatorForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  commitDate: object;
  maxAnnualAmount: number;
  maxAmounts: [];
  maxAnnualAmountHealthCare: number;
  maxAnnualAmountLimitedPurpose: number;
  maxAnnualAmountDependentSeparate: number;
  maxAnnualAmountDependentJoint: number;
  amountError: boolean;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
  }

  ngOnInit() {
    this.apiService.readDate().subscribe(commitDate => {
        this.commitDate = commitDate;
        this.minDate = new Date(commitDate.minDate);
        this.maxDate = new Date(commitDate.maxDate);
        this.maxAmounts = commitDate.maxAmounts;
      }
    );
    this.calculatorForm = this.fb.group({
      date: [new Date()],
      amountPerPay: [''],
      type: [''],
      amountAnnual: [0],
    });
    this.calculateAnnualAmount();
  }

  calculateAnnualAmount() {
    this.calculatorForm.get('date').valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(val => this.calculateValue());
    // tslint:disable-next-line:max-line-length
    this.calculatorForm.get('amountPerPay').valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(val => this.calculateValue());
    this.calculatorForm.get('type').valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(val => this.calculateValue());
  }

  calculateValue() {
    const date = this.calculatorForm.get('date').value;
    const amountPerPay = this.calculatorForm.get('amountPerPay').value;
    const type = this.calculatorForm.get('type').value;
    let count = 0;
    if (date !== null && amountPerPay > 0) {
      const year = date.getFullYear();
      const tempDate = 'date_' + year.toString();
      this.commitDate[tempDate].forEach(dateString => {
        const dateObj = new Date(dateString);
        if (dateObj <= date) {
          count++;
        } else {
          return;
        }
      });
      count = 24 - count;
      const result = amountPerPay * count;
      if (type) {
        this.maxAnnualAmount = type;
        if (result > this.maxAnnualAmount) {
          this.amountError = true;
          this.calculatorForm.get('amountAnnual').setValue(this.maxAnnualAmount, {emitEvent: false});
        } else {
          this.amountError = false;
          this.calculatorForm.get('amountAnnual').setValue(result, {emitEvent: false});
        }
      }
    }
  }

  reset() {
    location.reload();
  }
}
