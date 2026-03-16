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
  page = signal(1);
  total_pages = signal(0);

  constructor() {
    this.loadUsers(1);
  }

  async loadUsers(num:number) {
    try {
      const response = await this.usersService.getAll(`?page=${num}`);
      this.users.set(response.results);
      this.page.set(response.page);
      this.total_pages.set(response.total_pages);
      this.users.set(response.results);
      console.log(this.users());
      console.log(response);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  } 
  get pages() {
    return Array.from({ length: this.total_pages() }, (_, i) => i + 1);
  }

}
