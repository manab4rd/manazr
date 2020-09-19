import { Component, OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/common/confirm-dialog/confirm-dialog.component';
import { ColorPickerEditComponent } from 'src/app/shared/common/color-picker/color-picker.component';

@Component({
  selector: 'app-list-staff-type',
  templateUrl: './list-staff-type.component.html',
  styleUrls: ['./list-staff-type.component.scss']
})
export class ListStaffTypeComponent implements OnInit {
  staffTypeArray: any = '';
  hexColorCode = Math.floor(Math.random() * 16777215).toString(16);
  settings = {
    columns: {
      name: {
        title: 'Type Name',
        filter: true
      },
      color: {
        title: 'Hex Color',
        filter: false,
        type: 'html',
        defaultValue: '#' + this.hexColorCode,
        valuePrepareFunction: ( cell, row ) => {
          // const hexColor = cell ? cell : '#' + Math.floor(Math.random() * 16777215).toString(16);
          return `<font class="mdi mdi-checkbox-blank" color="${cell}"></font> ${cell}`;
        },
        editor : {
          type: 'custom',
          component: ColorPickerEditComponent
        }
      },
      count: {
        title: 'Staff Count',
        filter: false,
        editable: false,
        addable: false,
      },
    },
    rowClassFunction: (row) => {
      if (row.data.count === 0){
          return '';
      } else {
          return 'hide-delete';
      }
    },
    actions: { position: 'right'},
    add: {
      confirmCreate: true,
      addButtonContent: '<span class="p-2 tempting-azure-gradient text-white"><i class="mdi mdi-plus-circle" title="Add"></i> Add New</span>',
      createButtonContent: '<i class="mdi mdi-18px mdi-check-circle-outline p-2 mr-2 text-success" title="Create"></i>',
      cancelButtonContent: '<i class="mdi mdi-18px mdi-close-circle-outline p-2 text-warning" title="Cancel"></i>',
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="mdi mdi-18px mdi-lead-pencil p-2 mr-2 text-info" title="Edit"></i>',
      saveButtonContent: '<i class="mdi mdi-18px mdi-content-save p-2 mr-2 text-success" title="Save"></i>',
      cancelButtonContent: '<i class="mdi mdi-18px mdi-close-circle-outline p-2 text-warning" title="Cancel"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="mdi mdi-delete-forever mdi-18px p-2 mr-2 text-danger" title="Delete"></i>',
      confirmDelete: true,
    },
    attr: {
      class: 'table table-bordered'
    }
  };

  source: LocalDataSource;
  constructor(private staffService: StaffService, public progressbar: ProgressBarService,
              public alertService: AlertService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getList();
  }

  getList(){
      this.staffService.list().subscribe( (res: any) => {
        this.staffTypeArray = res;
        this.source = new LocalDataSource(res.stafftype);
      });
  }

  onFormAction( e ){
    console.log(this.staffService.message);
    this.progressbar.startLoading();
    const subjectObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.staffService.message.status === 1){
          e.confirm.resolve(e.newData);
          this.progressbar.setSuccess();
          this.alertService.success(this.staffService.message.message);
          this.hexColorCode = Math.floor(Math.random() * 16777215).toString(16); // hex code reset
        }else{
          e.confirm.reject();
          this.progressbar.setError();
          this.alertService.warning(this.staffService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };

    // console.log(e.newData);
    if (e.data === undefined){
      this.staffService.create(e.newData).subscribe(subjectObserver);
    }else{
      this.staffService.editStaffType(e.newData).subscribe(subjectObserver);
    }
  }

  openDialog(e) {
    // console.log(e.data);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data : e.data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.staffService.deleteStaffType(result).subscribe(
          (res: any) => {
            e.confirm.resolve();
            this.alertService.success(res.message);
          }
        );
      }
    });
  }

  // onDelete(e) {
  //   this.openDialog(e.data);
  // }

}
