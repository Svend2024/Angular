import { Component, OnInit } from '@angular/core';
import { YugiohService } from '../services/yugioh.service';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {HttpParams} from "@angular/common/http";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
  providers: [ YugiohService ]
})

export class StoreComponent implements OnInit{
  constructor(private cards: YugiohService) { }
  public cardData: any;
  public cart: any = [];
  holder: any;
  type: string="";
  Attribute: string="";
  Race: string="";
  Effect: string="";

  public Searchform = new FormGroup({
    Search: new FormControl('')
  });
  
  ngOnInit(): void {
    this.products();
    this.Searchbar();
    this.type = '';
    this.Attribute = "";
    this.Race = "";
    this.Effect = "";
    this.holder = JSON.parse(sessionStorage['cart']);
    console.log(this.holder[0]);

    for (let index = 0; index < this.holder.length; index++) {
      const element = this.holder[index];
      this.cart.push({
        id: Number(element.id),
        name: String(element.name),
        smallImg: String(element.smallImg),
        cardPrice: String(element.cardPrice),
        amount: Number(element.amount)
      });
    }
    console.log(this.cart);

  }

  /*AddToCart(item: any) {
    let recurring = this.cart.find((data: any) => data.id == item.id);

    if (recurring != null) {
      this.cart[this.cart.indexOf(recurring)].amount += 1;
    }
    else {
      this.cart.push({
        id: item.id,
        name: item.name,
        smallImg: item.card_images[0].image_url_small,
        cardPrice: item.card_prices[0].tcgplayer_price,
        amount: 1
      });
    }

    sessionStorage.setItem('cart', JSON.stringify(this.cart));
    console.log(sessionStorage.getItem('cart'));
  }*/

  nextPage() {
    this.cards.nextOffSet(this.cardData.meta.next_page).subscribe((res) => {
      this.cardData = res;
      console.log(this.cardData);
    });
  }

  prevPage() {
    this.cards.nextOffSet(this.cardData.meta.previous_page).subscribe((res) => {
      this.cardData = res;
    });
  }

  Searchbar() {
    this.Searchform.get('Search')?.valueChanges.subscribe((input) => {
      if (input==null){input="";}
      this.cards.searchCard(input, this.type, this.Attribute, this.Race, this.Effect).subscribe((res) => {
        this.cardData = res;
        console.log(this.cardData);
        const options = input ? {params: new HttpParams().set('name', input)} : {};
      })
    })
  }

  products() {
    this.cards.getAllCards().subscribe((res) => {
      this.cardData = res;
    });
  }

  onChangetype(type: any) {
    console.log(type.target.value);
    if(type.target.value == 'Select Card Type'){
      this.type = '';
    }else{
      this.type = type.target.value;
    }
  }

  onChangeAttribute(Attribute: any) {
    console.log(Attribute.target.value);
    if(Attribute.target.value == 'Select Attribute'){
      this.Attribute = '';
      console.log(this.Attribute);
    }else{
      this.Attribute = Attribute.target.value;
    }
  }

  onChangeRace(Race: any) {
    console.log(Race.target.value);
    if(Race.target.value == 'Select Race'){
      this.Race == '';
    }else{
      this.Race = Race.target.value;
    }
  }

  onChangeEffect(Effect:any){
    console.log(Effect.target.value);
    if(Effect.target.value == 'Select Card Effect'){
      this.Effect = '';
    }else{
      this.Effect = Effect.target.value;
    }
  }

}
