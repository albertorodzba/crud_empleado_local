import { Pipe, PipeTransform } from '@angular/core';
import { Cargo } from '../schemas/cargo.interface';

@Pipe({
  name: 'cargoNombre'
})
export class CargoNombrePipe implements PipeTransform {

  transform(cargoId: number, cargos: Cargo[]): string {
    const cargo: Cargo[] = cargos.filter((i) => i.id === cargoId);
    return cargo[0].cargo;
  }

}
