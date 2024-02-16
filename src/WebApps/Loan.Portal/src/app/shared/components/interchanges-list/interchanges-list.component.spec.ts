import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterchangesListComponent } from './interchanges-list.component';

describe('InterchangesListComponent', () => {
  let component: InterchangesListComponent;
  let fixture: ComponentFixture<InterchangesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterchangesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterchangesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
