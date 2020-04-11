import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatListModule
  ],
  exports: [
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatListModule
  ]
})
export class MaterialModule { }
