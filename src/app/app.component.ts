import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empleado } from './schemas/empleado.interface';
import { Observable } from 'rxjs';
import { Cargo } from './schemas/cargo.interface';
import { DataAlert } from './schemas/data-alert.interface';


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
  saved: DataAlert = {success: false, message: ""};
  visibleAlert: Boolean = false;
  actionModal: string = "" ;
  editarEmpleado!: Empleado ;

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

  changeStatus(empleadoId: number): void{
    const index = this.getIndex(empleadoId);
    this.empleados[index].activo = !this.empleados[index].activo;
  }

  // Evento disparado por el componente modal para cerrarse
  closeModal(valor: Boolean): void{
    // this.showModal = false;
    this.changeModalVisibility()
  }

  changeModalVisibility() : void{
    this.showModal = !this.showModal;
  }

  delete(empleadoId: number): void{
    const index = this.getIndex(empleadoId);
    this.empleados = this.empleados.filter((empleado) => empleado.id !== this.empleados[index].id)

  }

  changeEdad(empleadoId: number, nuevaEdad: string) : void{
    const index = this.getIndex(empleadoId);
    this.empleados[index].edad = parseInt(nuevaEdad, 10);
    this.showAlert(
      {
        success: true,
        message: "Edad actualizada correctamente"
      }
    )
  }

  /**
   * Devuelve la posicion del empleado en el arreglo de objetos
   */
  getIndex(empleadoId: number): number{
    return this.empleados.findIndex((empleado: Empleado) => empleado.id === empleadoId);
  }

  getPreviousPage(): void{
    if(this.page > 0)
    this.page -= 5;
  }

  getNextPage(): void{
    if (this.page < this.empleados.length-1) 
      this.page += 5;
    
  }

  nuevoEmpleado(empleado: Empleado): void {
    this.empleados.push(empleado);
  }

  editEmpleado(empleadoId: number): void{
    const index = this.getIndex(empleadoId);
    if(!this.empleados[index].activo){
      this.editarEmpleado = this.empleados.filter((empleado) => empleado.id === this.empleados[index].id)[0];
      this.actionModal = "edit";
      this.showModal = true;
      console.log(this.editarEmpleado);
    }else{
      this.showAlert(
        {
          success: false,
          message: "Para actualizar la información el trabajador debe de estar inactivo"
        }
        )
    }
  }

  // Cambia el valor a una cadena vacía para asegurar que se pueda agregar un nuevo empleado
  changeAction(value: string): void{
    this.actionModal = value;
  }

  showAlert(data: DataAlert): void{
    this.saved = data;
    this.visibleAlert = true;
    setTimeout(() => {
      this.visibleAlert = false;
    }, 4000);
  }

}
