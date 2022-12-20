import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosecontactComponent } from './choosecontact.component';

describe('ChoosecontactComponent', () => {
  let component: ChoosecontactComponent;
  let fixture: ComponentFixture<ChoosecontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoosecontactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoosecontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
