import { Component, OnInit, Inject, Input } from '@angular/core';
import { GradeService } from 'src/app/services/grade.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { StudentService } from 'src/app/services/student.service';
import { LocalDataSource } from 'ng2-smart-table';
import { FeeService } from 'src/app/services/fee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PaymentButtonsComponent } from 'src/app/shared/common/payment-buttons/payment-buttons.component';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MoneyReceiptComponent } from 'src/app/shared/common/money-receipt/money-receipt.component';

export interface DialogData {
  row: any;
  type: string;
  payDate: any;
  payAmount: number;
}

@Component({
  selector: 'app-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss']
})
export class FeeComponent implements OnInit {
  form: FormGroup;
  gradeList: any;
  gradeListData = true;
  studentList: any;
  loading = false;
  submitted = false;
  gradeAutoComplete = new FormControl();
  studentAutoComplete = new FormControl();
  filteredOptions: Observable<void>;
  selectedStudentId: any;
  payDate: any;
  // payAmount: number;

  @Input()
  public classId: string;

  @Input()
  public studentId: string;

  settings = {
    columns: {
      Name: {
        title: 'Type Name',
        filter: false
      },
      Compulsory: {
        title: 'Compulsory',
        filter: false,
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          const ele = cell === 0 ? '<span class="mdi mdi-checkbox-blank-circle-outline text-dark" title="Compulsory"> Optional</span>' : '<span class="mdi mdi-checkbox-blank-circle text-info" title="Compulsory"> Compulsory</span>';
          return ele;
        },
      },
      Status: {
        title: 'Fee Status',
        filter: false,
        type: 'custom',
        renderComponent: PaymentButtonsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.pay.subscribe(row => {
            row.studentId = this.selectedStudentId;
            this.openDialog(row, 'pay'); });
          instance.paid.subscribe(row => {
            row.studentId = this.selectedStudentId;
            this.openDialog(row, 'paid');
          });
        }
      },
      CollectedAmount: {
        title: 'Amount Paid',
        type: 'html',
        filter: false,
        valuePrepareFunction: ( cell, row ) => {
          // tslint:disable-next-line: radix
          return cell === null ? `<i class="mdi mdi-currency-inr"></i> 0` : `<i class="mdi mdi-currency-inr"></i>${parseInt(cell).toFixed(2)}`;
        },
      }
    },
    actions: false,
    attr: {
      class: 'table table-bordered table-striped no-filter-table'
    }
  };

  source: LocalDataSource;
  gradeListRawData: any;
  selectedClassId: string;
  selectedGradeId: string;

  constructor(private gradeService: GradeService,
              private studentService: StudentService,
              private feeService: FeeService, public dialog: MatDialog,
              public progressbar: ProgressBarService, private router: Router, private route: ActivatedRoute,
              public alertService: AlertService) { }


  ngOnInit(): void {
    this.makeGradeList();
    if (this.classId && this.classId !== ''){
      this.selectedClassId = this.classId;
    }
    if (this.studentId && this.studentId !== ''){
      this.selectedStudentId = this.studentId;
      this.getList(this.selectedStudentId);
    }
  }

  setOption() {
    this.route.params.subscribe(params => {
      this.selectedGradeId = params.gradeId;
      const selectedOption = this.gradeList.filter((item) => {
        return item.value === this.selectedGradeId;
      })[0];
      console.log(selectedOption);
      if (typeof selectedOption === 'undefined'){
        return;
      }
      this.selectedclass(this.selectedGradeId);
      this.selectedStudentId = params.studentId;
      this.gradeAutoComplete.setValue(selectedOption);
      this.studentService.listStudentByGrade(this.selectedGradeId).subscribe( (res: any) => {
        this.studentList = res.data.map((row) => {
          return { value : row.StudentID, title : `${row.FirstName} ${row.LastName}` };
        });
        const selectedStudentOption = this.studentList.filter((item) => {
          return item.value === this.selectedStudentId;
        })[0];
        this.studentAutoComplete.setValue(selectedStudentOption);
        this.getList(this.selectedStudentId);
      });
    });
  }

  openDialog(row, type): void {

    // this.progressbar.startLoading();
    const feeObserver = {
      next: x => {
        // this.progressbar.completeLoading();
        if (this.feeService.message.status === 1){
          // this.progressbar.setSuccess();
          this.alertService.success(this.feeService.message.message);
          this.getList(this.selectedStudentId);
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.feeService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };

    // const dialogRef = this.dialog.open(DialogComponent, {
    //   width: '400px',
    //   data: {row, type}
    // });
    const dialogComponent = type === 'paid' ? MoneyReceiptComponent : DialogComponent;

    const dialogRef = this.dialog.open(dialogComponent, {
      // width: '400px',
      data: {row, type}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && type === 'pay'){
        this.payDate = moment(result.payDate.value).format('YYYY-MM-DDTHH:mm:ss');
        const datamodel = row;
        datamodel.Status = row.Status + 1;
        datamodel.PaidDate = this.payDate;
        datamodel.PaidAmount = result.payAmount.value;
        datamodel.StudentId = this.selectedStudentId;
        this.feeService.addUpdateFee(datamodel).subscribe(feeObserver);
        // console.log(result.payDate.value);
        // console.log(result.payAmount.value);
      }
    });
  }

  displayFn(grade: any): string {
    return grade && grade.title ? grade.title : '';
  }

  displayStudentFn(student: any): string {
    return student && student.title ? `${student.title} (${student.value})`  : '';
  }

  selectedgrade(event) {
    // this.gradeListRawData.filter(event.option.value.value);
    // for (const key in this.gradeListRawData){
    //   if (this.gradeListRawData[key].GradeId === event.option.value.value)
    //     {
    //       this.selectedClassId = this.gradeListRawData[key].Class;
    //     }
    // }
    // debugger;
    const path = 'dashboard/fee/' + event.option.value.value;
    this.router.navigate([path]);
    this.selectedclass(event.option.value.value);
    this.studentService.listStudentByGrade(event.option.value.value).subscribe( (res: any) => {
      this.studentList = res.data.map((row) => {
        return { value : row.StudentID, title : `${row.FirstName} ${row.LastName}` };
      });
    });
  }

  selectedclass(gradeId){
    for (const key in this.gradeListRawData){
      if (this.gradeListRawData[key].GradeId === gradeId)
        {
          this.selectedClassId = this.gradeListRawData[key].Class;
        }
    }
  }

  selectedstudent(event) {
    // console.log(event.option.value);
    const path = 'dashboard/fee/' + this.selectedGradeId + '/' + event.option.value.value;
    this.router.navigate([path]);
    this.selectedStudentId = event.option.value.value;
    this.getList(this.selectedStudentId);
  }

  // private _filter(title: string): any {
  //   const filterValue = title.toLowerCase();
  //   return this.gradeList.filter(option => option.title.toLowerCase().indexOf(filterValue) === 0);
  // }

  makeGradeList(): Observable<any>{
    this.gradeService.listGrade().subscribe( (res: any) => {
      if (res.status === 0 ){
        this.gradeListData = false;
        return;
      }
      this.gradeListRawData = res.data;
      this.gradeList = res.data.map((row) => {
        return { value : row.GradeId, title : row.Name };
      });
      this.setOption();
    });
    return;
  }

  getList(sid: string){
    // console.log(sid + "|||" + this.selectedClassId);
    this.feeService.listFeeDetails(sid, this.selectedClassId).subscribe( (res: any) => {
      this.source = new LocalDataSource(res.data);
    });
  }

}

