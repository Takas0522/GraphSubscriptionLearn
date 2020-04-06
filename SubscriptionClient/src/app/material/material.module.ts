import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule
  ],
  exports: [
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule
  ]
})
export class MaterialModule { }
