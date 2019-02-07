import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, Platform} from 'ionic-angular';
import {SessionServiceProvider} from '../../providers/session-service/session-service';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'h-page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(
    public navCtrl: NavController,
    public sessionService: SessionServiceProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public platform: Platform,) {
  }

  updatePassword() {
    const password = this.sessionService.user.password;
    const loader = this.loadingCtrl.create({
      content: "Updating your password..."
    });
    return loader.present()
      .then(() =>
        this.sessionService.updateUserPassword(password))
      .then(() => loader.dismiss())
      .catch((error) => {
        console.log(`Error updating password: ${error}`);
        loader.dismiss();
        throw error;
      });
  }

  showDeleteProfileAlert() {
    const confirmDelete = this.alertCtrl.create({
      title: 'You are about to delete your profile',
      message: 'Are you sure you want to do that?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Delete Profile',
          handler: () => {
            console.log(`deleting profile...`);
            this.deleteProfile();
          }
        }
      ]
    });
    return confirmDelete.present();
  }

  deleteProfile() {
    const loader = this.loadingCtrl.create({
      content: "Deleting your profile..."
    });
    return loader.present()
      .then(() => this.sessionService.deleteUser())
      .then(() => this.closePage())
      .then(() => loader.dismiss())
      .catch((error) => {
        console.log(`Error deleting profile: ${error}`);
        loader.dismiss();
      });
  }

  closePage() {
    return this.navCtrl.pop();
  }

}
