import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private selectedCategorySource = new BehaviorSubject<Object>(Object);
  selectedCategory$ = this.selectedCategorySource.asObservable();

  selectCategory(categorySelect: Object) {
    this.selectedCategorySource.next(categorySelect);
  }
}
