import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  content?: string;
  user: any;
  username?: string;
  fullname?: string;
  isDeactivatedSuccess = false;
  constructor(private userService: UserService, private storageService: StorageService, private authService: AuthService, private router: Router, public logincomponent: LoginComponent) { }
  ngOnInit(): void {
    this.isDeactivatedSuccess = false
    this.user = this.storageService.getUser();
    this.userService.getUserBoard().subscribe({
      next: data => {
        this.content = data;
        this.username = " Username: " + this.user.username;
        this.fullname = " Full Name: " + this.user.fullname;
      },
      error: err => {
        console.log(err)
        if (err.error) {
          this.content = JSON.parse(err.error).message;
        } else {
          this.content = "Error with status: " + err.status;
        }
      }
    });

  }
  deactivateUser(): void {
    this.user = this.storageService.getUser();
    this.authService.deactivate(this.user.username).subscribe({
      next: async res => {
        this.isDeactivatedSuccess = true;
        console.log(res.message);
        this.storageService.clean();
        await new Promise(r => setTimeout(r, 800));
        this.router.navigate(['/login'])
          .then(() => {
            window.location.reload();            
          });
      },
      error: err => {
        console.log('Deactivation error: ' + err);
      }
    });

  }
}
