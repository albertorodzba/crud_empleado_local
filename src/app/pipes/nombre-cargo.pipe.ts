import { Pipe, PipeTransform } from '@angular/core';
import { Cargo } from '../schemas/cargo.interface';

@Pipe({
  name: 'nombreCargo'
})
export class CargoNombrePipe implements PipeTransform {

  transform(cargoId: number, cargos: Cargo[]): string {
    if (cargos!= undefined){
      const cargo: Cargo[] = cargos.filter((i) => i.id === cargoId);
      return cargo[0].cargo;
    }
    return "";
  }

}
