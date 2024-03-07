import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empleado } from '../schemas/empleado.interface';
import { Cargo } from '../schemas/cargo.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  urlEmpleados: string = "/assets/empleados.json";
  urlCargos: string = "/assets/cargos.json";
  constructor(private _http: HttpClient) { 

  }

  getEmpleados(): Observable<Empleado[]> {
    return this._http.get<Empleado[]>(this.urlEmpleados);
  }

  getCargos(): Observable<Cargo[]> {
    return this._http.get<Cargo[]>(this.urlCargos);
  }
}
