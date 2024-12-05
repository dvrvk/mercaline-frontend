import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FavoritesService } from '../../services/favorites-service/favorites.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-create-list-fav',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal-create-list-fav.component.html',
  styleUrl: './modal-create-list-fav.component.css'
})
export class ModalCreateListFavComponent {

  createListForm!: FormGroup;
  @Output() created = new EventEmitter<Object>();
  @Input() listFav : any[] = [];

  duplicateName : boolean = false;

  constructor(private fb: FormBuilder, private favService : FavoritesService) {
    this.createListForm = this.fb.group({
      listName: ['', [Validators.required, 
                      Validators.minLength(3)
      ]]
    });
  }

  onCreate(): void {
    this.duplicateName = false;
    if (this.createListForm.valid && !this.listFav.some(fav => fav.nameList.toLowerCase() == this.createListForm.value.listName.toLowerCase())) {
      const listName = this.createListForm.value.listName;
      this.favService.createNewList(listName).subscribe(
        data => {
          this.created.emit(data);
        }, 
        error => {
          console.log("mensaje error" + error);
        }
      )
      // Aquí puedes añadir la lógica para enviar los datos al backend.
    } else {
      this.duplicateName = true;
      this.createListForm.markAllAsTouched();
      
    }
  }

  onCancel(): void {
    this.createListForm.reset();
  }

  checkDuplicate() : void {
    this.duplicateName = this.listFav.some(fav => fav.nameList.toLowerCase() == this.createListForm.value.listName.toLowerCase());
  }

  onModalOpen() {
    this.createListForm.reset();
  }

}
