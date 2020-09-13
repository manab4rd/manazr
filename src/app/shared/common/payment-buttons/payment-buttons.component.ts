import { Component, OnInit, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as moment from 'moment';
@Component({
  selector: 'app-payment-buttons',
  template: `<span class="d-flex flex-wrap justify-content-start" [innerHtml]= "htmlcontent"></span>`
})
export class PaymentButtonsComponent implements ViewCell, OnInit, AfterViewInit {

  public content = '';
  htmlcontent: SafeHtml;
  public contantArray = [];
  public ele: any;
  public ele2: any;
  // myuser: any = '';

  @Input()
  public value: number;

  @Input()
  rowData: any;

  @Output() pay: EventEmitter<any> = new EventEmitter();
  @Output() paid: EventEmitter<any> = new EventEmitter();

  constructor(private sanitizer: DomSanitizer, public elementRef: ElementRef){}

  get myuser()
  {
    return JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    // console.log(this.myuser);
    // console.log(this.rowData);
    for ( let i = 1; i <= this.rowData.Occurrence; i++){
      if (this.value === null || this.value === 0 ){
        this.content += `<div class="btn-group btn-group-sm m-1" role="group">
        <div type="button" class="btn btn-secondary btn-compact disabled"><strong>DUE:</strong> ${moment(this.myuser.sessionStart).add(((this.myuser.monthCount / this.rowData.Occurrence) * 30) * (i - this.rowData.PayType), 'd').format('MMM D, YYYY')}</div>
        <button type="button" class="btn btn-primary btn-compact pay text-white">Pay Now</button></div>`;
      // tslint:disable-next-line: radix
      } else if (parseInt(this.rowData.PaidAmount.split(',')[i - 1]) === 0){
        this.content += `<button type="button" class="btn btn-warning btn-compact m-1 text-white">Opt Out</button>`;
        this.value--;
      } else {
        this.content += `<div class="btn-group btn-group-sm m-1" role="group">
        <div type="button" class="btn bg-inverse-success btn-compact disabled">Installment ${i}</div>
        <button type="button" class="btn btn-success btn-compact text-white paid">Paid</button></div>`;
        this.value--;
      }
      this.htmlcontent = this.sanitizer.bypassSecurityTrustHtml(this.content);
    }
  }

  public ngAfterViewInit() {
    // Solution for catching click events on anchors using querySelectorAll:
    this.ele = this.elementRef.nativeElement.querySelectorAll('button.pay');
    this.ele.forEach((btn: HTMLButtonElement) => {
      btn.addEventListener('click', this.openDialogPay);
    });
    this.ele2 = this.elementRef.nativeElement.querySelectorAll('button.paid');
    this.ele2.forEach((btn: HTMLButtonElement) => {
      btn.addEventListener('click', this.openDialogPaid);
    });
  }

  private openDialogPay = (event: Event) => {
    console.log('reached here: ' + event);
    this.pay.emit(this.rowData); // now correct this
  }

  private openDialogPaid = (event: Event) => {
    console.log('reached here: ' + event);
    this.paid.emit(this.rowData); // now correct this
  }
}
