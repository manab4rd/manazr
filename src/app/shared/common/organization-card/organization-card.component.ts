import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiResponse } from 'src/app/models/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization-card',
  templateUrl: './organization-card.component.html',
  styleUrls: ['./organization-card.component.scss']
})
export class OrganizationCardComponent implements OnInit {
  orgData: any;
  orgDetails: any;
  orgImage: string;
  @Input() print = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.orgData = this.authService.myuser;
    this.authService.getUserById(this.orgData.id).subscribe(
      (res: ApiResponse) => {
        // console.log(res.data);
        this.orgDetails = res.data[0];
      }
    );
    this.orgImage = environment.uploadFilesURL + 'org_avatar_' + this.orgData.organizationId + '.jpg';
  }

}
