import { async, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';

import { ConfirmationCardComponent } from './confirmation-card';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('Confirmation card Component', () => {
  let fixture;
  let component;
  const input = {
    header: 'Add Posted',
    items: [
      'Your Ad has been posted!',
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationCardComponent],
      imports: [
        IonicModule.forRoot(ConfirmationCardComponent)
      ],
      providers: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationCardComponent);
    component = fixture.componentInstance;
    component.confirmationContent = input;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof ConfirmationCardComponent).toBe(true);
    expect(component.confirmationContent).toEqual(input);
  });


});
