import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empleado } from './schemas/empleado.interface';
import { Observable } from 'rxjs';
import { Cargo } from './schemas/cargo.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  urlEmpleados: string = "/assets/empleados.json";
  urlCargos: string = "/assets/cargos.json";
  empleados!: Empleado[];
  cargos!: Cargo[];
  page: number = 0;
  empleadoId: number = 0;
  nombre: string = "";
  cargo: number = 0;
  showModal: Boolean = false;

  constructor(private _http: HttpClient){

  }
  ngOnInit(){
    this.getEmpleados();
    this.getCargos();
  }

  getEmpleados(): void {
    this._http.get<Empleado[]>(this.urlEmpleados).subscribe({
      next: (result) => {
        this.empleados = result
      },
      error: (error) => {
        console.log(`Error => ${error.message.toString()}`);
        alert('Error al recuperar la informacion de los empleados');
      },
    });
  }

  getCargos(): void {
    this._http.get<Cargo[]>(this.urlCargos).subscribe({
      next: (result) => {
        this.cargos = result;

      },
      error: (error) => {
        console.log(`Error => ${error.message.toString()}`);
        alert('Error al recuperar la informacion de los cargos');
      },
    });
  }

  changeStatus(empleadoId: number){
    const index = this.getIndex(empleadoId);
    this.empleados[index].activo = !this.empleados[index].activo;
  }

  closeModal(valor: Boolean){
    this.showModal = valor;
  }

  modalState() {
    this.showModal = !this.showModal;
  }

  delete(empleadoId: number){

  }

  getIndex(empleadoId: number): number{
    return this.empleados.findIndex((empleado: Empleado) => empleado.id === empleadoId);
  }

  getPreviousPage(){
    if(this.page > 0)
    this.page -= 5;
  }

  getNextPage(){
    if (this.page < this.empleados.length-1)
    {
      this.page += 5;
    }
  }

  nuevoEmpleado(empleado: Empleado) {
    this.empleados.push(empleado);
  }

}
