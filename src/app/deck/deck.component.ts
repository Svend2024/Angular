import { Component, NgZone, OnInit } from '@angular/core';
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
  providers: [ YugiohService ]
})
export class DeckComponent implements OnInit{
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
  });
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] || 1;
      this.products();
    });
    this.type = '';
    this.Attribute = "";
    this.Race = "";
    this.Effect = "";
  }

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

  products() {
    this.cards.getAllCards(this.currentPage, this.pageSize).subscribe((res) => {
      this.zone.run(() => {
        this.cardData = res;
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
}