import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenedPagesComponent } from './opened-pages.component';

describe('OpenedPagesComponent', () => {
  let component: OpenedPagesComponent;
  let fixture: ComponentFixture<OpenedPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenedPagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenedPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
