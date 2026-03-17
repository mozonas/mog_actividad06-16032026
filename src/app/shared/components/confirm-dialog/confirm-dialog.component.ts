import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  @Input() title = '';
  @Input() message = '';

  // confirm → azul
  // error → rojo
  // success → verde
  @Input() type: 'confirm' | 'error' | 'success' = 'confirm';

  @Input() acceptText = 'Aceptar';
  @Input() cancelText = 'Cancelar';
  @Input() showCancel = true;

  @Output() accept = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onAccept() {
    this.accept.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
