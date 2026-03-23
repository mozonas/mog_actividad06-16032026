import { Component, inject, input, signal } from '@angular/core';
import { Users } from '../../core/services/users';
import { IUser } from '../../core/models/user.interface';
import { Router, RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterLink, ConfirmDialogComponent],
  templateUrl: './user-detail.page.html',
  styleUrl: './user-detail.page.css',
})
export class UserDetailPage {

  _id = input.required<string>();
  userService = inject(Users);
  router = inject(Router);

  user = signal<IUser | undefined>(undefined);

  // MISMO SISTEMA QUE EN EL LISTADO
  dialogState = signal<'none' | 'confirm-delete'>('none');

  async ngOnInit() {
    try {
      const data = await this.userService.getById(this._id());

      if (!data) {
        this.router.navigate(['/error404']);
        return;
      }

      this.user.set(data);

    } catch {
      this.router.navigate(['/error404']);
    }
  }

  onUpdate() {
    this.router.navigate(['/updateuser', this._id()]);
  }

  onDelete() {
    this.dialogState.set('confirm-delete');
  }

  async confirmDelete() {
    try {
      await this.userService.delete(this._id());
      this.router.navigate(['/home']);
    } catch {
      alert('Error eliminando el usuario');
    }
  }
}
