import { Component, OnInit } from '@angular/core';
import { GradeService } from 'src/app/services/grade.service';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from 'src/app/services/subject.service';
import { ApiResponse } from 'src/app/models/models';
import { RoutineService } from 'src/app/services/routine.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';

const ELEMENT_DATA: any[] = [
  {day: 'Sunday'}, {day: 'Monday'}, {day: 'Tuesday'}, {day: 'Wednesday'}, {day: 'Thursday'}, {day: 'Friday'}, {day: 'Saturday'}
];

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss']
})

export class RoutineComponent implements OnInit {
  gradeList: any;
  gradeListData = true;
  gradeListRawData: any;
  gradeAutoComplete = new FormControl();
  selectedGradeId: string;
  // selectedMoments = [];
  subjectList: any;
  unassignedSubjects = [];
  assignedSubjects = [];
  timingsArr = [];
  update = false;
  startTime: string;
  endTime: string;
  // dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['day'];
  dataSource = ELEMENT_DATA;
  routineData: any[];
  routineObserver: { next: (x: any) => void; error: (err: any) => void; };
  timingsText: string;
  oldTimings: any;

  constructor(private gradeService: GradeService, private router: Router, private route: ActivatedRoute,
              private subjectService: SubjectService, private routineService: RoutineService,
              private progressbar: ProgressBarService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.makeGradeList();
    this.routineObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.routineService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.routineService.message.message);
          this.getTimings();
          this.getData();
          this.update = false;
          this.oldTimings = [];
          // this.selectedMoments = [];
          this.startTime = '';
          this.endTime = '';
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.routineService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };
  }

  // join(arr){
  //   return JSON.parse(arr).join('-');
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

  displayFn(grade: any): string {
    return grade && grade.title ? grade.title : '';
  }

  selectedgrade(event) {
    const path = '/dashboard/routine/' + event.option.value.value;
    this.router.navigate([path]);
  }

  setOption() {
    this.route.params.subscribe(params => {
      this.selectedGradeId = params.gradeId;
      this.displayedColumns = ['day'];
      const selectedOption = this.gradeList.filter((item) => {
        return item.value === this.selectedGradeId;
      })[0];
      console.log(selectedOption);
      if (typeof selectedOption === 'undefined'){
        return;
      }
      this.getSubjects();
      this.getTimings();
      this.getData();
      this.gradeAutoComplete.setValue(selectedOption);
    });
  }

  addClassTimings(type){
    console.log(this.startTime);
    this.timingsArr = [this.startTime, this.endTime];
    // this.selectedMoments.map((v) => {
    //   this.timingsArr.push(moment(v).format('LT'));
    // });
    // console.log(this.timingsArr);
    this.timingsText = this.timingsArr.join('-');

    // console.log(this.dataSource);
    if (type === 'add'){
      this.saveTimings();
      this.displayedColumns.push(this.timingsText);
    } else if (type === 'update'){
      this.savenewTimings();
    }
  }

  getSubjects(){
    const filter = 'GradeId="' + this.selectedGradeId + '" AND StaffId<>"0"';
    this.subjectService.listSubjectsByFilter(filter).subscribe((res: ApiResponse) => {
      if (res.status === 1){
        console.log(res.data);
        this.subjectList = res.data;
      }
    });
  }

  saveTimings(){
    const data = {GradeId: this.selectedGradeId, Timings: this.timingsText, Day: ELEMENT_DATA, SubjectId: null};
    this.routineService.addupdate(data).subscribe(this.routineObserver);
  }

  savenewTimings(){
    const data = {GradeId: this.selectedGradeId, Timings: this.timingsText, OldTimings: this.oldTimings};
    console.log(data);
    this.routineService.addupdate(data).subscribe(this.routineObserver);
  }

  getTimings(){
    this.displayedColumns = ['day'];
    this.routineService.getTimings(this.selectedGradeId).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res && res.status === 1) {
          res.data.map((v) => {
            this.displayedColumns.push(v.Timings);
          });
        }
      }
    )
  }

  updateTimings(timings){
    // console.log(timings);
    this.update = true;
    this.oldTimings = timings;
    // this.selectedMoments = [];
    this.timingsArr = timings.split('-');
    // this.timingsArr.map(v => {
    //   const hour: any = moment(v, ['LT']).format('h');
    //   const min: any = moment(v, ['LT']).format('mm');
    //   this.selectedMoments.push(new Date(new Date().setHours(hour, min, 0, 0)));
    // });
    this.startTime = this.timingsArr[0];
    this.endTime = this.timingsArr[1];
    // this.selectedMoments = [new Date(new Date().setHours(hour, min, 0, 0)), new Date(new Date().setHours(1, 10, 0, 0))]
  }

  onSubjectChange(timings, day, e){
    // console.log(e.target.value);
    const data = {GradeId: this.selectedGradeId, Timings: timings, Day: [{day}], SubjectId: e.target.value};
    this.routineService.addupdate(data).subscribe(this.routineObserver);
  }

  getData(){
    this.routineService.getData(this.selectedGradeId).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res) {
          this.routineData = res.data;
        }
      }
    );
  }

}
