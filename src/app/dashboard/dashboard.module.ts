import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { StaffTypeComponent } from './staff/staff-type/staff-type.component';
import { AddStaffTypeComponent } from './staff/add-staff-type/add-staff-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListStaffTypeComponent } from './staff/list-staff-type/list-staff-type.component';
import { AddStaffComponent } from './staff/add-staff/add-staff.component';
import { ListStaffComponent } from './staff/list-staff/list-staff.component';
import { AddStudentComponent } from './student/add-student/add-student.component';
import { ListStudentComponent } from './student/list-student/list-student.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ListGradeComponent } from './grade/list-grade/list-grade.component';
import { SubjectListComponent } from './subject/subject-list/subject-list.component';
import { GradeSelectComponent } from './grade/grade-select/grade-select.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { AssignmentComponent } from './staff/assignment/assignment.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ViewGradeComponent } from './grade/view-grade/view-grade.component';
import { RouterLinkComponent, RouterLinkFullNameComponent } from './router-link/router-link.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { FeeModule } from '../fee/fee.module';
import { GridsterModule } from 'angular-gridster2';
import { StudentCountComponent } from './widgets/student-count/student-count.component';
import { DynamicModule } from 'ng-dynamic-component';
import { LeaveModule } from '../leave/leave.module';
import { ManageComponent } from './account/manage/manage.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AttendenceModule } from '../attendence/attendence.module';
import { ClassComponent } from './class/class.component';
import { StudentAcademicsComponent } from './student/student-academics/student-academics.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { StudentModule } from './student/student.module';
import { AuthModule } from '../auth/auth.module';
import { GlobalModule } from './global/global.module';
import { StaffCountComponent } from './widgets/staff-count/staff-count.component';
import { LeaveDetailsComponent } from './widgets/leave-details/leave-details.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClassStatsComponent } from './widgets/class-stats/class-stats.component';
import { ChartsModule } from 'ng2-charts';
import { ImageToDataUrlModule } from 'ngx-image2dataurl';
import { RoutineModule } from '../routine/routine.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FeeCollectionStatsComponent } from './widgets/fee-collection-stats/fee-collection-stats.component';
import { SubjectCountComponent } from './widgets/subject-count/subject-count.component';
import { ClassCountComponent } from './widgets/class-count/class-count.component';


@NgModule({
  declarations: [
    HomeComponent,
    AddStaffTypeComponent,
    StaffTypeComponent,
    ListStaffTypeComponent,
    AddStaffComponent,
    ListStaffComponent,
    AddStudentComponent,
    ListStudentComponent,
    ListGradeComponent,
    SubjectListComponent,
    GradeSelectComponent,
    DashboardLayoutComponent,
    AssignmentComponent,
    ViewGradeComponent,
    RouterLinkComponent,
    RouterLinkFullNameComponent,
    StudentCountComponent,
    ManageComponent,
    ChangePasswordComponent,
    ClassComponent,
    StudentAcademicsComponent,
    StaffCountComponent,
    LeaveDetailsComponent,
    ClassStatsComponent,
    FeeCollectionStatsComponent,
    SubjectCountComponent,
    ClassCountComponent,
    // StudentAttendanceComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    DragDropModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatRippleModule,
    FeeModule,
    GridsterModule,
    DynamicModule,
    LeaveModule,
    MatCheckboxModule,
    AttendenceModule,
    MatExpansionModule,
    StudentModule,
    AuthModule,
    GlobalModule,
    MatTableModule,
    MatPaginatorModule,
    ChartsModule,
    ImageToDataUrlModule,
    RoutineModule,
    OwlDateTimeModule, OwlNativeDateTimeModule
  ],
  exports: [
    HomeComponent,
    AddStaffTypeComponent,
    StaffTypeComponent,
    ListStaffTypeComponent,
    AddStaffComponent,
    ListStaffComponent,
    AddStudentComponent,
    ListStudentComponent,
    ListGradeComponent,
    SubjectListComponent,
    GradeSelectComponent,
    DashboardLayoutComponent,
    AssignmentComponent,
    ViewGradeComponent,
    RouterLinkComponent,
    RouterLinkFullNameComponent,
    StudentCountComponent,
    ManageComponent,
    ChangePasswordComponent,
    ClassComponent,
    StudentAcademicsComponent,
    // StudentAttendanceComponent,
  ],
  entryComponents: [
    GradeSelectComponent
  ],
  providers: [TitleCasePipe, UpperCasePipe]
})
export class DashboardModule {
  static forRoot(): ModuleWithProviders{
    return{
      ngModule: DashboardModule,
      providers: [TitleCasePipe, UpperCasePipe]
    };
  }
}
