import { Component, OnInit } from '@angular/core';
import { YugiohService } from '../services/yugioh.service';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
  providers: [ YugiohService ]
})

export class StoreComponent implements OnInit{
  constructor(private cards: YugiohService, private zone: NgZone, private route: ActivatedRoute, private router: Router,) { }
  public cardData: any;
  public cart: any = [];
  holder: any;
  type: string="";
  Attribute: string="";
  Race: string="";
  Effect: string="";
  currentPage = 1;
  pageSize = 8; //items per page
  
  public Searchform = new FormGroup({
    Search: new FormControl('')
  })


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
      this.currentPage = params['page'] || 1;
      console.log('Current Page:', this.currentPage);
      this.products();
      this.search();
    });
    this.type = '';
    this.Attribute = "";
    this.Race = "";
    //this.holder = JSON.parse(sessionStorage['cart']);
    //console.log(this.holder[0]);

    /*for (let index = 0; index < this.holder.length; index++) {
      const element = this.holder[index];
      this.cart.push({
        id: Number(element.id),
        name: String(element.name),
        smallImg: String(element.smallImg),
        cardPrice: String(element.cardPrice),
        amount: Number(element.amount)
      });
    }
    console.log(this.cart);*/

  }

  private navigateToPage(): void {
    const pageCount = Math.ceil(this.cardData.length / this.pageSize);
  
    // Ensure the currentPage does not exceed the calculated pageCount
    this.currentPage = Math.min(this.currentPage, pageCount);
  
    // Use queryParams to append parameters to the URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
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

  products() {
    this.cards.getAllCards(this.currentPage, this.pageSize).subscribe((res) => {
      this.zone.run(() => {
        this.cardData = res.searchedEnities;
        console.log('Fetched products:', this.cardData);
      });
    });
  }
  
  nextPage(): void {
    console.log('Next page clicked');
    this.currentPage++;
    this.navigateToPage();
    console.log('Next page:', this.currentPage);
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      console.log('Previous page clicked');
      this.currentPage--;
      this.navigateToPage();
      console.log('Previous page:', this.currentPage);
    }
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.cardData.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  
  goToPage(page: number): void {
    console.log('Go to page:', page);
    const pageCount = Math.ceil(this.cardData.totalCount / this.pageSize);
    if (page >= 1 && page <= pageCount) {
      this.currentPage = page;
      console.log('New Page:', this.currentPage);
      this.navigateToPage();
    }
  }

  filtercards(){
    this.cards.filteredCards(this.type, this.Attribute, this.Race, this.currentPage, this.pageSize).subscribe(res =>{
      this.zone.run(() => {
        this.cardData = res;
        this.cardData = this.cardData.searchedEnities
        console.log('Fetched products:', this.cardData);
      });
    });
  }

  search(){
    this.Searchform.get('Search')?.valueChanges.subscribe((input) => {
      this.cards.searchCard(input, this.type, this.Attribute, this.Race, this.currentPage, this.pageSize).subscribe((res) => {
        this.cardData = res;
        this.cardData = this.cardData.searchedEnities
        console.log(this.cardData);
      })
    })
  }

}
