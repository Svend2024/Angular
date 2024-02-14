import { Component, OnInit } from '@angular/core';
import { TransactionHistory } from '../Interface/transaction-history';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  public cart: any[] = [];

  transaction: TransactionHistory[] = [];

  ngOnInit(): void {
    this.cart = JSON.parse(sessionStorage['cart']);    
    console.log(this.cart)
  }

  RemoveAmount(item: any) {
    if (item.amount == 1) {
    } else {
      this.cart[this.cart.indexOf(item)].amount -= 1;
      // let recurring = this.cart.find((data: any)  => data.id == item.id);
    }
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
    // console.log(sessionStorage.getItem('cart'));
  }

  AddAmount(item: any) {
    item.amount += 1;
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  }

  RemoveItem(item: any) {
    this.cart.splice(this.cart.indexOf(item), 1);
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  }

  Purchase() {
    // var dateTime = new Date();
    // // YYYY-MM-DD HH:MM:SS
    // var date =
    //   dateTime.getFullYear() +
    //   "-" +
    //   dateTime.getMonth() +
    //   "-" +
    //   dateTime.getDate() +
    //   "T" +
    //   dateTime.getHours() +
    //   ":" +
    //   dateTime.getMinutes() +
    //   ":" +
    //   dateTime.getSeconds() +
    //   "." +
    //   dateTime.getMilliseconds() +
    //   "Z";

    // if (!this._auth.id) {
    //   // opret Customer -login
    // } else {
    //   for (let index = 0; index < this.cart.length; index++) {
    //     this.purchase.push({
    //       UserId: Number(this._auth.id),
    //       ItemId: Number(this.cart[index].id),
    //       Amount: Number(this.cart[index].amount),
    //       Bought: String(date),
    //     });
    //   }

    //   this.api.PurchaseService(this.purchase).subscribe();
    //   this.purchase = [];
    //   this.cart = [];
    //   sessionStorage.removeItem('cart');
    // }
  }

  TotalPrice(){
    let price: number = 0;
    this.cart.forEach(element => {
      price += element.item.price/1 * element.amount;
    });

    return (price).toFixed(2);
  }

  TotalAmount(){
    let amount: number = 0;
    this.cart.forEach(element => {
      amount += element.amount;
    });
    return amount;
  }

  // errorPopupMessages(Messages: string) {
  //   this.errorMessages = Messages
  //   document.getElementById("errorpopup")?.click();
  // }
}
