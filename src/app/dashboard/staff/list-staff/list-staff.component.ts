import { Component, OnInit } from '@angular/core';
import { StaffService } from 'src/app/services/staff.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { RouterLinkComponent } from '../../router-link/router-link.component';
// import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
@Component({
  selector: 'app-list-staff',
  templateUrl: './list-staff.component.html',
  styleUrls: ['./list-staff.component.scss']
})
export class ListStaffComponent implements OnInit {
  staffArray: any = '';
  settings = {
    columns: {
      StaffId: {
        title: 'ID',
        filter: false,
        type: 'custom',
        renderComponent: RouterLinkComponent
      },
      Photo: {
        title: 'Photo',
        filter: false,
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          return `<img src='${cell}'/>`;
        }
      },
      usertype: {
        title: 'Type',
        filter: false,
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          // const obj: HTMLDivElement = document.createElement('div');
          // obj.className = 'badge';
          // obj.style.background = '#ff9900';
          // obj.textContent = 'fhfh';
          const ele = `<font class="badge" color="${row.color}">${cell}</font>`;
          // ele.style.background = '#ff8800';
          console.log(row);
          return ele;
          // return `<span class="badge ${cell === 'teacher' ? 'badge-success' : cell === 'accountant' ? 'badge-warning' : 'badge-info'}">${cell}</span>`;
        },
      },
      FirstName: {
        title: 'Full Name',
        valuePrepareFunction: ( cell, row ) => {
          return `${row.FirstName} ${row.LastName}`;
        },
      },
      MobilePhone: {
        title: 'Mobile'
      },
      Sex: {
        title: 'Sex',
        filter: false,
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          return `<i class="h3-responsive mdi mdi-human-${cell} ${cell === 'male' ? 'text-dark' : 'text-info'}"></i>`;
        },
      },
      FatherFirstName: {
        title: 'Family Member',
        valuePrepareFunction: ( cell, row ) => {
          return `${row.FatherFirstName} ${row.FatherLastName}`;
        },
      },
      FatherContact: {
        title: 'Family Contact'
      },
      Status: {
        title: 'Status',
        filter: false,
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          return `<span class="mdi mdi-circle ${cell === 0 ? 'text-success' : cell === 2 ? 'text-dark' : 'text-danger'}"></span> ${cell === 0 ? 'Active' : cell === 2 ? 'Retired' : 'Inactive'}`;
        },
      },
    },
    actions: false,
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
      class: 'table table-bordered text-capitalize',
      id: 'StaffTable'
    }
  };

  source: LocalDataSource;

  // exportAsConfig: ExportAsConfig = {
  //   type: 'xlsx', // the type you want to download
  //   elementIdOrContent: 'StaffTable', // the id of html/table element
  // };

  constructor(private staffService: StaffService, public progressbar: ProgressBarService, public alertService: AlertService) {}

  ngOnInit(): void {
    this.getList();
  }

  // export(exportType){
  //   this.exportAsConfig.type = exportType;
  //   this.exportAsService.save(this.exportAsConfig, 'Staff List Table').subscribe(() => {
  //     // save started
  //   });
  // }

  getList(){
    this.staffService.listStaff().subscribe( (res: any) => {
      this.staffArray = res.data;
      console.log(res.data);
      this.source = new LocalDataSource(this.staffArray);
    });
  }

  onEdit(e){
    this.progressbar.startLoading();
    const staffObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.staffService.message.status === 1){
          e.confirm.resolve(e.newData);
          this.progressbar.setSuccess();
          this.alertService.success(this.staffService.message.message);
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
    this.staffService.editStaff(e.newData).subscribe(staffObserver);
  }
}
