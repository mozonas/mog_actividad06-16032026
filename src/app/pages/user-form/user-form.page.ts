import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from '../../core/services/users';
import { IUser } from '../../core/models/user.interface';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.page.html',
  styleUrl: './user-form.page.css',
})
export class UserFormPage {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(Users);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    image: ['']
  });

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();   // ← IMPORTANTE: fuerza mostrar errores
      return;
    }

    const data: Partial<IUser> = this.form.value;

    await this.userService.create(data);

    this.router.navigate(['/home']);
  }
}
