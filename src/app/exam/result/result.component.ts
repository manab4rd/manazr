import { Component, OnInit } from '@angular/core';
import { GradeService } from 'src/app/services/grade.service';
import { LocalDataSource } from 'ng2-smart-table';
import { SubjectService } from 'src/app/services/subject.service';
import { ResultService } from 'src/app/services/result.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MarksCardComponent } from 'src/app/shared/common/marks-card/marks-card.component';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  gradeList: any;
  studentArray: any;
  settings: any;
  mySettings: any;
  source: LocalDataSource;
  // source: ServerDataSource;
  subjectListData: any;
  selectedgradeid: any;
  subjectArr = [];
  constructor(private gradeService: GradeService,
              private authService: AuthService,
              private resultService: ResultService,
              public progressbar: ProgressBarService,
              public alertService: AlertService,
              private subjectService: SubjectService,
              public dialog: MatDialog) {}

  ngOnInit(): void {
    this.makeGradeList();
    this.settings = {
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
        custom: [
          {
            name: 'viewmarksheet',
            title: '<i class="mdi mdi-18px mdi-certificate p-2 mr-2 text-default"></i>'
          },
        ]},
      attr: {
        class: 'table table-bordered table-striped'
      }
    };

    // this.getTableSource();
  }

  openDialog(data) {
    // console.log(data);
    data.gradeId = this.selectedgradeid;
    const dialogRef = this.dialog.open(MarksCardComponent, {data});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getTableSource(gradeid: any){
    this.resultService.resultlist(gradeid).subscribe( (res: any) => {
      this.authService.checkError(res);
      if (res.status === 0){
        this.studentArray = [];
        return;
      }else{
        this.getExamList('', gradeid);
        this.selectedgradeid = gradeid;
        this.studentArray = res.data;
        this.source = new LocalDataSource(this.studentArray);
        // console.log(this.source);
        return;
      }
    });
  }

  onCustomAction(event) {
    switch ( event.action) {
      case 'viewmarksheet':
        this.openDialog(event.data);
        break;
    }
  }

  makeGradeList(){
    this.gradeService.listGrade().subscribe( (res: any) => {
      this.gradeList = res.data.map((row) => {
        return { value : row.GradeId, title : row.Name };
      });
    });
  }

  getTotalMarks(finaldata, row){
    let totalMarks = 0;
    this.subjectArr = [];
    finaldata.map((maprow, index: number) => {
      const OptionalSubjects = row.OptionalSubjects.split(',');
      if ((maprow.Optional === 1 && OptionalSubjects.includes(maprow.SubjectId) || maprow.Optional === 0)){
        this.subjectArr.push(maprow.SubjectId);
      }
    });
    this.subjectArr.forEach(e => {
      // tslint:disable-next-line: radix
      totalMarks = totalMarks + parseInt(row[e]);
    });
    return totalMarks;
  }

  getExamList(subscribeid?, gradeid?){
    this.subjectService.list().subscribe( (res: any) => {
      this.authService.checkError(res);
      this.mySettings = {};
      this.mySettings = this.settings;
      const finalData = gradeid === undefined || gradeid === '' ?
      res.data : subscribeid === undefined || subscribeid === '' ?
      res.data.filter(p => p.GradeId === gradeid) : res.data.filter(p => p.GradeId === gradeid && p.SubjectId === subscribeid);

      this.mySettings.columns = {
        StudentID : {
          title : 'Student Name',
          valuePrepareFunction: ( cell, row ) => {
            return `${row.FirstName} ${row.LastName}`;
          },
        }
      };
      finalData.map((row) => {
        const columnName = row.SubjectId;
        const title = row.Name;
        this.mySettings.columns[columnName] = { title, valuePrepareFunction: ( cell ) => {
          return cell / 100;
        }, };
      });

      // const subjectArr = [];
      
      // this.studentArray.map((val, idx) => {
      //   this.subjectArr = [];
      //   const OptionalSubjects = val.OptionalSubjects.split(',');
      //   finalData.map((maprow, index: number) => {
      //     // console.log(this.studentArray[index]);
      //     console.log(maprow.SubjectId + ' +++ ' + (maprow.Optional === 1 && OptionalSubjects.includes(maprow.SubjectId)));
      //     if ((maprow.Optional === 1 && OptionalSubjects.includes(maprow.SubjectId) || maprow.Optional === 0)){
      //       console.log(maprow.SubjectId);
      //       this.subjectArr.push(maprow.SubjectId);
      //     }
      //     // subjectArr.push(maprow.SubjectId);
      //   });
      // });
      // finalData.map((maprow, index: number) => {
      //   subjectArr.push(maprow.SubjectId);
      // });
      this.mySettings.columns.FirstName = { title: 'Total',
        valuePrepareFunction: ( cell, row: any ) => {
          let totalMarks = 0;
          totalMarks = this.getTotalMarks(finalData, row);
          return (totalMarks / 100).toFixed(2);
        }// `${parseFloat(row.SUB_0001) + parseFloat(row.SUB_0003)}`
      };

      this.mySettings.columns.LastName = { title: 'Percentage', type: 'html',
        valuePrepareFunction: ( cell, row: any ) => {
          let totalMarks = 0;
          let infoFlag = '';
          this.subjectArr.forEach(e => {
            // tslint:disable-next-line: no-eval
            infoFlag = parseFloat(eval('row.' + e )) === 0 ? '<i class="mdi mdi-information-outline ml-2 text-info" placement="top" ngbTooltip="Tooltip on top"></i>' : '';
            // tslint:disable-next-line: no-eval
            totalMarks = totalMarks + parseFloat(eval('row.' + e )) / this.subjectArr.length;
          });
          return (totalMarks / 100).toFixed(2) + '%' + infoFlag;
        }
      };

      // });
      this.settings = Object.assign({}, this.mySettings);
    });
  }



  // getMarks(studentid, examid){
  //   const results = localStorage.getItem('results');
  //   const i = JSON.parse(results).find(p => p.StudentID === studentid && p.ExamId === examid);
  //   if (i !== undefined){
  //     return i.Marks;
  //   }
  //   return;
  // }

  OnSubjectSelect(value: string){
    this.getExamList(value, this.selectedgradeid);
  }

  onGradeSelect(value: string){
    this.makeSubjectList(value);
    this.getTableSource(value);
  }

  makeSubjectList(gradeid){

    this.subjectService.listSubjectsByFilter('GradeId="' + gradeid + '"').subscribe( (res: any) => {
      if (res.status === 0 ){
        this.subjectListData = false;
        return;
      }
      this.subjectListData = res.data.map((row) => {
        return { value : row.SubjectId, title : row.Name };
      });
    });
  }

  // onFormAction( e ){
  //   this.progressbar.startLoading();
  //   const resultObserver = {
  //     next: x => {
  //       this.progressbar.completeLoading();
  //       if (this.resultService.message.status === 1){
  //         e.confirm.resolve(e.newData);
  //         this.progressbar.setSuccess();
  //         this.alertService.success(this.resultService.message.message);
  //         // this.getList();
  //       }else{
  //         e.confirm.reject();
  //         this.progressbar.setError();
  //         this.alertService.warning(this.resultService.message.message);
  //       }
  //     },
  //     error: err => {
  //       console.error(err);
  //       this.progressbar.completeLoading();
  //       this.progressbar.setError();
  //       this.alertService.danger('Something Wrong');
  //     },
  //   };
  //   this.resultService.add(e.newData).subscribe(resultObserver);
  // }

}
