import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LeaveService } from 'src/app/services/leave.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss']
})
export class ApplyLeaveComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  leaveTypeList: any;
  isAddMode = true;
  leaveTypeData = false;
  id: any;
  approverList: any[];
  isAdmin = this.authService.myuser.usertype === 'admin' ? true : false;

  calendarFilter = (d: Date): boolean => {
    // console.log(this.authService.myuser.saturday);
    const day = d.getDay();
    return this.authService.myuser.saturday === 1 ? day !== 0 : day !== 0 && day !== 6;
    // return day !== 0 && day !== 6;
  }

  constructor(private leaveService: LeaveService, private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private authService: AuthService,
              private progressbar: ProgressBarService,
              public alertService: AlertService,
              public router: Router) { }

  ngOnInit(): void {
    this.makeLeaveTypeList();
    this.makeApproverList();
    this.id = this.route.snapshot.params.id;
    this.isAddMode = !this.id;
    const stringValidators = [Validators.pattern('[a-zA-Z ]*')];

    this.form = this.formBuilder.group({
      leavetype: ['', Validators.required],
      message: [''],
      leavedate: [],
      ApproverId: []
    });

    if (!this.isAddMode) {
      this.leaveService.getLeaveById(this.id)
          .pipe(first())
          .subscribe((res: any) => {
            this.f.leavetype.setValue(res.data[0].LeaveType);
            this.f.leavedate.setValue({begin: res.data[0].LeaveStartDate, end: res.data[0].LeaveEndDate});
            this.f.message.setValue(res.data[0].Message);
            this.f.ApproverId.setValue(res.data[0].ApproverId);
          });
    }
  }

  get f() { return this.form.controls; }

  makeLeaveTypeList(){
    this.leaveService.listLeaveType().subscribe( (res: any) => {
      if (res.status === 1 ){
        this.leaveTypeList = res.data.map((row) => {
          return { value : row.ID, title : row.Name };
        });
        this.leaveTypeData = true;
        // console.log(this.leaveTypeList);
      }
      return;
    });
  }

  makeApproverList(){
    this.leaveService.getApprovers().subscribe((res: any) => {
    console.log(res);
    if (res.status === 1 ) {
        this.approverList = [{ value : res.data[0].Parent1, title : res.data[0].Parent1Name },
        { value : res.data[0].Parent2, title : res.data[0].Parent2Name }];
        console.log(this.approverList);
        return;
      }
    return;
    });
  }

  getDate(event) {
    console.log(event); // logs the picked date data
  }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    this.createLeave(this.form);
  }

  createLeave(f: any){
    this.progressbar.startLoading();
    const leaveObserver = {
      next: x => {
        this.progressbar.completeLoading();
        this.loading = false;
        if (this.leaveService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.leaveService.message.message);
          this.submitted = false;
          this.router.navigate(['leave']);
          if (this.isAddMode) {
            this.form.reset();
          }
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.leaveService.message.message);
        }
      },
      error: err => {
        console.error('Observer got an error: ' + err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong' + err);
      },
    };

    if (this.id){
      f.value.ID = this.id;
    }
    console.log(f.value);
    this.leaveService.addUpdateLeave(f.value).subscribe(leaveObserver);

    // if (!this.isAddMode) {
    //   //this.leaveService.updateStaff(f.value, this.pid).subscribe(studentObserver);
    // }else{
    //   console.log(f.value);
    //   this.leaveService.addUpdateLeave(f.value).subscribe(leaveObserver);
    // }
  }

}
