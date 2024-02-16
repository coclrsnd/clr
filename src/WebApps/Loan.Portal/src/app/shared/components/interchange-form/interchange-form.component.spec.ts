import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterchangeFormComponent } from './interchange-form.component';

describe('InterchangeFormComponent', () => {
  let component: InterchangeFormComponent;
  let fixture: ComponentFixture<InterchangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterchangeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterchangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
