import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubjectService } from 'src/app/services/subject.service';
import { ResultService } from 'src/app/services/result.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-marks-card',
  templateUrl: './marks-card.component.html',
  styleUrls: ['./marks-card.component.scss']
})
export class MarksCardComponent implements OnInit {
  studentId: string;
  student: any;
  subjectArr: any[];
  resultMarks: any;

  constructor(public dialogRef: MatDialogRef<MarksCardComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private subjectService: SubjectService,
              private resultService: ResultService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.studentId = this.data.StudentID;
    // this.getExamList(this.data.gradeId);
    if (this.data){
      this.getResults(this.data.gradeId, this.data);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getExamList(gradeid?, optionalsubjects?){
    this.subjectService.list().subscribe( (res: any) => {
      const finalData = gradeid === undefined || gradeid === '' ?
      res.data : res.data.filter(p => p.GradeId === gradeid);

      this.subjectArr = [];
      const OptionalSubjects = optionalsubjects.split(',');
      finalData.map((maprow, index: number) => {
        if ((maprow.Optional === 1 && OptionalSubjects.includes(maprow.SubjectId) || maprow.Optional === 0)){
          this.subjectArr.push(maprow);
        }
      });
      this.calculateResult();
      // console.log(finalData);
      // console.log(this.subjectArr);
      // console.log(this.calculateResult());
    });
  }

  calculateResult(){
    this.resultMarks = 0;
    this.subjectArr.map(
      (val) => {
        // tslint:disable-next-line: radix
        this.resultMarks += parseInt(this.student[0][val.SubjectId]) / 100;
      }
    );
    this.resultMarks = (this.resultMarks / this.subjectArr.length).toFixed(2);
  }

  getResults(gradeid: any, studentData?){
    this.resultService.resultlist(gradeid).subscribe( (res: any) => {
      this.authService.checkError(res);
      if (res.status === 0){
        // this.studentArray = [];
        return;
      }else{
        // this.getExamList('', gradeid);
        if (studentData){
          this.student = res.data.filter(s => s.StudentID === studentData.StudentID);
          this.getExamList(this.data.gradeId, studentData.OptionalSubjects);
        }
        return;
      }
    });
  }

}
