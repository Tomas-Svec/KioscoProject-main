import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSaleModalComponent } from './confirm-sale-modal.component';

describe('ConfirmSaleModalComponent', () => {
  let component: ConfirmSaleModalComponent;
  let fixture: ComponentFixture<ConfirmSaleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmSaleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmSaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
