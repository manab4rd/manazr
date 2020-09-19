import { Component, OnInit, Input } from '@angular/core';
import { ViewCell, DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  color = '#fff';
  constructor() { }

  ngOnInit(): void {
  }
  onChange(val) {
    console.log(val);
  }

}

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerEditComponent extends DefaultEditor implements OnInit{
  color = '#fff';
  @Input() value: string;

  constructor() {
    super();
   }

  ngOnInit(): void {
    this.color = this.cell.newValue;
  }

  onChange(val: string) {
    this.cell.newValue = val;
  }

}
