import { FormControl, ValidationErrors } from '@angular/forms';

export class SpringValidators {
  // whitespace validation
  static notOnlyWhitespace(control: FormControl): ValidationErrors {
    // check for string only whitespace
    if (control.value !== null && control.value.trim().length === 0) {
      return { 'notOnlyWhitespace': true };
    }
    return null;
  }
}
