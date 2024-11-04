import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-success-alert',
  standalone: true,
  imports: [],
  template: ''
})
export class SuccessAlertComponent implements OnInit {

  @Input() title: string = 'Success';

  ngOnInit(): void {
    this.showError();
}

showError(): void {
  Swal.fire({
    position: "center",
    icon: "success",
    title: this.title,
    showConfirmButton: false,
    timer: 1500
  })

}
}
