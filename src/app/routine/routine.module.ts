import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { RoutineRoutingModule } from './routine-routing.module';
import { RoutineComponent } from './routine/routine.component';
import { SharedModule } from '../shared/shared.module';
import { StaffRoutineComponent } from './staff-routine/staff-routine.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@NgModule({
  declarations: [RoutineComponent, StaffRoutineComponent],
  imports: [
    CommonModule,
    RoutineRoutingModule,
    MatAutocompleteModule,
    ReactiveFormsModule, FormsModule,
    MatInputModule,
    MatTableModule,
    DragDropModule,
    SharedModule,
    NgxMaterialTimepickerModule
  ],
  exports: [RoutineComponent, StaffRoutineComponent],
})
export class RoutineModule { }
