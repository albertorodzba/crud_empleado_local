import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { Cargo } from 'src/app/schemas/cargo.interface';
import { DataAlert } from 'src/app/schemas/data-alert.interface';
import { Empleado } from 'src/app/schemas/empleado.interface';
import { HttpRequestService } from 'src/app/services/httpRequest.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnChanges {

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
  @Output() actualizar = new EventEmitter<Empleado>();

  public empleadoForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    fechaNacimiento: new FormControl(this.initialDate, [Validators.required]),
    edad: new FormControl(0, [Validators.required, Validators.min(18)]),
    cargo: new FormControl(0, [Validators.required, Validators.min(1)]),
    activo: new FormControl(true as boolean, null),
  })

  constructor(private _http: HttpClient, private _requestService: HttpRequestService){}
  
  ngOnInit(){
    this.getCargos();

  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentAction = changes['action'] ? changes['action'].currentValue : "";
    if( currentAction === "edit") {
      const { nombre, fechaNacimiento, edad, cargo, activo } = this.editarEmpleado;
      this.empleadoForm.patchValue({
        nombre,
        fechaNacimiento: new Date(fechaNacimiento).toISOString().slice(0,10).toString(),
        edad: edad.toString(),
        cargo,
        activo: Boolean(activo)
      })
    }
  }

  getCargos(): void {
    this._requestService.getCargos().subscribe({
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
  }

  save(): void {
    if(this.empleadoForm.valid && this.action !== "edit"){
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
        nombre, 
        edad: parseInt(edad, 10), 
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
    }

    /**Si se editará se realiza lo siguiente */
    if(this.empleadoForm.valid && this.action === "edit"){
      this.update();
      
    }
  }
  
  /**
   * Actualiza a un solo empleado a la vez en la lista de empleados
  */
update() : void {
  const { 
    nombre, 
    edad,
    fechaNacimiento,
    cargo,
    activo
    } = this.empleadoForm.value;
  
    const empleado: Empleado = {
      id: this.editarEmpleado.id , 
      nombre, 
      edad: parseInt(edad, 10), 
      fechaNacimiento, 
      cargo: parseInt(cargo, 10), 
      activo: Boolean(activo)
    };
    
    this.actualizar.emit(empleado);

    // Se resetean los campos
    this.empleadoForm.reset({name: null, fechaNacimiento: this.initialDate, edad: 0 , cargo: 0 , activo: true});
      this.closeModal();
      this.showAlert.emit(
        {
          success: true,
          message: `Empleado con el ID = ${this.editarEmpleado.id} actualizado con exito `,
        }
      )
  }

  closeModal(): void {
    this.showModal = !this.showModal;
    this.modalStateEvent.emit(this.showModal);
    // Despues de editar o guardar, se manda el valor de la accion a vacio para que se pueda usar este modal para hacer la siguiente accion
    this.changeAction.emit("");
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

  getIndex(empleadoId: number): number{
    return this.empleados.findIndex((empleado: Empleado) => empleado.id === empleadoId);
  }

}
