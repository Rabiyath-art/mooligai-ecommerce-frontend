import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoryEditComponent } from './admin-category-edit.component';

describe('AdminCategoryEditComponent', () => {
  let component: AdminCategoryEditComponent;
  let fixture: ComponentFixture<AdminCategoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategoryEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
