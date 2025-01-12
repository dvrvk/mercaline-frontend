import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateFavComponent } from './modal-create-fav.component';

describe('ModalCreateFavComponent', () => {
  let component: ModalCreateFavComponent;
  let fixture: ComponentFixture<ModalCreateFavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateFavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
