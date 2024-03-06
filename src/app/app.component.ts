import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empleado } from './schemas/empleado.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  url: string = "/assets/empleados.json";
  empleados: any;
  page: number = 0;

  constructor(private _http: HttpClient){

  }
  ngOnInit(){
    this.getEmpleados();
  }

  getEmpleados(): void {
    this._http.get<Empleado>(this.url).subscribe({
      next: (result) => {
        this.empleados = result;
        console.log("Empleados = ", result); 
      },
      error: (error) => {
        console.log(`Error => ${error.message.toString()}`);
        alert('Error al recuperar la informacion de los empleados');
      },
    });
  }

  getNextPage(){
    if (this.page <= this.empleados.length)
    { 
      this.page += 6; 
      console.log("page",this.page)
    }
    
  }
  getPreviousPage(){
    if(this.page > 0)
      this.page -= 6;
  }


}
