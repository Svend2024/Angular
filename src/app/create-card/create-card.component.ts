import { Component, NgZone } from '@angular/core';
import { YugiohService } from '../services/yugioh.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../Interface/card';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css',
  providers: [YugiohService]
})
export class CreateCardComponent {
  constructor(private cards: YugiohService, private zone: NgZone, private route: ActivatedRoute, private router: Router,) { }

  createForm: FormGroup = new FormGroup({
    cardName: new FormControl(''),
    cardPictureLink: new FormControl(''),
    cardCode: new FormControl(''),
    cardSetNumber: new FormControl(''),
    cardSetName: new FormControl(''),
    cardStock: new FormControl(''),
    cardPrice: new FormControl(''),
  });

  card: Card = {
    cardname: '',
    cardpictureLink: '',
    cardattribute: '',
    cardtype: '',
    cardrace: '',
    cardcode: '',
    cardset:{
        cardsetCode: '',
        cardsetName: ''
    },
    cardstock: 0,
    cardprice: 0,
  }

  createCard(){

    this.card.cardname = this.createForm.get("cardName")!.value;
    this.card.cardpictureLink = this.createForm.get("cardPictureLink")!.value;
    this.card.cardcode = this.createForm.get("cardCode")!.value;
    this.card.cardset!.cardsetCode = this.createForm.get("cardSetNumber")!.value;
    this.card.cardset!.cardsetName = this.createForm.get("cardSetName")!.value;
    this.card.cardstock = this.createForm.get("cardStock")!.value;
    this.card.cardprice = this.createForm.get("cardPrice")!.value;
    
    let token = sessionStorage.getItem('token')
    
    this.cards.createCard(this.card.cardname, this.card.cardpictureLink, 
      this.card.cardattribute, this.card.cardtype, this.card.cardrace, this.card.cardcode, 
      this.card.cardset!.cardsetName, this.card.cardset!.cardsetCode, this.card.cardprice, this.card.cardstock, token).subscribe((res)=>{
        console.log(res)
    });
  }

  onChangeAttribute(Attribute: any) {
    console.log(Attribute.target.value);
    if (Attribute.target.value == 'Select Attribute') {
      this.card.cardattribute = '';
      console.log(this.card.cardattribute);
    } else {
      this.card.cardattribute = Attribute.target.value;
    }
  }

  onChangetype(type: any) {
    console.log(type.target.value);
    if (type.target.value == 'Select Card Type') {
      this.card.cardtype = '';
    } else {
      this.card.cardtype = type.target.value;
    }
  }

  onChangeRace(Race: any) {
    console.log(Race.target.value);
    if (Race.target.value == 'Select Race') {
      this.card.cardrace = '';
    } else {
      this.card.cardrace = Race.target.value;
    }
  }

}
