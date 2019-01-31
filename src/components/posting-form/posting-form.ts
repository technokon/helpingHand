import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {UploadServiceProvider} from '../../providers/upload-service/upload-service';
import {CategoryPickPage} from '../../pages/category-pick/category-pick';
import {LoadingController, ModalController, Platform} from 'ionic-angular';
import {SearchServiceProvider} from '../../providers/search-service/search-service';
import {SessionServiceProvider} from '../../providers/session-service/session-service';
import {AdProvider} from '../../providers/ad/ad';
import {IImage, ImageCompressService} from 'ng2-image-compress';

/**
 * Generated class for the PostingFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'h-posting-form',
  templateUrl: 'posting-form.html'
})
export class PostingFormComponent implements OnInit {

  public ad: any = {
    pictures: [],
  };
  public category;
  public selectedCategory;
  private files = [];
  @Output('event.postingForm.posted') adPosted: EventEmitter<any> = new EventEmitter<any>();
  @Output('event.postingForm.deleted') adDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output('event.postingForm.updated') adUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output('event.postingForm.cancelled') adCancelled: EventEmitter<any> = new EventEmitter<any>();
  private processedImages: Array<IImage>;
  private loading;

  constructor(private service: FirebaseServiceProvider,
              private uploadService: UploadServiceProvider,
              public modalCtrl: ModalController,
              private searchService: SearchServiceProvider,
              private sessionService: SessionServiceProvider,
              private adService: AdProvider,
              public platform: Platform,
              private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.subscribeToCategories();
    this.subscribeToFileSelections();
    this.subscribeToEditPosting();
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  }

  postAd() {
    this.startLoading();
    this.ad.owner = this.sessionService.user.uid;
    this.ad.datePosted = new Date();
    return this.service.addPosting(this.ad, this.files).subscribe((posting) => {
      this.adPosted.emit({
        result: 'success',
        data: {
          link: posting,
        },
      });
      return posting;
    }, (error) => {
      console.log(`error creating posting: ${error}`);
    }, () =>
      this.loading.dismiss());
  }

  private startLoading() {
    this.loading.present();
  }

  cancelAd() {
    this.adCancelled.emit({
      result: 'success',
    });
  }

  private subscribeToCategories() {
    this.searchService.getCategorySearch().subscribe(searchCategory => {
      this.selectedCategory = searchCategory;
      this.category = searchCategory.name;
      this.ad.category = searchCategory.id;
    })
  }

  private subscribeToFileSelections() {
    this.uploadService.getFileSelectorSubject().subscribe(files => {
      this.files = files;
    });
  }

  private subscribeToEditPosting() {
    this.adService.editPostingSubject.subscribe(posting => {
      if (posting && posting.id) {
        this.ad = posting;
      }
    })
  }

  onChange(fileInput: any) {
    let images: Array<IImage> = [];

    ImageCompressService.filesToCompressedImageSource(fileInput.target.files)
      .then(observableImages => {
        observableImages.subscribe((image) => {
          images.push(image);
        }, (error) => {
          console.log("Error while converting");
        }, () => {
          this.processedImages = images.map(i => i.compressedImage);
          this.uploadService.getFileSelectorSubject().next(this.processedImages);
        });
    });
  }

  clearSelectedCategory() {
    this.selectedCategory = null;
    this.category = null;
    delete this.ad.category;
  }

  showCategorySelectionModal($event) {
    $event.preventDefault();
    this.modalCtrl.create(CategoryPickPage).present();
  }

  updateAd() {
    // do an update operation and also the index has to be updated (- trigger on node side)
    this.ad.datePosted = new Date();
    this.service.updatePosting(this.ad, this.files).subscribe(() => {
        this.adUpdated.emit({
          result: 'success',
          data: {
            link: 'a link to the posted ad',
          },
        });
      },
      (error) => {
        console.log(`error updating posting: ${error}`);
      });
  }

  deleteAd() {
    // todo pop an are you sure dialog
    this.service.deletePosting(this.ad).subscribe(() => {
      this.adDeleted.emit({
        result: 'success',
        data: {},
      });
    }, (error) => {
      console.log(`error deleting posting: ${error}`);
    });
  }
}
