import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FavoritesService } from '../../services/favorites-service/favorites.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var Swal: any;

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
  @Output() edit = new EventEmitter<Object>();
  @Input() listFav : any[] = [];
  @Input() option: string = 'create';
  @Input() idList : number | null = null;
  @Input() nameList: string | null = null;

  duplicateName : boolean = false;

  constructor(private fb: FormBuilder, private favService : FavoritesService) {
    this.createListForm = this.fb.group({
      listName: ['', [Validators.required, 
                      Validators.minLength(3)
      ]]
    });
  }

  onAction(): void {
    this.duplicateName = false;
    if (this.createListForm.valid && !this.listFav.some(fav => fav.nameList.toLowerCase() == this.createListForm.value.listName.toLowerCase())) {
      const listName = this.createListForm.value.listName;
      if(this.option == 'create') {
        this.onCreatetttt(listName);
      } else if(this.option == 'update' && this.idList) {
        this.onEdit(listName, this.idList)
      }
      
      
    } else {
      this.duplicateName = true;
      this.createListForm.markAllAsTouched();
      
    }
  }

  onEdit(listName : string, idList: number) {
    this.favService.editList(listName, idList).subscribe(
      data => {
        this.edit.emit(data);
      }, 
      error => {
        console.log("Error" + error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          confirmButtonColor: '#4dce83',
          text: error.error.mensaje,
        });
      }
    )
  }

  onCreatetttt(listName : string) : void {
    this.favService.createNewList(listName).subscribe(
      data => {
        this.created.emit(data);
      }, 
      error => {
        console.log("Error" + error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          confirmButtonColor: '#4dce83',
          text: error.error.mensaje,
        });
      }
    )
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
