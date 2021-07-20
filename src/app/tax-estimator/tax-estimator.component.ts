import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tax-estimator',
  templateUrl: './tax-estimator.component.html',
  styleUrls: ['./tax-estimator.component.scss']
})
export class TaxEstimatorComponent implements OnInit {

  taxForm: FormGroup;
  taxBreakdown = {
    incomeTax: 0,
    exemptions: 0,
    taxAfterExemptions: 0
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.taxForm = this.fb.group({
      income: ['', [Validators.required, Validators.min(0)]],
      numChildren: ['', [Validators.required, Validators.min(0)]],
      numParents: ['', [Validators.required, Validators.min(0)]]
    })
  }

  calculate(): void {
    this.taxBreakdown.incomeTax = this.calculateIncomeTax();
    const childExemption: number = this.calculateChildExemption();
    const parentExemption: number = this.calculateParentExemption();

    this.taxBreakdown.exemptions = this.calculateTotalExemptions(childExemption + parentExemption);
    this.taxBreakdown.taxAfterExemptions = this.taxBreakdown.incomeTax - this.taxBreakdown.exemptions;
  }

  calculateIncomeTax(): number {
    const income: number = this.taxForm.value.income;
    let taxAmount: number = 0;

    if (income <= 40000) {
      taxAmount = income * 0.02;
    } else if (income > 40000 && income <= 80000) {
      taxAmount = 800 + ((income - 40000) * 0.07);
    } else if (income > 80000 && income <= 120000) {
      taxAmount = 3600 + ((income - 80000) * 0.12);
    } else {
      taxAmount = 7600 + ((income - 120000) * 0.17);
    }
    return taxAmount;
  }

  calculateChildExemption(): number {
    const numChildren: number = this.taxForm.value.numChildren;

    return numChildren * 4000;
  }

  calculateParentExemption(): number {
    const numParents: number = this.taxForm.value.numParents;

    return numParents * 2000;
  }

  calculateTotalExemptions(exemptions): number {
    return Math.min(8000, exemptions);
  }

}
