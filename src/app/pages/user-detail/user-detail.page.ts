import { Component, inject, input, signal } from '@angular/core';
import { Users } from '../../core/services/users';
import { IUser } from '../../core/models/user.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink],
  templateUrl: './user-detail.page.html',
  styleUrl: './user-detail.page.css',
})
export class UserDetailPage {
  /*
  id = input<string>()
  personajesService = inject(PersonajesService)
  personaje = signal<IPersonaje | null>(null)
  */
  private route= inject(ActivatedRoute);
  _id= input<string>()
  userService = inject(Users)
  user = signal<IUser | null>(null)

  async ngOnInit() {
    const id: string = this._id() ?? '';
    //hacemos una petecion al servicio
    this.user.set(await this.userService.getById(id))
    console.log(this.user());
  }
}
