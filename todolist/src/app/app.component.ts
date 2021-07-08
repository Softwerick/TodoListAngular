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

  saveList(form: NgForm){
    this.changeRef.detectChanges();
    this.listService.saveList(this.list).subscribe(() => {
      this.cleanForm(form);
    });
  }


  cleanForm(form: NgForm) {
    this.getLists();
    form.resetForm();
    this.list = {} as Lists;
  }
}
