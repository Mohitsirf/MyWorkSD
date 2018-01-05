import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Image} from '../../models/image';

@Component({
  selector: 'sd-image-card',
  template: `
    <div>
      <div class="container">
        <img id="srcImage" src="{{image?.thumb_url}}">
        <div style="margin-top: -75%;margin-left: 90%;" id="CrossButton" matTooltip="remove" [hidden]="deleteDisabled">
          <button mat-icon-button (click)="removeImage()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="overlay" fxLayout="column">
          <button mat-icon-button class="edit" fxFlexAlign="end" style="color: white" (click)="editClicked()">
            <mat-icon >edit</mat-icon>
          </button>
          <div class="content">
            <span class="text">
              {{image?.caption | truncate : 20}}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`

    :host {
      position: relative;
      min-width: 150px;
      min-height: 150px;
    }

    img {
      width: 100%;
      height: auto;
      border-radius:2px;
      box-shadow: 1px 1px 5px gray;
    }

    #CrossButton {
      visibility: hidden;
      position: relative;
      cursor: pointer;
      color: white;
    }

    button {
      border-radius: 50%;
      background-color: black;
    }

    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: black;
      overflow: hidden;
      width: 100%;
      height: 0;
      transition: .5s ease;
    }

    .content{
      margin-top: 10px;
      margin-left: 10px;
      margin-right: 10px;
      position: absolute;
    }

    .text {
      white-space: pre-line;
      color: white;
      font-size: 10px;
      overflow: hidden;
      padding-left: 5px;
      padding-right: 5px;
      padding-top: 5px;
      padding-bottom: 5px;
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
    }

    .edit{
      cursor: pointer;
    }

    .container:hover .overlay {
      height: 50%;
    }

    img:hover ~ #CrossButton {
      visibility: visible;
    }

    #CrossButton:hover{
      visibility: visible;
    }

    #srcImage:hover {
      opacity: 0.5;
    }

  `]
})
export class ImageCardComponent implements OnInit {
  @Input() image: Image;
  @Input() deleteDisabled = false;
  @Output() remove = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Image>();

  ngOnInit(): void {
  }

  removeImage() {
    this.remove.emit(String(this.image.id));
  }

  editClicked(){
    this.edit.emit(this.image);
  }
}
