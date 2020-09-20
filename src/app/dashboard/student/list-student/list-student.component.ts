import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { LocalDataSource } from 'ng2-smart-table';
import { RouterLinkComponent, RouterLinkFullNameComponent } from '../../router-link/router-link.component';
// import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
// import { environment } from '../../../../environments/environment';
import { ThumbnailImageComponent } from 'src/app/shared/common/thumbnail-image/thumbnail-image.component';
import { upperCase } from 'lodash';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.scss']
})
export class ListStudentComponent implements OnInit {
  studentArray: any = '';
  settings = {
    columns: {
      ApplicationNo: {
        title: 'Appl. No.',
      },
      // StudentID: {
      //   title: 'ID',
      //   filter: false,
      //   type: 'custom',
      //   renderComponent: RouterLinkComponent
      // },
      Photo: {
        title: 'Photo',
        filter: false,
        type: 'custom',
        renderComponent: ThumbnailImageComponent
      },
      FirstName: {
        title: 'Full Name',
        type: 'custom',
        renderComponent: RouterLinkFullNameComponent
        // valuePrepareFunction: ( cell, row ) => {
        //   return `<a [routerlink] = "/dashboard/student/view/${row.StudentID}">${row.FirstName} ${row.LastName}</a>`;
        // },
      },
      ClassName: {
        title: 'Class Name',
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
        title: 'Father Name',
        valuePrepareFunction: ( cell, row ) => {
          return `${row.FatherFirstName} ${row.FatherLastName}`;
        },
      },
      MotherFirstName: {
        title: 'Mother Name',
        valuePrepareFunction: ( cell, row ) => {
          return `${row.MotherFirstName} ${row.MotherLastName}`;
        },
      },
      MobilePhone: {
        title: 'Mobile'
      },
      RollNo: {
        title: 'Roll No',
        valuePrepareFunction: ( cell, row ) => {
          return cell !== 0 ? cell : '';
        },
      },
      Caste: {
        title: 'Caste',
        valuePrepareFunction: ( cell, row ) => {
          return upperCase(cell);
        },
      }
    },
    actions: false,
    attr: {
      class: 'table table-bordered text-capitalize',
      id: 'StudentTable'
    }
  };

  source: LocalDataSource;

  // exportAsConfig: ExportAsConfig = {
  //   type: 'xlsx', // the type you want to download
  //   elementIdOrContent: 'StudentTable', // the id of html/table element
  // };

  constructor(private studentService: StudentService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.getList();
  }

  // export(exportType){
  //   this.exportAsConfig.type = exportType;
  //   this.exportAsService.save(this.exportAsConfig, 'Student List Table').subscribe(() => {
  //     // save started
  //   });
  //   // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
  //   // this.exportAsService.get(this.config).subscribe(content => {
  //   //   console.log(content);
  //   // });
  // }

  getList(){
    this.studentService.listStudent().subscribe( (res: any) => {
      // if (res === null){
      //   this.router.navigate(['/login']);
      //   this.snackBar.open('Server Disconnected. Contact Provider', '', {
      //     duration: 5000,
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top',
      //     panelClass: 'bg-danger text-white'
      //   });
      //   return;
      // } else if (res.data === 'Expired Token'){
      //   this.router.navigate(['/login']);
      //   this.snackBar.open('Session Expired. Login Again', '', {
      //     duration: 5000,
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top',
      //     panelClass: 'bg-warning text-white'
      //   });
      //   return;
      // }
      this.authService.checkError(res);
      if (res && res.status === 1) {
        this.studentArray = res.data;
        // console.log(this.studentArray);
        this.source = new LocalDataSource(this.studentArray);
      }
    });
  }
}
