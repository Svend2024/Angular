import { Component, ElementRef, NgZone, OnInit, Renderer2, HostListener } from '@angular/core';
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
  constructor(private cards: YugiohService, private zone: NgZone, private route: ActivatedRoute, private router: Router, private renderer: Renderer2, private elementRef: ElementRef) { }
  public cardData: any;
  public cart: any = [];
  type: string = "";
  Attribute: string = "";
  Race: string = "";
  Effect: string = "";
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
    });
    this.type = '';
    this.Attribute = "";
    this.Race = "";
  }

  addToDeck(event: MouseEvent, item: any): void {
    if(event.which === 1 || event.button === 0) {
      console.log("left click!")
    }
  }

  openInspectModal(event: MouseEvent, item: any): boolean {
    event.preventDefault();
    if (event.which === 3 || event.button === 2) {
      const buttonElement = this.elementRef.nativeElement.querySelector('.btn-secondary');
      if (buttonElement && !this.isDispatched) {
        console.log("right click!")
        this.inspectCard = item.pictureLink;
        this.isDispatched = true;
        buttonElement.click();
        this.isDispatched = false;

        // const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        // buttonElement.dispatchEvent(clickEvent);

        // const modalElement = document.getElementById('deckinspectmodal');
        // if (modalElement) {
        //   this.isDispatched = false;
        // }
      }
    }
    return false;
  }

  // contextMenu(event: MouseEvent): boolean {
  //   event.preventDefault();
  //   const isRightClick = event.which === 3 || event.button === 2;
  //   if (isRightClick) {
  //     event.preventDefault();
  //     const modalElement = document.getElementById('deckinspectmodal');
  //     if (modalElement && !this.isDispatched) {
  //       console.log("right click!")
  //       this.isDispatched = true;
  //       modalElement.classList.add('show'); // viser modalen
  //       modalElement.style.display = 'block'; // viser modalen        

  //       const backdropElement = document.getElementsByClassName('modal-backdrop')[0] as HTMLElement;
  //       if (backdropElement) {
  //         backdropElement.style.display = 'block'; // viser modalens baggrund
  //       }
  //       this.isDispatched = false;
  //     }
  //   }
  //   return false;
  // }
  
  private navigateToPage(): void {
    const pageCount = Math.ceil(this.cardData.totalCount / this.pageSize);

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
      this.Race == '';
    } else {
      this.Race = Race.target.value;
    }
  }

  products() {
    this.cards.getAllCards(this.currentPage, this.pageSize).subscribe((res) => {
      this.zone.run(() => {
        this.cardData = res.pagedEntities;
        console.log('Fetched products:', this.cardData);
      });
    });
  }
  
  nextPage(): void {
    this.currentPage++;
    this.navigateToPage();
    console.log('Next page:', this.currentPage);
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
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
    const pageCount = Math.ceil(this.cardData.totalCount / this.pageSize);
  
    if (page >= 1 && page <= pageCount) {
      this.currentPage = page;
      this.navigateToPage();
      console.log('Go to page:', this.currentPage);
    }
  }

  filtercards(){
    this.cards.filteredCards(this.type, this.Attribute, this.Race, this.currentPage, this.pageSize).subscribe(res =>{
      this.zone.run(() => {
        this.cardData = res;
        this.cardData = this.cardData.pagedFilteredEntities
        console.log('Fetched products:', this.cardData);
      });
    });
  }
}