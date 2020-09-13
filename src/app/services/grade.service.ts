import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { map } from 'rxjs/operators';
import { UpperCasePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { startCase, capitalize } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class GradeService {
  message: any = '';
  constructor(private http: HttpClient, private authService: AuthService) { }
  gradeUrl: any = environment.apiURL + 'grade-api.php';
  orgid: number = this.authService.myuser.organizationId;

  listGrade(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.gradeUrl, {headers});
  }

  listGradeById(id: any){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    return this.http.get(this.gradeUrl + '?id=' + id, {headers});
  }

  editGrade(newData: any){
    newData.orgid = this.authService.myuser.organizationId;
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    // const splitClass = newData.Class.split(',');
    newData.ClassName = newData.ClassObj.title;
    newData.Class = newData.Class;
    newData.Section = capitalize(newData.Section);
    newData.Name = newData.ClassName + newData.Section;
    newData.methodtype =  'PUT';
    // console.log(newData);
    return this.http.post(this.gradeUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  addGrade(newData: any){
    newData.orgid = this.authService.myuser.organizationId;
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    // const splitClass = newData.Class.split(',');
    newData.ClassName = newData.ClassObj.title;
    newData.Class = newData.Class;
    newData.Section = capitalize(newData.Section);
    newData.Name = newData.ClassName + '-' + newData.Section;
    console.log(newData);
    return this.http.post(this.gradeUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  deleteGrade(id){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const data = {id, methodtype:  'DELETE'};
    return this.http.post(this.gradeUrl, data, {headers});
    // return this.http.delete(this.classUrl + '?id=' + id, {headers});
  }
}
