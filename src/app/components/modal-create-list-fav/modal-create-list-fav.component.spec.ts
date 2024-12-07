import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateListFavComponent } from './modal-create-list-fav.component';

describe('ModalCreateListFavComponent', () => {
  let component: ModalCreateListFavComponent;
  let fixture: ComponentFixture<ModalCreateListFavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateListFavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateListFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
