import { Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { YugiohService } from '../services/yugioh.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css',
  providers: [YugiohService]
})
export class DeckComponent implements OnInit {
  constructor(private cards: YugiohService, private zone: NgZone, private route: ActivatedRoute,
    private router: Router, private elementRef: ElementRef) { }

  deck: any[] = [];

  public cardData: any;
  public cart: any = [];
  type: string = "";
  Attribute: string = "";
  Race: string = "";
  currentPage = 1;
  pageSize = 8;
  isDispatched = false;

  inspectCard: string = "";

  public Searchform = new FormGroup({
    Search: new FormControl('')
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] || 1;
      this.products();
      this.search();
    });
    this.type = '';
    this.Attribute = "";
    this.Race = "";
  }

  addToDeck(event: MouseEvent, item: any): void {
    if (event.button === 0) {
      const index = this.deck.findIndex(deckItem => deckItem.item === item);
      if (index !== -1) {
        if (this.deck[index].amount < 3) {
          this.deck[index].amount++;
        }
      }
      else {
        this.deck.push({ item, amount: 1 });
      }
    }
  }

  openInspectModal(event: MouseEvent, item: any): boolean {
    event.preventDefault();
    if (event.button === 2) {
      const buttonElement = this.elementRef.nativeElement.querySelector('#Inspect');
      if (buttonElement && !this.isDispatched) {
        this.inspectCard = item.pictureLink;
        this.isDispatched = true;
        buttonElement.click();
        this.isDispatched = false;
      }
    }
    return false;
  }

  private navigateToPage(): void {
    const pageCount = Math.ceil(this.cardData.totalCount / this.pageSize);
    this.currentPage = Math.min(this.currentPage, pageCount);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
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

  products() {
    this.cards.getAllCards(this.currentPage, this.pageSize).subscribe((res) => {
      this.zone.run(() => {
        this.cardData = res;
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
      });
    });
  }

  search() {
    this.Searchform.get('Search')?.valueChanges.subscribe((input) => {
      this.cards.searchCard(input, this.type, this.Attribute, this.Race, this.currentPage, this.pageSize).subscribe((res) => {
        this.cardData = res;
        console.log(this.cardData);
      })
    })
  }

  getBackgroundColor(card: any): string {
    switch (card.item.type) {
      case 'Effect Monster':
      case 'Flip Effect Monster':
      case 'Gemini Monster':
      case 'Pendulum Flip Effect Monster':
      case 'Pendulum Effect Monster':
      case 'Pendulum Tuner Effect Monster':
      case 'Spirit Monster':
      case 'Toon Monster':
      case 'Tuner Monster':
      case 'Union Effect Monster':
        return '#d9964d'
      case 'Fusion Monster':
      case 'Pendulum Effect Fusion Monster':
        return '#843497'
      case 'Link Monster':
        return '#175188'
      case 'Normal Monster':
      case 'Normal Tuner Monster':
      case 'Pendulum Normal Monster':
        return '#caa560'
      case 'Ritual Monster':
      case 'Pendulum Effect Ritual Monster':
      case 'Ritual Effect Monster':
        return '#5d81bd'
      case 'Skill Card':
        return '#176aae'
      case 'Spell Card':
        return '#298e80'
      case 'Staple':
        return '#8c94af'
      case 'Synchro Monster':
      case 'Synchro Pendulum Effect Monster':
      case 'Synchro Tuner Monster':
        return '#e8e6e1'
      case 'Token':
        return '#8e8987'
      case 'Trap Card':
        return '#923672'
      case 'XYZ Monster':
      case 'XYZ Pendulum Effect Monster':
        return '#24272d'
      default:
        return 'transparent'
    }
  }

  removeFromDeck(event: MouseEvent, item: any): void {
    if (event.button === 0) {
      const index = this.deck.findIndex(deckItem => deckItem.item === item.item);
      if (index !== -1) {
        if (this.deck[index].amount > 0) {
          this.deck[index].amount--;
          if (this.deck[index].amount === 0) {
            this.deck.splice(index, 1);
          }
        }
      }
    }
  }

  openInspectModalDeck(event: MouseEvent, item: any): boolean {
    event.preventDefault();
    if (event.button === 2) {
      const buttonElement = this.elementRef.nativeElement.querySelector('#InspectDeck');
      if (buttonElement && !this.isDispatched) {
        this.inspectCard = item.item.pictureLink;
        this.isDispatched = true;
        buttonElement.click();
        this.isDispatched = false;
      }
    }
    return false;
  }
}