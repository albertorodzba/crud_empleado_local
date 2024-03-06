import { Pipe, PipeTransform } from '@angular/core';
import { Empleado } from '../schemas/empleado.interface';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(empleados: Empleado[], page: number, id: number, nombre: string, cargo: number): Empleado[] {
    return empleados.slice(page, page + 10);
  }

}
