import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasks } from '../models/tasks';


@Injectable({
  providedIn: 'root'
})
export class TasksService {
  url = 'http://localhost:3000/tasks'; //url para pegar todas as tarefas presentes no Json Server

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getTasks(): Observable<Tasks[]> {
    return this.httpClient.get<Tasks[]>(this.url)
  }
  getListById(id: number): Observable<Tasks> {
    return this.httpClient.get<Tasks>(this.url + '/' + id)
  }
}