import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent, SubscriptionDialogComponent } from './components/header/header.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { DatepickerComponent, SmartTableDatepickerRenderComponent } from './common/datepicker/datepicker.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CheckboxComponent, CheckboxEditComponent } from './common/checkbox/checkbox.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaymentButtonsComponent } from './common/payment-buttons/payment-buttons.component';
import { GlobalChecksComponent } from './common/global-checks/global-checks.component';
import { ForFilterPipe, ArraySortPipe } from './for-filter.pipe';
import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FileUploadComponent } from './common/file-upload/file-upload.component';
import { ThumbnailImageComponent } from './common/thumbnail-image/thumbnail-image.component';
import { SessionDialogComponent } from './common/session-dialog/session-dialog.component';
import { ICardComponent } from './common/i-card/i-card.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { SidebarMenuReportsComponent } from './components/sidebar-menu-reports/sidebar-menu-reports.component';
import { MoneyReceiptComponent } from './common/money-receipt/money-receipt.component';
import { NgxPrintModule } from 'ngx-print';
import { StudentCardComponent } from './common/student-card/student-card.component';
import { StudentAttendanceCapsuleComponent } from './common/student-attendance-capsule/student-attendance-capsule.component';
import { OrganizationCardComponent } from './common/organization-card/organization-card.component';
import { MarksCardComponent } from './common/marks-card/marks-card.component';
import { ColorPickerComponent, ColorPickerEditComponent } from './common/color-picker/color-picker.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [HeaderComponent, SidebarMenuComponent, DatepickerComponent,
                 SmartTableDatepickerRenderComponent, CheckboxComponent,
                 CheckboxEditComponent, PaymentButtonsComponent,
                 GlobalChecksComponent, ForFilterPipe, ArraySortPipe, ConfirmDialogComponent,
                 FileUploadComponent, ThumbnailImageComponent, SessionDialogComponent, SubscriptionDialogComponent,
                 ICardComponent,
                 SidebarMenuReportsComponent,
                 MoneyReceiptComponent, StudentCardComponent, StudentAttendanceCapsuleComponent,
                 OrganizationCardComponent, MarksCardComponent, ColorPickerComponent, ColorPickerEditComponent ],
  imports: [
    CommonModule, NgbModule, DashboardRoutingModule, OwlDateTimeModule,
    OwlNativeDateTimeModule, ReactiveFormsModule,
    FormsModule, MatCheckboxModule, MatDialogModule, NgxBarcodeModule, NgxPrintModule,
    ColorPickerModule
  ],
  exports: [HeaderComponent, SidebarMenuComponent, DatepickerComponent,
            SmartTableDatepickerRenderComponent, CheckboxComponent,
            CheckboxEditComponent, PaymentButtonsComponent, ForFilterPipe, ArraySortPipe,
            ConfirmDialogComponent, FileUploadComponent, ThumbnailImageComponent,
            SessionDialogComponent, SubscriptionDialogComponent, ICardComponent, SidebarMenuReportsComponent,
            MoneyReceiptComponent, StudentCardComponent, ColorPickerComponent, ColorPickerEditComponent
          ]
})
export class SharedModule { }
