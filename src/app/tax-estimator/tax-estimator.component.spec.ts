import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaxEstimatorComponent } from './tax-estimator.component';

describe('TaxEstimatorComponent', () => {
  let component: TaxEstimatorComponent;
  let fixture: ComponentFixture<TaxEstimatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatIconModule, MatDividerModule, MatInputModule, NoopAnimationsModule],
      declarations: [TaxEstimatorComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxEstimatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit button', () => {
    it('should be disabled when the form is invalid', () => {
      const submitBtn = fixture.debugElement.query(By.css('#submit-btn'));

      expect(component.taxForm.valid).toBeFalse();
      expect(submitBtn.nativeElement.disabled).toBeTrue();
    });

    it('should call the calculate method when click', () => {
      spyOn(component, 'calculate').and.stub();
      const submitBtn = fixture.debugElement.query(By.css('#submit-btn'));

      submitBtn.triggerEventHandler('click', null);

      expect(component.calculate).toHaveBeenCalled();
    });
  });

  describe('tax estimate display', () => {
    it('should display the values from the taxBreakdown object', () => {
      component.taxBreakdown = { incomeTax: 65000, exemptions: 8000, taxAfterExemptions: 2650 }
      fixture.detectChanges();
      const elArray = fixture.debugElement.queryAll(By.css('.tax-estimate'));

      expect(elArray.length).toEqual(3);
      expect(elArray[0].nativeElement.textContent).toContain('Base tax: $65,000.00');
      expect(elArray[1].nativeElement.textContent).toContain('Total exemptions: $8,000.00');
      expect(elArray[2].nativeElement.textContent).toContain('Tax due/Refund: $2,650.00');
    });
  });

  describe('calculate', () => {
    it('should call the appropriate methods then set the values for the taxBreakdown object', () => {
      spyOn(component, 'calculateIncomeTax').and.returnValue(5350);
      spyOn(component, 'calculateChildExemption').and.returnValue(8000);
      spyOn(component, 'calculateParentExemption').and.returnValue(2000);
      spyOn(component, 'calculateTotalExemptions').and.returnValue(8000);
      component.taxForm.setValue({
        income: 65000,
        numChildren: 2,
        numParents: 1
      });

      component.calculate();

      expect(component.calculateChildExemption).toHaveBeenCalledTimes(1);
      expect(component.calculateParentExemption).toHaveBeenCalledTimes(1);
      expect(component.taxBreakdown.incomeTax).toEqual(5350);
      expect(component.taxBreakdown.exemptions).toEqual(8000);
      expect(component.taxBreakdown.taxAfterExemptions).toEqual(-2650);
    });
  });

  describe('calculateIncomeTax', () => {
    it('should return the correct income tax amount when the income is less than or equal to 40000', () => {
      component.taxForm.setValue({ income: 40000, numChildren: 0, numParents: 0 });

      expect(component.calculateIncomeTax()).toEqual(800);
    });

    it('should return the correct income tax amount when the income is greater than 40000 and less than or equal to 80000', () => {
      component.taxForm.setValue({ income: 41000, numChildren: 0, numParents: 0 });

      expect(component.calculateIncomeTax()).toBeCloseTo(870);

      component.taxForm.setValue({ income: 80000, numChildren: 0, numParents: 0 });

      expect(component.calculateIncomeTax()).toBeCloseTo(3600);
    });

    it('should return the correct income tax amount when the income is greater than 80000 and less than or equal to 120000', () => {
      component.taxForm.setValue({ income: 81000, numChildren: 0, numParents: 0 });

      expect(component.calculateIncomeTax()).toBeCloseTo(3720);

      component.taxForm.setValue({ income: 120000, numChildren: 0, numParents: 0 });

      expect(component.calculateIncomeTax()).toBeCloseTo(8400);
    });

    it('should return the correct income tax amount when the income is greater than 120000', () => {
      component.taxForm.setValue({ income: 121000, numChildren: 0, numParents: 0 });

      expect(component.calculateIncomeTax()).toBeCloseTo(7770);

      component.taxForm.setValue({ income: 999999, numChildren: 0, numParents: 0 });

      expect(component.calculateIncomeTax()).toBeCloseTo(157199.83, 2);
    });
  });

  describe('calculateChildExemption', () => {
    it('should return the correct result based on the number of children', () => {
      component.taxForm.setValue({ income: 0, numChildren: 0, numParents: 0 });

      expect(component.calculateChildExemption()).toEqual(0);

      component.taxForm.setValue({ income: 0, numChildren: 1, numParents: 0 });

      expect(component.calculateChildExemption()).toEqual(4000);

      component.taxForm.setValue({ income: 0, numChildren: 10, numParents: 0 });

      expect(component.calculateChildExemption()).toEqual(40000);
    });
  });

  describe('calculateParentExemption', () => {
    it('should return the correct result based on the number of children', () => {
      component.taxForm.setValue({ income: 0, numChildren: 0, numParents: 0 });

      expect(component.calculateParentExemption()).toEqual(0);

      component.taxForm.setValue({ income: 0, numChildren: 0, numParents: 1 });

      expect(component.calculateParentExemption()).toEqual(2000);

      component.taxForm.setValue({ income: 0, numChildren: 0, numParents: 10 });

      expect(component.calculateParentExemption()).toEqual(20000);
    });

    describe('calculateTotalExemptions', () => {
      it('should return the correct exemption amount', () => {
        expect(component.calculateTotalExemptions(7000)).toEqual(7000);
        expect(component.calculateTotalExemptions(9000)).toEqual(8000);
      });
    });
  });

});
