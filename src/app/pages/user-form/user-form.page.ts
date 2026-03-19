import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Users } from '../../core/services/users';
import { IUser } from '../../core/models/user.interface';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './user-form.page.html',
  styleUrl: './user-form.page.css',
})
export class UserFormPage {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userService = inject(Users);
  private route = inject(ActivatedRoute);

  // UserId
  userId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('_id'))
    ),
    { initialValue: null }
  );

  // modo derivado automáticamente según si hay ID
  mode = computed(() => this.userId() ? 'edit' : 'create');

  // estado de diálogos (crear, actualizar, éxito, error)

  //dialogState = signal<'none' | 'confirm' | 'confirm-update' | 'success' | 'error'>('none');
  errorMessage = signal<string>('');
  dialogState = signal<'none' | 'confirm' | 'confirm-update' | 'success-create' | 'success-update' | 'error'>('none');


  createdUser: IUser | null = null;

  // Formulario compartido entre crear y editar
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

  constructor() {
    // Si estamos en modo edición, cargamos el usuario
    if (this.userId()) {
      this.loadUser(this.userId()!);
    }
  }

  // Cargar datos del usuario para EDITAR
  async loadUser(id: string) {
    try {
      const user = await this.userService.getById(id);

      this.form.patchValue({
        name: user.first_name,
        surname: user.last_name,
        email: user.email,
        image: user.image
      });

    } catch (err) {
      console.error('Error cargando usuario', err);
      this.errorMessage.set(this.userService.extractError(err));
      this.dialogState.set('error');
    }
  }


  // Validación visual
  checkControl(control: string, error: string) {
    const c = this.form.get(control);
    return c?.hasError(error) && (c.touched || c.dirty);
  }

  // SUBMIT para CREAR
  async submit(): Promise<boolean> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    try {
      const response = await this.userService.create(this.form.value);
      this.createdUser = response;
      return true;
    } catch (error) {
      console.error('ERROR EN CREATE', error);
      this.errorMessage.set(this.userService.extractError(error));
      this.dialogState.set('error');
      return false;
    }
  }

  // SUBMIT para EDITAR
  async submitUpdate(): Promise<boolean> {
    debugger
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    try {
      const response = await this.userService.update(this.userId()!, this.form.value);
      this.createdUser = response;
      return true;
    } catch (err) {
      console.error('ERROR EN UPDATE', err);
      this.errorMessage.set(this.userService.extractError(err));
      this.dialogState.set('error');
      return false;
    }
  }

  // Abrir diálogo de confirmación para CREAR
  openDialog() {
    this.dialogState.set('confirm');
  }

  // Abrir diálogo de confirmación para EDITAR
  openUpdateDialog() {
    this.dialogState.set('confirm-update');
  }

  closeDialog() {
    this.dialogState.set('none');
  }

  // Confirmación final para CREAR
  async confirmCreate() {
  const ok = await this.submit();
  this.dialogState.set('none');

  if (ok) {
    queueMicrotask(() => {
      this.dialogState.set('success-create');
    });
  }
}


  // Confirmación final para EDITAR
  async confirmUpdate() {
  const ok = await this.submitUpdate();
  this.dialogState.set('none');

  if (ok) {
    queueMicrotask(() => {
      this.dialogState.set('success-update');
    });
  }
}


  // Volver a Home tras éxito
  goHome() {
    this.dialogState.set('none');
    this.router.navigate(['/home']);
  }
}
