import { Component } from '@angular/core';
import { SessionServiceProvider } from '../../providers/session-service/session-service';

/**
 * Generated class for the RegistrationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-registration',
  templateUrl: 'registration.html'
})
export class RegistrationComponent {

  public email;
  public password;
  public passwordConfirmation;
  public username;

  constructor(public session: SessionServiceProvider) {
  }

  doRegister() {
    this.session.register();
  }

}
