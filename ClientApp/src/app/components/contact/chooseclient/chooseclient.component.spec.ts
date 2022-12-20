import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseclientComponent } from './chooseclient.component';

describe('ChooseclientComponent', () => {
  let component: ChooseclientComponent;
  let fixture: ComponentFixture<ChooseclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseclientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