//////////////////////////////////////////////////////////////

@Component({
  selector: 'app-popup-dialog',
  template: `<h2 mat-dialog-title>Pay Type: {{data.row.Name}}</h2>
  <div mat-dialog-content>
    <div *ngIf="data.type == 'paid'" >
    <h3 class="text-success"><span class="mdi mdi-checkbox-marked-circle"></span> Already Paid</h3>
      <br/>
      <table class="table table-bordered table-sm">
        <tr>
          <th>Paid Date</th>
          <th>Paid Amount</th>
        </tr>
        <tr>
        <td>
          <div class="text-black-50 p-1" *ngFor="let paidon of data.row.PaidDate?.split(',')">
            {{ paidon | date:'medium' }}
          </div>
        </td>
        <td>
          <div class="p-1" *ngFor="let payAmt of data.row.PaidAmount?.split(',')"><i class="mdi mdi-currency-inr"></i> {{payAmt}}</div>
        </td>
        </tr>
      </table>
    </div>
    <div *ngIf="data.type == 'pay'" class="small">
      <label class="text-black-50">Amount Due:</label> ({{data.row.Amount}} - {{data.row.Discount}}) x {{data.row.Tax}}% =
      <input class="bg-inverse-success border-0 disabled p-1 w-25" [formControl]="payAmount"/>
      <mat-form-field class="example-full-width">
        <input matInput [matDatepicker]="picker" placeholder="Choose a date" [formControl]="payDate">
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      <button mat-raised-button (click)="picker.open()" class='btn h3 m-0 mdi mdi-calendar-month p-0 text-default'></button>
    </div>
  </div>
  <div mat-dialog-actions>
    <button mat-button class="btn btn-secondary" (click)="onNoClick()">Cancel</button>
    <button mat-button *ngIf="data.type == 'pay'" class="btn btn-success ml-3" [mat-dialog-close]="{payDate: payDate,payAmount: payAmount}" cdkFocusInitial>Pay Now</button>
  </div>`,
})
export class DialogComponent {
  payDate = new FormControl(new Date());
  payAmount = new FormControl();
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      // console.log(data);
      this.payAmount.setValue((data.row.Amount - data.row.Discount) + (data.row.Amount - data.row.Discount) * data.row.Tax / 100);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
