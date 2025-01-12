import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFavComponent } from './modal-fav.component';

describe('ModalFavComponent', () => {
  let component: ModalFavComponent;
  let fixture: ComponentFixture<ModalFavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
