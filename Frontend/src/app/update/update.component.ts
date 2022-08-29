import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  form: any = {
    fullname: null,
  }
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  constructor(private authService: AuthService, private storageService: StorageService) { }
  ngOnInit(): void {
  }
  onSubmit(): void {
    const { fullname } = this.form;
    var user = this.storageService.getUser()
    this.authService.update(user.username, fullname).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.errorMessage;
        this.isSignUpFailed = true
      }
    })
  }
}
