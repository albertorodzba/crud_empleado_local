import { Pipe, PipeTransform } from '@angular/core';
import { Empleado } from '../schemas/empleado.interface';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(empleados: Empleado[], page: number = 0, id: number = 0, nombre: string = "", cargo: number = 0): Empleado[] | undefined{
    console.log("id", id, "nombre", nombre, cargo)
    if(empleados == undefined) return;
    console.log((id === 0 || id === null)  && nombre.trim() === "" && cargo == 0 )
    if ( (id === 0 || id === null)  && nombre.trim() === "" && cargo == 0 ){
      return empleados.slice(page, page + 5);
    }

    const result = empleados.filter((empleado) => {
      console.log( (cargo == 0 || empleado.cargo == cargo), (cargo == 0 || empleado.cargo == cargo), (nombre.trim() === "" || empleado.nombre.includes(nombre.trim())))
      return ((id === 0 || id=== null || empleado.id === id)
        && (cargo == 0 || empleado.cargo == cargo)
        && (nombre.trim() === "" || empleado.nombre.includes(nombre.trim())))
    }
    );
    if(result.length < 5) return result;
    return result.slice(page, page + 5);
  }


}
