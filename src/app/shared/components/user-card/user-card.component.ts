import { Component,input,Output,EventEmitter } from '@angular/core';
import { IUser } from '../../../core/models/user.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
   miUsuario = input<IUser>();
   @Output() delete = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.miUsuario()?._id!);
  }
}
