import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Listing} from '../../../models/listing';
import {Image} from '../../../models/image';
import {StayDuvetService} from '../../../services/stayduvet';
import {Store} from '@ngrx/store';
import {getListingById, State} from '../../../reducers/index';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {AddImageSuccessAction} from '../../../actions/listing';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'sd-listing-images-popup',
  template: `
    <sd-modal-popup-layout title="Edit Images">
      <!--<div fxLayout="row"-->
      <!--fxLayoutAlign="center start"-->
      <!--fxLayoutGap="30px"-->
      <!--fxLayoutWrap-->
      <!--dnd-sortable-container-->
      <!--[sortableData]="listing?.getThumbnails()"-->
      <!--*ngIf="!editingCaption"-->
      <!--class="padding-both">-->
      <!--<sd-image-card *ngFor="let image of listing.getThumbnails(); let i = index"-->
      <!--(edit)="editImageCaption($event)"-->
      <!--[image]="image"-->
      <!--[deleteDisabled]="deleting"-->
      <!--dnd-sortable [sortableIndex]="i"-->
      <!--(remove)="removeImage($event)">-->
      <!--</sd-image-card>-->
      <!--<sd-add-card (addCardClicked)="addimageClicked()">Upload an Image</sd-add-card>-->
      <!--<input type="file" accept="image/*" style="visibility: hidden" #addImageWrapper>-->
      <!--<span *vaFlexAlignmentHack></span>-->
      <!--</div>-->
      <div fxLayout="row"
           fxLayoutAlign="center start"
           fxLayoutGap="30px"
           fxLayoutWrap
           dnd-sortable-container
           [sortableData]="images"
           *ngIf="!editingCaption"
           class="padding-both">
        <sd-image-card *ngFor="let image of images; let i = index"
                       (edit)="editImageCaption($event)"
                       [image]="image"
                       [deleteDisabled]="deleting"
                       dnd-sortable
                       (onDropSuccess)="dropSuccess()"
                       [sortableIndex]="i"
                       (remove)="removeImage($event)">
        </sd-image-card>
        <sd-add-card (addCardClicked)="addimageClicked()">Upload an Image</sd-add-card>
        <input type="file" accept="image/*" style="visibility: hidden" #addImageWrapper>
        <span *vaFlexAlignmentHack></span>
      </div>

      <div fxLayout="column" *ngIf="editingCaption">
        <button fxLayoutAlign="start center"
                fxLayoutGap="10px"
                mat-raised-button
                (click)="backClicked()"
                color="primary"
                style="margin-bottom: 40px;width: 100px">
          <mat-icon>
            arrow_back
          </mat-icon>
          <span style="text-align: center;width: auto;height: 15px">
            Back
          </span>
        </button>

        <div fxLayout="column" fxLayoutGap="50px" style="padding-right: 20px;padding-left: 20px;padding-bottom: 20px">
          <span style="font-size: 20px; font-weight: bolder">Edit Caption</span>
          <textarea class="container-box" style="padding: -10px" rows="8" [(ngModel)]="imageCaption"></textarea>
        </div>

        <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="10px" style="margin-right: 20px;">
          <mat-spinner *ngIf="isSaving" [diameter]="30" [strokeWidth]="4"></mat-spinner>
          <button mat-raised-button color="accent" [disabled]="isSaving" (click)="saveClicked()">Save</button>
        </div>
      </div>

      <mat-progress-bar *ngIf="deleting" [color]="'warn'" mode="indeterminate"></mat-progress-bar>
      <mat-progress-bar *ngIf="uploading" [value]="uploadProgress" [color]="'accent'"></mat-progress-bar>
    </sd-modal-popup-layout>
  `,
  styles: [`

    sd-image-card {
      width: 200px;
      margin-top: 20px;
    }

    sd-add-card {
      width: 150px;
      height: 150px;
      cursor: pointer;
    }

    mat-spinner {
      width: 30px;
      height: 30px;
    }

    span {
      width: 150px;
      height: 0px;
    }

    .container-box {
      border-style: solid;
      border-width: 0.1px;
      padding: 20px;
      border-color: #c8c8c8
    }

    .padding-both {
      padding-left: 20px;
      padding-right: 20px;
    }
  `]
})
export class ListingImagesPopupComponent implements OnInit, OnDestroy {

  @Input() listingId: number;
  listing;
  uploading = false;
  uploadProgress = 0;
  deleting = false;
  editingCaption = false;
  imageCaption = '';
  imageSelected: Image;
  private isAlive: boolean = true;
  private isSaving: Boolean = false;

  images;

  @ViewChild('addImageWrapper', {read: ElementRef}) addImageWrapper: ElementRef;

  ngOnInit() {
    if (this.addImageWrapper) {
      this.addImageWrapper.nativeElement.onchange = (event) => {
        this.uploading = true;
        this.uploadProgress = 0;

        this.service.addImages({image: event.target.files[0]}, String(this.listingId)).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.uploading = false;
            this.uploadProgress = 0;
            this.store.dispatch(new AddImageSuccessAction({
              image: Object.assign(new Image(), event.body.data),
              listingId: String(this.listingId)
            }));
          }
        },  () => {
          this.uploading = false;
          this.uploadProgress = 0;
        });
      };
    }

    this.store.select((state) => {
      return getListingById(state, this.listingId);
    }).takeWhile(() => this.isAlive).subscribe((listing) => {
      this.listing = listing;
      this.images = this.listing.getThumbnails().map((image) => image);
    });
  }

  constructor(private service: StayDuvetService,
              private store: Store<State>) {
  }

  addimageClicked() {
    this.addImageWrapper.nativeElement.click();
  }

  removeImage(id: string) {
    this.deleting = true;
    this.service.removeImages(String(this.listing.id), id).subscribe((deleted) => {
      this.deleting = false;
    }, () => {
      this.deleting = false;
    });
  }

  editImageCaption(image: Image) {
    this.editingCaption = true;
    this.imageCaption = image.caption;
    this.imageSelected = image;
  }

  backClicked() {
    this.editingCaption = false;
  }

  saveClicked() {
    this.isSaving = true;
    this.service.editImageCaption(this.listingId, this.imageSelected.id, {caption: this.imageCaption}).subscribe(() => {
      this.editingCaption = false;
      this.isSaving = false;
    }, () => {
      this.editingCaption = false;
      this.isSaving = false;
    });
  }


  dropSuccess() {
    const data = {sort_order: {}};
    let count = 1;
    this.images.map((image) => {
      data['sort_order'][image.id] = count;
      count++;
    });
    this.service.rearrangeListingImages(this.listingId,data,this.images).subscribe();
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}

