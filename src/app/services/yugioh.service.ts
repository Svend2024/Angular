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
    const url = `${this.urlAll}/FilterSearch?page=${page}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

  searchCard(cardSearch : any, type: any, Attribute: any, Race: any, page: number, pageSize: number){
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
    let filterUrl : string = `${this.urlAll}/FilterSearch?searchTerm=${cardName}${emptyType}${emptyAttribute}${emptyRace}${emptyEffect}&page=${page}&pageSize=${pageSize}`
    return this.http.get(`${filterUrl}`, httpOptions);
  }

  filteredCards(type: any, Attribute: any, Race: any, page: number, pageSize: number){
    let emptyType : string = "";
    let emptyAttribute : string = "";
    let emptyRace : string = "";
    if(type != "" && type != "Select Card Type"){
      emptyType = `&type=${type}`;
    }
    if(type == "Select Card Type")
    {
      emptyType="";
    }
    if(Attribute != "" && Attribute != "Select Attributee"){
      emptyAttribute = `&attribute=${Attribute}`;
    }
    if(Attribute == "Select Attributee")
    {
      emptyAttribute="";
    }
    if(Race != "" && Race != "Select Race"){
      emptyRace = `&race=${Race}`;
    }
    if(Race == "Select Race")
    {
      emptyRace="";
    }
    let filterUrl : string = `${this.urlAll}/FilterSearch?searchTerm=${emptyType}${emptyAttribute}${emptyRace}&page=${page}&pageSize=${pageSize}`
    console.log(filterUrl)
    return this.http.get(`${filterUrl}`, httpOptions);
  }

}
