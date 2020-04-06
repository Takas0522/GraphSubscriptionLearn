import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule
  ],
  exports: [
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule
  ]
})
export class MaterialModule { }
