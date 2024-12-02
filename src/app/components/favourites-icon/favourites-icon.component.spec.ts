import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritesIconComponent } from './favourites-icon.component';

describe('FavouritesIconComponent', () => {
  let component: FavouritesIconComponent;
  let fixture: ComponentFixture<FavouritesIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouritesIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouritesIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
