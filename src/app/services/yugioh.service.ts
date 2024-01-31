import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})

export class YugiohService {
  private urlAll : string = 'https://localhost:44361/api/Cards'
  
  constructor(private http:HttpClient) { }

  getAllCards(page: number, pageSize: number): Observable<any> {
    const url = `${this.urlAll}/paged?page=${page}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

  nextOffSet(nextPage : string){
    this.urlAll = nextPage;
    return this.http.get(`${this.urlAll}`, httpOptions);
  }

  prevOffSet(prevPage : string){
    this.urlAll = prevPage;
    return this.http.get(`${this.urlAll}`, httpOptions);
  }

  searchCard(cardSearch : string, type: any, Attribute: any, Race: any, Effect:any){
    let cardName = cardSearch;
    let emptyType : string = "";
    let emptyAttribute : string = "";
    let emptyRace : string = "";
    let emptyEffect : string = "";
    if(type != "" && type !="Select Card Type"){
      emptyType = `&type=${type}`;
    }
    if(type == "Select Card Type")
    {
      emptyType="";
    }
    if(Attribute != "" && Attribute !="Select Attributee"){
      emptyAttribute = `&attribute=${Attribute}`;
    }
    if(Attribute == "Select Attributee")
    {
      emptyAttribute="";
    }
    if(Race != "" && Race !="Select Race"){
      emptyRace = `&race=${Race}`;
    }
    if(Race == "Select Race")
    {
      emptyRace="";
    }
    if(Effect != "" && Effect !="Select Card Effect"){
      emptyEffect = `&effect=${Effect}`;
    }
    if(Effect == "Select Card Effect")
    {
      emptyEffect="";
    }
    let filterUrl : string = `https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=${cardName}${emptyType}${emptyAttribute}${emptyRace}${emptyEffect}&num=32&offset=0&view=List&misc=yes`
    return this.http.get(`${filterUrl}`, httpOptions);
  }

}
