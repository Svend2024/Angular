import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { YugiohService } from '../services/yugioh.service';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
  providers: [YugiohService]
})

export class StoreComponent implements OnInit {
  constructor(private cards: YugiohService, private zone: NgZone, private route: ActivatedRoute, private router: Router,) { }
  public cardData: any;
  public cart: any = [];
  holder: any;
  type: string = "";
  Attribute: string = "";
  Race: string = "";
  token: any = "";
  Price: number = 0
  Stock: number = 0
  Id: number = 0
  Set: string = ""
  currentPage = 1;
  pageSize = 8; //items per page
  inspectCard: any = [];
  isProductManager: boolean = true;

  public Searchform = new FormGroup({
    Search: new FormControl('')
  })

  EditForm: FormGroup = new FormGroup({
    cardID: new FormControl(''),
    cardName: new FormControl(''),
    cardPicturelink: new FormControl(''),
    cardAttribute: new FormControl(''),
    cardType: new FormControl(''),
    cardRace: new FormControl(''),
    cardSet: new FormControl(''),
    cardStock: new FormControl(''),
    cardPrice: new FormControl(''),
  });


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
      this.currentPage = params['page'] || 1;
      console.log('Current Page:', this.currentPage);
      this.Searchform.get('Search')?.setValue(params['search'] || ''); // Set search term from URL
      this.type = params['type'] || ''; // Set type from URL
      this.Attribute = params['attribute'] || ''; // Set Attribute from URL
      this.Race = params['race'] || ''; // Set Race from URL
      this.search();
      console.log(this.currentPage);
      this.cart = JSON.parse(sessionStorage['cart']);
      console.log(this.cart);
       // Apply filters based on URL parameters
    });
    this.filtercards();
    this.type = "";
    this.Attribute = "";
    this.Race = "";
    if(sessionStorage.getItem('role') === "ProductManager"){
      this.isProductManager = true;
    }
  }

  private navigateToPage(): void {
    const pageCount = Math.ceil(this.cardData.totalCount / this.pageSize);

    // Ensure the currentPage does not exceed the calculated pageCount
    this.currentPage = Math.min(this.currentPage, pageCount);

    // Use queryParams to append parameters to the URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        page: this.currentPage, 
        search: this.Searchform.get('Search')?.value,
        type: this.type,
        attribute: this.Attribute,
        race: this.Race
      },
      queryParamsHandling: 'merge',
    });
  }

  openInspectModal(item: any) {
    this.inspectCard = item;
    this.EditForm.controls["cardID"].setValue(this.inspectCard.id)
    this.EditForm.controls["cardName"].setValue(this.inspectCard.name)
    this.EditForm.controls["cardPicturelink"].setValue(this.inspectCard.pictureLink)
    this.EditForm.controls["cardAttribute"].setValue(this.inspectCard.attribute)
    this.EditForm.controls["cardType"].setValue(this.inspectCard.type)
    this.EditForm.controls["cardRace"].setValue(this.inspectCard.race)
    this.EditForm.controls["cardSet"].setValue(this.inspectCard.cardCode)
    this.EditForm.controls["cardStock"].setValue(this.inspectCard.stock)
    this.EditForm.controls["cardPrice"].setValue(this.inspectCard.price)
  }

  onChangetype(type: any) {
    console.log(type.target.value);
    if (type.target.value == 'Select Card Type') {
      this.type = '';
    } else {
      this.type = type.target.value;
    }
  }

  onChangeAttribute(Attribute: any) {
    console.log(Attribute.target.value);
    if (Attribute.target.value == 'Select Attribute') {
      this.Attribute = '';
      console.log(this.Attribute);
    } else {
      this.Attribute = Attribute.target.value;
    }
  }

  onChangeRace(Race: any) {
    console.log(Race.target.value);
    if (Race.target.value == 'Select Race') {
      this.Race = '';
    } else {
      this.Race = Race.target.value;
    }
  }

  addToCart(item: any) {
    this.cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    let recurring = this.cart.find((data: any) => data.item.id == item.id);

    if (recurring != null) {
      recurring.amount++;
    }
    else {
      this.cart.push({ item, amount: 1 });
    }
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  }

  nextPage(): void {
    console.log('Next page clicked');
    this.currentPage++;
    this.navigateToPage();
    console.log('Next page:', this.currentPage);
  }

  prevPage(): void {
    console.log(this.currentPage)
    if (this.currentPage > 1) {
      console.log('Previous page clicked');
      this.currentPage--;
      this.navigateToPage();
      console.log('Previous page:', this.currentPage);
    }
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.cardData.totalCount / this.pageSize);
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

  filtercards() {
    this.cards.filteredCards(this.type, this.Attribute, this.Race, this.currentPage, this.pageSize).subscribe(res => {
      this.zone.run(() => {
        this.cardData = res;
        console.log('Fetched products:', this.cardData);
        console.log(this.currentPage);
        if (this.cardData.totalCount == 0) {
          this.currentPage = 1;
          console.log(this.currentPage);
        }
        this.navigateToPage();
      });
    });
  }

  search() {
    this.Searchform.get('Search')?.valueChanges.pipe(
      debounceTime(200), // hvor lang tid der skal gå før at søgningen skal ske.
      distinctUntilChanged() // ignorer hvis værdi er uændret.
    ).subscribe((input) => {
      this.cards.searchCard(input, this.type, this.Attribute, this.Race, this.currentPage, this.pageSize).subscribe((res) => {
        if (this.cardData.totalCount === 0) {
          this.currentPage = 1;
          console.log(this.currentPage);
        }
        this.cardData = res;
        console.log(this.cardData);
        this.navigateToPage();
      });
    })
  }

  deleteCard(){
    if(sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
      this.Id = this.EditForm.get("cardID")!.value;
      this.cards.deleteCard(this.Id, this.token).subscribe((res)=>{
        console.log(res)
      });
    }
  }

  updateCard(){
    if(sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token');
      this.Id = this.EditForm.get("cardID")!.value;
      let name = this.EditForm.get("cardName")!.value;
      let pictureLink = this.EditForm.get("cardPicturelink")!.value;
      this.Attribute = this.EditForm.get("cardAttribute")!.value;
      this.Set = this.EditForm.get("cardSet")!.value;
      this.type = this.EditForm.get("cardType")!.value;
      this.Race = this.EditForm.get("cardRace")!.value;
      this.Stock = this.EditForm.get("cardStock")!.value;
      this.Price = this.EditForm.get("cardPrice")!.value;
      this.cards.updateCard(this.Id, name, pictureLink, this.Attribute, this.type, this.Race, this.Stock, this.Set, this.Price, this.token).subscribe((res)=>{
        console.log(res)
      });
    }
  }

}
