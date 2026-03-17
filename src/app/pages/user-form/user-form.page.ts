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
  name: ['', [Validators.required, Validators.minLength(3)]],
  surname: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
  ]],
  image: ['', [
    Validators.required,
    Validators.pattern('https?://.*\\.(jpg|jpeg|png|gif|webp)$')
  ]],
});

checkControl(control: string, error: string) {
  const c = this.form.get(control);
  return c?.hasError(error) && (c.touched || c.dirty);
}

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


