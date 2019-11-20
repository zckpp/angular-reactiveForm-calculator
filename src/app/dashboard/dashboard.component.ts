import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
      }
    );
    this.calculatorForm = this.fb.group({
      date: [new Date()],
      amountPerPay: [''],
      amountAnnual: [0],
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
      this.calculatorForm.get('amountAnnual').setValue(amountPerPay * count, {emitEvent: false});
    }
  }

  reset() {
    location.reload();
  }
}
