import { Pipe, PipeTransform } from '@angular/core';
import { Empleado } from '../schemas/empleado.interface';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(empleados: Empleado[], page: number = 0, id: number = 0, nombre: string = "", cargo: number = 0): Empleado[] {
    if ( (id === 0 || id === null)  && nombre.trim() === "" && cargo == 0){
      return empleados.slice(page, page + 5);
    }
    const result = empleados.filter((empleado) => {
      return ((id === 0 || id=== null || empleado.id === id)
        && (cargo == 0 || empleado.cargo == cargo)
        && (nombre.trim() === "" || empleado.nombre.includes(nombre)))
    }
    );
    return result.slice(page, page + 5);
  }


}
