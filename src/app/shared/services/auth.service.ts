import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from 'ngx-alerts';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  myRawToken = localStorage.getItem('token');
  // authUrl = 'https://010e7778-cfa8-4648-b888-6fd7adbdad11.mock.pstmn.io/';
  loginUrl = environment.apiURL + 'login-api.php';
  registerUrl = environment.apiURL + 'create-user-api.php';
  quickcallUrl: any = environment.apiURL + 'quickcall-api.php';
  confirmEmailUrl = 'http://localhost:4200/login';
  decodedToken: any;
  redirect: any;
  message: any;
  myuser: any;

  helper = new JwtHelperService();
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
              private alertService: AlertService) {}

  private storageSub = new Subject<string>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  login(model: any){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return this.http.post(this.loginUrl, model).pipe(
      map((response: any) => {
        const user = response;
        if (user.status === 1) {
          this.setItem('token', user.jwt);
          this.setItem('user', JSON.stringify(user.data));
          const mytoken = localStorage.getItem('token');
          // this.myuser = JSON.parse(localStorage.getItem('user'));
          this.decodedToken = this.helper.decodeToken(mytoken);
          this.redirect = this.route.snapshot.queryParams.returnUrl;
          this.redirect = this.redirect === undefined ? ['/dashboard'] : [this.redirect];
          this.router.navigate(this.redirect);
        }
      })
    );
  }

  setItem(key: string, data: any) {
    localStorage.setItem(key, data);
    this.myuser = JSON.parse(localStorage.getItem('user'));
    this.storageSub.next('changed');
  }

  register(model: any){
    const headers = new HttpHeaders({
      confirmEmailUrl : this.confirmEmailUrl
    });
    const options = { headers };
    return this.http.post(this.registerUrl, model).pipe(
      map((response: any) => {
        // const user = response;
        this.message = response;
      })
    );
  }

  updateAccount(newData: any, id: number){
    newData.orgid = this.decodedToken.data.organizationId;
    newData.ID = id;
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.myRawToken
    });
    // console.log(newData);
    newData.methodtype =  'PUT';
    return this.http.post(this.registerUrl, newData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }

  loggedIn(){
    this.myRawToken = localStorage.getItem('token');
    this.myuser = JSON.parse(localStorage.getItem('user'));
    return !this.helper.isTokenExpired(this.myRawToken);
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.myRawToken = '';
    this.router.navigate(['/login']);
  }

  getNotification(){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.myRawToken
    });
    return this.http.get(this.quickcallUrl +
      '?table=Notification' +
      '&filter=*' +
      '&where=Status = 0 and OrganizationId=' + this.decodedToken.data.organizationId + ' and UserId = "' + this.myuser.userId + '"',
      {headers});
  }

  getUserById(id){
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.myRawToken
    });
    return this.http.get(this.quickcallUrl +
      '?table=Users' +
      '&filter=*' +
      '&where=Id = ' + id,
      {headers});
  }

  sendEmail(model){
    model.sendemail = true;
    model.title = 'Forget Password';
    return this.http.post(this.registerUrl, model).pipe(
      map((response: any) => {
        // const user = response;
        this.message = response;
      })
    );
  }

  checkError(res){
    if (res === null){
      this.router.navigate(['/login']);
      this.alertService.danger({
        html: '<h5>Server Disconnected. Contact Provider</h5>'
      });
      return false;
    } else if (res.data === 'Expired Token'){
      this.router.navigate(['/login']);
      this.alertService.warning('Session Expired. Login Again')
      return false;
    }
    return;
  }
}
