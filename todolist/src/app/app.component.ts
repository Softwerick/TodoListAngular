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
  listatemporaria = "";

  list = {} as Lists;
  lists: Lists[];
  task = {} as Tasks;
  tasks: Tasks[];


  lista: Lists[];
  tarefa: Tasks[];

  constructor(private listService: ListsService, private tasksService: TasksService, private changeRef: ChangeDetectorRef) {
    this.lists = [];
    this.tasks = [];
    this.lista = [];
    this.tarefa = [];
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
    //Antes de adicionar, o ChangeDetector, o sistema salvava uma lista nova, sem título nenhum
    this.changeRef.detectChanges();
    this.listService.saveList(this.list).subscribe(() => {
      this.cleanForm(form);
    });
  }

  //Para salvar uma task, primeiro eu transformo o valor pego no html para string e coloco ele dentro da variável lista temporaria.
  //Após isso, utilizo o serviço para pegar a lista que foi selecionada no html. Com a lista em mãos, coloco ela dentro da variável lista para conseguir utilizá-la.
  //Com isso feito, guardo o id da lista buscada dentro de task e por último, chamo o serviço de salvar a task.
  saveTask(form: NgForm){
    this.listatemporaria = this.task.listId.toString();
    this.listService.getListByTitle(this.listatemporaria).subscribe((list: Lists[]) => {
      this.lista = list;
      this.task.listId = this.lista[0].id;
      this.tasksService.saveTask(this.task).subscribe(() => {
        this.cleanForm(form);
      })
    })    
  }


  //Antes de deletar a lista, checo todas as tasks que tem o listId dela. Então, deleto todas as tasks que tenham esse listId
  //Após deletar as tasks, só então a lista é deletada
  deleteList(list: Lists) {
    this.tasksService.getTaskById(list.id).subscribe((task: Tasks[]) => {
      this.tarefa = task;
      for(var i = 0; i < this.tarefa.length; ++i){
        this.tasksService.deleteTask(this.tarefa[i]).subscribe(() => {
          this.getTasks();
        })
      }
    })
    this.listService.deleteList(list).subscribe(() => {
      this.getLists();
    });
  }
  

  cleanForm(form: NgForm) {
    this.getLists();
    this.getTasks();
    form.resetForm();
    this.list = {} as Lists;
    this.task = {} as Tasks;
  }
}
