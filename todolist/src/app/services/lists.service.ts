import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lists } from '../models/lists';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  url = 'http://localhost:3000/lists'; //url para pegar todas as listas presentes no Json Server

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getLists(): Observable<Lists[]> {
    return this.httpClient.get<Lists[]>(this.url)
  }
  getListByTitle(title: string): Observable<Lists[]> {
    return this.httpClient.get<Lists[]>(this.url + '?q=' + title)
  }

  saveList(list: Lists): Observable<Lists> {
    return this.httpClient.post<Lists>(this.url, JSON.stringify(list), this.httpOptions)  
  }

  deleteList(list: Lists) {
    return this.httpClient.delete<Lists>(this.url + '/' + list.id, this.httpOptions)
  }

}
