import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxEstimatorComponent } from './tax-estimator/tax-estimator.component';

const routes: Routes = [
  { path: '', redirectTo: 'tax-estimator', pathMatch: 'full' },
  { path: 'tax-estimator', component: TaxEstimatorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
