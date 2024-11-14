import { Component } from '@angular/core';
import { SuccessAlertComponent } from "../alerts/success-alert/success-alert.component";
import { ErrorAlertComponent } from "../alerts/error-alert/error-alert.component";

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [
    SuccessAlertComponent, 
    ErrorAlertComponent],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css'
})
export class DeleteUserComponent {

  isSuccess : boolean = false;
  successTitle : string = '';

  isError : boolean = false;
  titleError : string = '';
  errorMessage : string = '';

  


  onConfirmation(confirmed: boolean) {
    if(confirmed === false) {
      this.isError = false;
    }
  }
}
