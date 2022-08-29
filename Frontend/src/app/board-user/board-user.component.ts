import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  content?: string;
  info: any;
  constructor(private userService: UserService, private storageService: StorageService,) { }
  ngOnInit(): void {
    this.info = this.storageService.getUser();
    this.userService.getUserBoard().subscribe({
      next: data => {
        this.content = data + "\nUsername: " + this.info.username; 
      },
      error: err => {console.log(err)
        if (err.error) {
          this.content = JSON.parse(err.error).message;
        } else {
          this.content = "Error with status: " + err.status;
        }
      }
    });
    
  }

}
