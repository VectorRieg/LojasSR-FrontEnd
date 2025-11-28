import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined) return 'R$ 0,00';

    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
}
