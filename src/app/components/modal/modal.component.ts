import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cargo } from 'src/app/schemas/cargo.interface';
import { Empleado } from 'src/app/schemas/empleado.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  urlCargos: string = "/assets/cargos.json";
  cargos: any;
  initialDate: string = new Date().toISOString().slice(0, 10).split("-").reverse().join("/").toString();
  lastId: number = 0;
  @Input() showModal: Boolean = false;
  @Input() empleados!: Empleado[];
  @Output() modalStateEvent = new EventEmitter<Boolean>();
  @Output() addEmpleado = new EventEmitter<Empleado>();

  public empleadoForm: FormGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    fechaNacimiento: new FormControl(Date.now, [Validators.required]),
    edad: new FormControl(0 as number, [Validators.required, Validators.min(18)]),
    cargo: new FormControl(0 as number, [Validators.required, Validators.min(1)]),
    estatus: new FormControl(true as boolean, null),
  })

  constructor(private _http: HttpClient){}
  ngOnInit(){
    this.getCargos();
    this.getLastId();
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

  getLastId(){
    this.lastId = this.empleados[this.empleados.length - 1].id;
    console.log("form", this.empleadoForm.value);
    console.log("empleados", this.empleados[this.empleados.length-1].id)
    console.log("this.lastId", this.lastId);
  }

  save(): void {
    if(this.empleadoForm.valid){
      this.getLastId()
      const empleado: Empleado = {id: this.lastId + 1 , ...this.empleadoForm.value};

      this.addEmpleado.emit(empleado);
      this.empleadoForm.reset();
      this.cancel();
    }
    else{
      alert("Llene todos los campos");
    }
  }

  cancel(): void {
    this.showModal = !this.showModal;
    this.modalStateEvent.emit(this.showModal);
    this.empleadoForm.reset({name: null, fechaNacimiento: Date.now, edad: 0 as number, cargo: 0 as number, estatus: true as Boolean});
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
