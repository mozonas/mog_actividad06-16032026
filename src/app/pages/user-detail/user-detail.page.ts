import { Component, inject, input, signal } from '@angular/core';
import { Users } from '../../core/services/users';
import { IUser } from '../../core/models/user.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  _id= input<string>()
  userService = inject(Users)
  user = signal<IUser | null>(null)

async ngOnInit() {
    try {
      const id = this.route.snapshot.params['id'];
      const user = await this.userService.getById(id);
      this.user.set(user);
    } catch (err) {
      // Si el ID no existe o es inválido → redirigimos
      this.router.navigate(['/error404']);
    }
  }
}
