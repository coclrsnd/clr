import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LeadsformComponent } from "./leadsform.component";

describe("LeadsformComponent", () => {
  let component: LeadsformComponent;
  let fixture: ComponentFixture<LeadsformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsformComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadsformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
