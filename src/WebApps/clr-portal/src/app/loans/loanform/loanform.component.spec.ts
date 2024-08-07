import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LoanformComponent } from "./LoanformComponent";

describe("LoanformComponent", () => {
  let component: LoanformComponent;
  let fixture: ComponentFixture<LoanformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanformComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
