import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSaleModalComponent } from './add-sale-modal.component';

describe('AddSaleModalComponent', () => {
  let component: AddSaleModalComponent;
  let fixture: ComponentFixture<AddSaleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSaleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
