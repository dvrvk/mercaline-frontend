import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [],
  templateUrl: './error-alert.component.html',
  styleUrl: './error-alert.component.css'
})
export class ErrorAlertComponent implements OnInit{

  @Input() title: string = 'Error';
  @Input() message: string = "Ha ocurrido un error inesperado."


  ngOnInit(): void {
      this.showError();
  }

  // Define un Output para emitir un evento cuando se confirme el SweetAlert
  @Output() confirmation = new EventEmitter<boolean>();

  showError(): void {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: this.title,
      text: this.message,
      showConfirmButton: true,
      confirmButtonColor: '#48be79'
    }).then((result) => {
      if (result.isConfirmed) {
        // Emitimos `false` cuando el usuario hace clic en "Confirmar"
        this.confirmation.emit(false);
      };
    });

  }
}
