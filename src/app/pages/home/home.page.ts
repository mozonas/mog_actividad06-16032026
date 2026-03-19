import { Component, inject, signal} from '@angular/core';
import { Users } from '../../core/services/users';
import { IUser } from '../../core/models/user.interface'; 
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-home',
  imports: [UserCardComponent,ConfirmDialogComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  private usersService = inject(Users);
  users = signal<IUser[]>([]);
  page = signal(1);
  total_pages = signal(0);
  errorMessage = signal<string>('');
  dialogState = signal<'none' | 'error' | 'success' | 'confirm-delete'>('none');

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
    } 
    catch (error) {
      console.error('Error loading users:', error);
      this.errorMessage.set(this.usersService.extractError(error));
      this.dialogState.set('error');
    }
  } 
  get pages() {
    return Array.from({ length: this.total_pages() }, (_, i) => i + 1);
  }


  userToDelete = signal<string | null>(null);

  openDeleteDialog(id: string) {
    this.userToDelete.set(id);
    this.dialogState.set('confirm-delete');
  }

  closeDialog() {
    this.dialogState.set('none');
    this.userToDelete.set(null);
  }

  async confirmDelete() {
    try {
      await this.usersService.delete(this.userToDelete()!);
      this.dialogState.set('success');
      this.loadUsers(this.page()); // recargar lista
    } catch (err) {
      console.error(err);
      this.errorMessage.set(this.usersService.extractError(err));
      this.dialogState.set('error');
    }
  }
}
