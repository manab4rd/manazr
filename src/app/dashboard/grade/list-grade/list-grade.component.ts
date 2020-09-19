import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AlertService } from 'ngx-alerts';
import { GradeService } from 'src/app/services/grade.service';
import { RouterLinkComponent } from '../../router-link/router-link.component';
import { ClassService } from 'src/app/services/class.service';
import { ConfirmDialogComponent } from 'src/app/shared/common/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-grade',
  templateUrl: './list-grade.component.html',
  styleUrls: ['./list-grade.component.scss']
})
export class ListGradeComponent implements OnInit {
  source: LocalDataSource;
  gradeArray: any = '';
  classList: any;
  mySettings: any;
  classListData = true;
  settings = {
    columns: {
      GradeId: {
        title: 'ID',
        filter: false,
        editable: false,
        addable: false,
        type: 'custom',
        renderComponent: RouterLinkComponent
        // type: 'html',
        // valuePrepareFunction: ( cell, row ) => {
        //   return `<a title="See Detail Grade" routerLink="view/${cell}"> ${row.GradeId}</a>`;
        // },
      },
      Name: {
        title: 'Grade Name',
        editable: false,
        addable: false,
      },
      Class: {
        title: 'Class',
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          return `${row.ClassName}`;
        },
        editor: {
          type: 'list',
          config: {
            list: ''
          }
        }
      },
      Section: {
        title: 'Section',
      },
      Succeeding: {
        title: 'Succeeding',
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          const Succeed =  this.gradeList.filter(p => p.value === row.Succeeding);
          console.log(Succeed);
          return Succeed.length > 0 ? Succeed[0].title : '<span class="text-warning">None</span>';
        },
        editor: {
          type: 'list',
          config: {
            list: ''
          }
        }
      },
      StudentCount: {
        title: 'Count',
        type: 'html',
        valuePrepareFunction: ( cell, row ) => {
          return row.StudentCount ? `${row.StudentCount} Students` : '<span class="text-warning">No Student</span>';
        },
        editable: false,
        addable: false,
      }
    },
    actions: { position: 'right'},
    rowClassFunction: (row) => {
      if (!row.data.StudentCount){
          return '';
      } else {
          return 'hide-delete';
      }
    },
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
      deleteButtonContent: '<i class="mdi mdi-delete-forever mdi-18px p-2 mr-2 text-danger"  title="Delete"></i>',
      confirmDelete: true,
    },
    attr: {
      class: 'table table-bordered'
    }
  };
  gradeList: any;

  constructor(public progressbar: ProgressBarService, public alertService: AlertService, private gradeService: GradeService,
              private classService: ClassService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.makeClassList();
    this.getList();
  }

  getList(){
    this.gradeService.listGrade().subscribe( (res: any) => {
      this.gradeArray = res.data;
      this.gradeList = res.data.map((r) => {
        return { value : r.GradeId, title : r.Name };
      });
      this.gradeList.push({ value : null, title : 'None' });
      this.mySettings = this.settings;
      this.mySettings.columns.Succeeding.editor.config.list = this.gradeList;
      this.settings = Object.assign({}, this.mySettings);
      this.source = new LocalDataSource(this.gradeArray);
    });
  }

  makeClassList(){
    this.classService.listClass().subscribe( (res: any) => {
      if (res.status === 0 ){
        this.classListData = false;
        return;
      }
      this.classList = res.data.map((r) => {
        // return { value : [r.ClassId, r.Name], title : r.Name };
        return { value : r.ClassId, title : r.Name };
      });
      this.mySettings = this.settings;
      this.mySettings.columns.Class.editor.config.list = this.classList;
      this.settings = Object.assign({}, this.mySettings);
    });
  }

  onFormAction( e ){
    this.progressbar.startLoading();
    const gradeObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.gradeService.message.status === 1){
          e.confirm.resolve(e.newData);
          this.getList();
          this.progressbar.setSuccess();
          this.alertService.success(this.gradeService.message.message);
        }else{
          e.confirm.reject();
          this.progressbar.setError();
          this.alertService.warning(this.gradeService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };

    e.newData.ClassObj = this.classList.filter(p => p.value === e.newData.Class)[0];
    console.log(e.newData);
    if (e.data === undefined){
      this.gradeService.addGrade(e.newData).subscribe(gradeObserver);
    }else{
      this.gradeService.editGrade(e.newData).subscribe(gradeObserver);
    }
  }

  openDialog(e) {
    e.data.id = e.data.ID;
    console.log(e.data);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data : e.data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gradeService.deleteGrade(result).subscribe(
          (res: any) => {
            e.confirm.resolve();
            this.alertService.success(res.message);
          }
        );
      }
    });
  }

}
