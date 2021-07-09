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
  getTaskById(id: number): Observable<Tasks[]> {
    return this.httpClient.get<Tasks[]>(this.url + '?listId=' + id)
  }

  saveTask(task: Tasks): Observable<Tasks> {
    return this.httpClient.post<Tasks>(this.url, JSON.stringify(task), this.httpOptions)  
  }

  deleteTask(task: Tasks) {
    return this.httpClient.delete<Tasks>(this.url + '/' + task.id, this.httpOptions)
  }
}
