import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit,Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cargo } from 'src/app/schemas/cargo.interface';
import { DataAlert } from 'src/app/schemas/data-alert.interface';
import { Empleado } from 'src/app/schemas/empleado.interface';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewInit {

  urlCargos: string = "/assets/cargos.json";
  cargos: any;
  initialDate: string = new Date().toISOString().slice(0, 10).toString();
  lastId: number = 0;
  saved!: Response;
  visibleAlert: Boolean = false;
  @Input() action: string = "";
  @Input() showModal: Boolean = false;
  @Input() empleados!: Empleado[];
  @Input() editarEmpleado!: Empleado;
  @Output() modalStateEvent = new EventEmitter<Boolean>();
  @Output() addEmpleado = new EventEmitter<Empleado>();
  @Output() showAlert = new EventEmitter<DataAlert>();
  @Output() changeAction = new EventEmitter<string>();

  public empleadoForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    fechaNacimiento: new FormControl(this.initialDate, [Validators.required]),
    edad: new FormControl(0, [Validators.required, Validators.min(18)]),
    cargo: new FormControl(0, [Validators.required, Validators.min(1)]),
    activo: new FormControl(true as boolean, null),
  })

  constructor(private _http: HttpClient){}
  ngOnInit(){
    this.getCargos();
  }

  ngAfterViewInit(): void {
    console.log("action from modal", this.action)
    if(this.action === "edit") {
      console.log("modal value", this.editarEmpleado)
      const { nombre, fechaNacimiento, edad, cargo, activo } = this.editarEmpleado;
      this.empleadoForm.patchValue({
        nombre,
        fechaNacimiento,
        edad,
        cargo,
        activo
      })
    }
  }

  getCargos(): void {
    this._http.get<Cargo>(this.urlCargos).subscribe({
      next: (result) => {
        this.cargos = result;

      },
      error: (error) => {
        console.log(`Error => ${error.message.toString()}`);
        alert('Error al recuperar la informacion de los cargos');
      },
    });
  }

  /**
   * Dado que es local, se obtiene el ultimo ID para poder saber cual sera el siguiente
   */
  getLastId(): void{
    this.lastId = this.empleados[this.empleados.length - 1].id;
    console.log("form", this.empleadoForm.value);
    console.log("empleados", this.empleados[this.empleados.length-1].id)
    console.log("this.lastId", this.lastId);
  }

  save(): void {
    if(this.empleadoForm.valid){
      const { 
        nombre, 
        edad,
        fechaNacimiento,
        cargo,
        activo
      } = this.empleadoForm.value;

      this.getLastId()

      const empleado: Empleado = {
        id: this.lastId + 1 , 
        nombre, edad: parseInt(edad, 10), 
        fechaNacimiento, 
        cargo: parseInt(cargo, 10), 
        activo: Boolean(activo)
      };
      
      this.addEmpleado.emit(empleado);
      this.empleadoForm.reset({name: null, fechaNacimiento: this.initialDate, edad: 0 , cargo: 0 , activo: true});
      this.closeModal();
      this.showAlert.emit(
        {
          success: true,
          message: `Empleado guardado con exito con el ID ${this.lastId + 1}`,
        }
      )
      // Despues de editar, se manda el valor de la accion a vacio para que se pueda usar este modal para agregar un nuevo empleado
      if (this.action === "edit") {
        this.changeAction.emit("");
      }
    }
    else{
      this.showAlert.emit(
        {
          success: false,
          message: "Los campos del formulario son obligatorios",
        }
      )
    }
  }

  closeModal(): void {
    this.showModal = !this.showModal;
    this.modalStateEvent.emit(this.showModal);
    this.empleadoForm.reset({name: null, fechaNacimiento: this.initialDate, edad: 0 , cargo: 0, activo: true});
  }

  isValid(value: string) : Boolean | null {
    return this.empleadoForm.controls[value].errors && this.empleadoForm.controls[value].touched
  }

  getFieldError(value: string): string {
    const errors =  this.empleadoForm.controls[value].errors || {};
    for (const key of Object.keys(errors)){
      switch( key ){
        case "required":
          return "El campo es requerido";
        case "min":
          return "Valor invalido"
      }
    }
    return "";
  }
}
