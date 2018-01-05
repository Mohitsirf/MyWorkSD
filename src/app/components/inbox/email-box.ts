import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sd-email-box',
  template: `
    <div fxLayout="column" fxLayoutGap="5px">
      <div class="textareaContainer">
        <input [(ngModel)]="subjectModel" (ngModelChange)="subjectValueChange()" class="ta5 main" type="text" placeholder="Subject">
      </div>
      <div fxLayout="column">
          <!--<div class="padding-both ta5">-->
            <!--<div fxLayoutAlign="center" fxLayoutGap="5px">-->
              <!--<mat-icon>format_bold</mat-icon>-->
              <!--<mat-icon>format_italic</mat-icon>-->
              <!--<mat-icon>strikethrough_s</mat-icon>-->
              <!--<span class="separator">|</span>-->
              <!--<mat-icon>format_list_bulleted</mat-icon>-->
              <!--<mat-icon>format_list_numbered</mat-icon>-->
              <!--<mat-icon>format_quote</mat-icon>-->
              <!--<span class="separator">|</span>-->
              <!--<mat-icon>link</mat-icon>-->
              <!--<mat-icon>link</mat-icon>-->
              <!--<mat-icon>flag</mat-icon>-->
              <!--<span class="separator">|</span>-->
              <!--<mat-icon>zoom_out_map</mat-icon>-->
            <!--</div>-->
            <!--<div fxLayoutAlign=" center" fxLayoutGap="5px">-->
              <!--<mat-select placeholder="Format">-->
                <!--<mat-option *ngFor="let selectOption of selectOptions" [value]="selectOption">-->
                  <!--{{ selectOption.title }}-->
                <!--</mat-option>-->
              <!--</mat-select>-->
              <!--<span class="separator">|</span>-->
              <!--<mat-icon>content_paste</mat-icon>-->
              <!--<mat-icon>content_paste</mat-icon>-->
              <!--<mat-icon>format_clear</mat-icon>-->

              <!--<span class="separator">|</span>-->
              <!--<mat-icon>panorama</mat-icon>-->
              <!--<mat-icon>grid_on</mat-icon>-->
              <!--<mat-icon>flag</mat-icon>-->

              <!--<span class="separator">|</span>-->
              <!--<mat-icon>format_indent_decrease</mat-icon>-->
              <!--<mat-icon>format_indent_increase</mat-icon>-->

              <!--<span class="separator">|</span>-->
              <!--<mat-icon>reply</mat-icon>-->
              <!--<mat-icon>forward</mat-icon>-->

              <!--<span class="separator">|</span>-->
              <!--<mat-icon>description</mat-icon>-->
              <!--<span>Source</span>-->

            <!--</div>-->
          <!--</div>-->
          <div class="textareaContainer ">
            <div [froalaEditor]="option" [(ngModel)]="textModel"  (ngModelChange)="valuechange($event)" class="ta5 main"></div>

            <!--<textarea [froalaEditor] [(ngModel)]="textModel" (ngModelChange)="valuechange($event)" class="ta5 main" rows="3"-->
                      <!--placeholder="write your message here..."></textarea>-->
          </div>
      </div>
    </div>
  `,
  styles: [`
    .main {
      width: 98%;
    }

    .padding-both {
      padding-left: 10px;
      padding-right: 10px;
    }

    .separator {
      font-size: 20px;
    }

    .ta5 {
      border: 1.4px solid #765942 !important;
      border-radius: 3px !important;
      font-size: x-small;

    }

    .textareaContainer {
      padding: 0px 0px 5px 5px;
      font-size: x-small;
      height: auto;

    }
    
    input[type=text], textarea {
      -webkit-transition: all 0.30s ease-in-out;
      -moz-transition: all 0.30s ease-in-out;
      -ms-transition: all 0.30s ease-in-out;
      -o-transition: all 0.30s ease-in-out;
      outline: none;
      padding: 5px 0px 5px 5px;
      margin: 5px 1px 3px 0px;
      border: 1px solid #DDDDDD;
      font-family: 'Roboto', sans-serif;
    }

    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      letter-spacing: 2px;
      color: #333333;
    }

    ::-moz-placeholder { /* Firefox 19+ */
      letter-spacing: 2px;
      color: #333333;
    }

    :-ms-input-placeholder { /* IE 10+ */
      letter-spacing: 2px;
      color: #333333;
    }

    :-moz-placeholder { /* Firefox 18- */
      letter-spacing: 2px;
      color: #333333;
    }

    [placeholder]:focus::-webkit-input-placeholder {
      transition: text-indent 0.5s 0.5s ease;
      text-indent: -100%;
      opacity: 1;
    }

    input[type=text]:focus, textarea:focus {
      box-shadow: 0 0 5px rgba(81, 203, 238, 1);
      padding: 5px 0px 5px 5px;
      margin: 5px 1px 3px 0px;
      border: 1px solid rgba(81, 203, 238, 1);
      font-family: 'Roboto', sans-serif;
    }
  `],
})


export class EmailBoxComponent implements OnInit{


  @Input() textModel;
  @Output() text = new EventEmitter<string>();
  @Output() subject = new EventEmitter<string>();
  @Input() subjectModel:string = 'Hi!';

  option:Object;


  ngOnInit(): void {
    this.option = {
    placeholderText : 'write your message here...', heightMax: 300
    }
  }


  valuechange(newValue) {
    this.text.emit(newValue);
  }

  subjectValueChange() {
    this.subject.emit(this.subjectModel);
  }
}

