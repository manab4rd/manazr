import { Injectable } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  message: any;
  leaveTypeUrl: any = environment.apiURL + 'leavetype-api.php';
  leaveUrl: any = environment.apiURL + 'leave-api.php';
  quickcallUrl: any = environment.apiURL + 'quickcall-api.php';
  orgid: number = this.authService.myuser.organizationId;

  constructor( private authService: AuthService, private http: HttpClient) { }

  listLeaveType(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.leaveTypeUrl, {headers});
    return result;
  }

  listLeaveDetails(sid){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.leaveUrl + '?sid=' + sid, {headers});
    return result;
  }

  listLeaveApproveDetails(sid){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const result = this.http.get(this.quickcallUrl +
      '?table=LeaveDetails ld RIGHT JOIN LeaveType lt ON ld.LeaveType = lt.ID AND ld.OrganizationId = lt.OrganizationId JOIN Staff ON ld.StaffId = Staff.StaffId AND ld.OrganizationId = lt.OrganizationId' +
      '&filter=ld.*, lt.Name, CONCAT(Staff.FirstName, " ", Staff.Lastname) AS StaffName' +
      '&where=ld.ApproverId = "' + sid + '" ' +
      'AND ld.OrganizationId=' + this.authService.myuser.organizationId, {headers});
    return result;
  }

  addLeaveType(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    console.log(model);
    return this.http.post(this.leaveTypeUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  editLeaveType(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    console.log(model);
    model.methodtype =  'PUT';
    return this.http.post(this.leaveTypeUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  addUpdateLeave(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    model.leaveStartDate = moment(model.leavedate.begin).format('YYYY-MM-DD');
    model.leaveEndDate = moment(model.leavedate.end).format('YYYY-MM-DD');
    model.daycount = Math.abs(moment(model.leavedate.end).diff(moment(model.leavedate.begin), 'days')) + 1;
    model.staffId = this.authService.myuser.userId;

    let workdays = 0;
    for (let i = 0; i < model.daycount; i++){
        const day = moment(model.leaveStartDate).add(i, 'days').isoWeekday();
        if (day < 6){
          workdays += 1;
      }
    }
    model.daycount = workdays;


    // console.log(model);
    return this.http.post(this.leaveUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  updateLeaveStatus(model: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    model.orgid =  this.authService.myuser.organizationId; // sending organisation id
    model.staffId = model.StaffId;
    model.leavetype = model.LeaveType;
    model.leaveStartDate = model.LeaveStartDate;
    model.leaveEndDate = model.LeaveEndDate;
    model.daycount = model.NoDays;
    model.message = model.Message;
    console.log(model);
    return this.http.post(this.leaveUrl, model, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  getApprovers(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const staffId = this.authService.myuser.userId;
    const result = this.http.get(this.quickcallUrl +
      '?table=Staff s1 left join Staff s2 on s2.StaffId = s1.ReportsTo left join Staff s3 on s3.StaffId = s2.ReportsTo&filter=concat(s3.FirstName," ",s3.LastName) as Parent2Name,s2.ReportsTo as Parent2,concat(s2.FirstName," ",s2.LastName) as Parent1Name,' +
      's1.ReportsTo as Parent1,s1.StaffId,s1.FirstName&where=s1.StaffId = "' + staffId + '" ' +
      'AND s1.ReportsTo in (s1.ReportsTo, s2.ReportsTo, s3.ReportsTo) ' +
      'AND s1.OrganizationId=' + this.authService.myuser.organizationId, {headers});
    return result;
  }

  // getLeaveForWidget(){
  //   const headers = new HttpHeaders({
  //     Authorization : 'Bearer ' + this.authService.myRawToken
  //   });
  //   // const staffId = this.authService.myuser.userId;
  //   const result = this.http.get(this.quickcallUrl +
  //     '?table=LeaveDetails LEFT JOIN Staff ON LeaveDetails.StaffId = Staff.StaffId AND LeaveDetails.OrganizationId = Staff.OrganizationId' +
  //     '&filter=LeaveDetails.LeaveStartDate,LeaveDetails.LeaveEndDate, LeaveDetails.NoDays, CONCAT(Staff.FirstName, " ", Staff.LastName) as FullName' +
  //     '&where=LeaveDetails.LeaveStatus = 1 AND LeaveDetails.OrganizationId=' + this.authService.myuser.organizationId, {headers});
  //   return result;
  // }

  getLeaveForWidget(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const model = {
      table: 'LeaveDetails LEFT JOIN Staff ON LeaveDetails.StaffId = Staff.StaffId AND LeaveDetails.OrganizationId = Staff.OrganizationId',
      filter: 'LeaveDetails.LeaveStartDate,LeaveDetails.LeaveEndDate, LeaveDetails.NoDays, CONCAT(Staff.FirstName, " ", Staff.LastName) as FullName',
      where: 'LeaveDetails.LeaveStatus = 1 AND LeaveDetails.OrganizationId=' + this.authService.myuser.organizationId
    };
    const result = this.http.post(this.quickcallUrl, model , {headers});
    return result;
  }

  getLeaveById(id){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.leaveUrl + '?id=' + id, {headers});
  }

}

// gives all the childrens of the same parent
// WITH recursive cte (StaffId, FirstName, LastName, ReportsTo) as (select StaffId,FirstName,LastName,ReportsTo from /
// Staff where ReportsTo = (SELECT ReportsTo FROM Staff WHERE StaffId = 'E_100000028') union all select p.StaffId, p.FirstName, p.LastName,
// p.ReportsTo from Staff p inner join cte on p.ReportsTo = cte.StaffId)
// select * from cte

// with more detial hierchy
// select      concat(s3.FirstName,' ',s3.LastName) as Parent3Name,
// 			s2.ReportsTo as Parent2,
// 			concat(s2.FirstName,' ',s2.LastName) as Parent2Name,
//             s1.ReportsTo as Parent1,
//             s1.StaffId,
//             s1.FirstName
// from        Staff s1
// left join   Staff s2 on s2.StaffId = s1.ReportsTo
// left join   Staff s3 on s3.StaffId = s2.ReportsTo
// where       'E_100000042' in (s1.ReportsTo,
//                    s2.ReportsTo, s3.ReportsTo)
// order       by 1, 2
