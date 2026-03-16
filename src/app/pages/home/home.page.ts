import { Component, inject, signal} from '@angular/core';
import { Users } from '../../core/services/users';
import { IUser } from '../../core/models/user.interface'; 
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';

@Component({
  selector: 'app-home',
  imports: [UserCardComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  private usersService = inject(Users);
  users = signal<IUser[]>([]);

  constructor() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const response = await this.usersService.getAll("");
      this.users.set(response.results);
      console.log(this.users());
      console.log(response);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  } 
}
