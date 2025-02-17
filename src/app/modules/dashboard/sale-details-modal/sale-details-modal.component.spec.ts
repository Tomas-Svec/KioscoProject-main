import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDetailsModalComponent } from './sale-details-modal.component';

describe('SaleDetailsModalComponent', () => {
  let component: SaleDetailsModalComponent;
  let fixture: ComponentFixture<SaleDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
