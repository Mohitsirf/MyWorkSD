import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sd-message-box',
  template: `
    <div fxLayout="column">
      <div class="textareaContainer">
        <textarea [(ngModel)]="textModel"
                  (ngModelChange)="valuechange($event)"
                  class="ta5 main"
                  rows="4"
                  placeholder="write your message here...">
        </textarea>
      </div>
    </div>
  `,
  styles: [`
    
    .ta5 {
      border: 1.4px solid #765942;
      border-radius: 3px;
      min-height: 65px;
      font-size: x-small;
      font-family: 'Roboto', sans-serif;
    }

    .textareaContainer {
      padding: 0px 0px 5px 5px;
    }

    .main {
      width: 98%;
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

    ::-webkit-input-placeholder { 
      /* Chrome/Opera/Safari */
      letter-spacing: 2px;
      color: #333333;
    }

    ::-moz-placeholder {
      /* Firefox 19+ */
      letter-spacing: 2px;
      color: #333333;
    }

    :-ms-input-placeholder { 
      /* IE 10+ */
      letter-spacing: 2px;
      color: #333333;
    }

    :-moz-placeholder {
      /* Firefox 18- */
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


export class MessageBoxComponent implements OnInit {
  @Input() textModel;
  @Output() text = new EventEmitter<string>();

  ngOnInit(): void {
    console.log('onInit sd-message-box');
  }

  valuechange(newValue) {
    this.text.emit(newValue);
  }
}

