import { LOCALE_ID, Provider } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export const DECIMAL_FORMAT_DEFAULT: Provider = {
  provide: DecimalPipe,
  useFactory: (locale: string) => new DecimalPipe(locale),
  deps: [LOCALE_ID],
};
