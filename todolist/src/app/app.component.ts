import { Component, OnInit } from '@angular/core';
import { ListsService } from './services/lists.service';
import { Lists } from './models/lists';
import { TasksService } from './services/tasks.service';
import { Tasks } from './models/tasks';
import { NgForm } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todolist';

  list = {} as Lists;
  lists: Lists[];
  task = {} as Tasks;
  tasks: Tasks[];

  constructor(private listService: ListsService, private tasksService: TasksService, private changeRef: ChangeDetectorRef) {
    this.lists = [];
    this.tasks = [];
  }

  ngOnInit() {
    this.getLists();
    this.getTasks();
  }

  getLists() {
    this.listService.getLists().subscribe((lists: Lists[]) => {
      this.lists = lists;
    });
  }
  getTasks() {
    this.tasksService.getTasks().subscribe((tasks: Tasks[]) => {
      this.tasks = tasks;
    });
  }

  //Salva uma nova lista e limpa o form, além de buscar novamente todas as listas
  saveList(form: NgForm){
    //Antes de adicionar o ChangeDetector, o sistema salvava uma lista nova, sem título nenhum
    this.changeRef.detectChanges();
    this.listService.saveList(this.list).subscribe(() => {
      this.cleanForm(form);
    });
  }

  deleteList(list: Lists) {
    this.listService.deleteList(list).subscribe(() => {
      this.getLists();
    });
  }

  cleanForm(form: NgForm) {
    this.getLists();
    form.resetForm();
    this.list = {} as Lists;
  }
}
