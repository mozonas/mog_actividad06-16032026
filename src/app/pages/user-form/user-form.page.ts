import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from '../../core/services/users';
import { IUser } from '../../core/models/user.interface';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { signal, computed } from '@angular/core';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule,ConfirmDialogComponent],
  templateUrl: './user-form.page.html',
  styleUrl: './user-form.page.css',
})
export class UserFormPage {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(Users);

  createdUser: IUser | null = null;
  showSuccessDialog = false;
  dialogState = signal<'none' | 'confirm' | 'success'>('none');

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

  async submit(): Promise<boolean> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    const data: Partial<IUser> = this.form.value;

    try {
      const response = await this.userService.create(data);
      console.log('RESPUESTA API', response);
      this.createdUser = response;
      return true;
    } catch (error) {
      console.error('ERROR EN CREATE', error);
      return false;
    }
  }





  showDialog = false;

  openDialog() {
    this.dialogState.set('confirm');
  }

  closeDialog() {
    this.dialogState.set('none');
  }



  async confirmCreate() {
    const ok = await this.submit();

    this.dialogState.set('none'); // cerrar confirmación

    if (ok) {
      // abrir éxito en el siguiente ciclo
      queueMicrotask(() => {
        this.dialogState.set('success');
      });
    }
  }

  goHome() {
    this.dialogState.set('none');
    this.router.navigate(['/home']);
  }



}

