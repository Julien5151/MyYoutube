import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'pwa-user-management',
  imports: [CommonModule, AddUserComponent],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent {}
