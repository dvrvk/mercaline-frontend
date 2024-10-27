import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderByProductsComponent } from './order-by-products.component';

describe('OrderByProductsComponent', () => {
  let component: OrderByProductsComponent;
  let fixture: ComponentFixture<OrderByProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderByProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderByProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
