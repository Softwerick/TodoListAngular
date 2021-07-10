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


  //Diferentemente de getLists, aqui em getTasks eu tenho que mudar css e propriedades html caso a tarefa já tenha sido marcada como feita
  //Para isso, toda vez que a página é recarregada ou uma mudança é feita para adicionar uma tarefa, todas as tarefas são checadas para que elas se mantenham com o estilo de "feita"
  getTasks() {
    this.tasksService.getTasks().subscribe((tasks: Tasks[]) => {
      this.tasks = tasks;
      this.changeRef.detectChanges();

      for(var i = 0; i < this.tasks.length; ++i){
        const label = document.getElementById("label" + tasks[i].id);
        const checkbox = document.getElementById("checkbox" + tasks[i].id);

        if(tasks[i].checked == true){
          label!.style.color = 'green';
          checkbox!.setAttribute("checked", "checked");
        }
        else{
          label!.style.color = 'black';
        }
      }
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
      this.task.checked = false;
      this.tasksService.saveTask(this.task).subscribe(() => {
        this.cleanForm(form);
      })
    })    
  }

  //Aqui o atributo checked de task é mudado para que possamos saber qual tarefa já foi marcada como feita ou não.
  //Após isso, é chamado o método updateTask para modificar a tarefa
  taskDone(task: Tasks){
    task.checked == false ? task.checked = true : task.checked = false;

    this.tasksService.updateTask(task).subscribe(() => {
      this.getTasks();
    });
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

  deleteTask(task: Tasks){
    this.tasksService.deleteTask(task).subscribe(() => {
      this.getTasks();
    })
  }
  

  cleanForm(form: NgForm) {
    this.getLists();
    this.getTasks();
    form.resetForm();
    this.list = {} as Lists;
    this.task = {} as Tasks;
  }
}
