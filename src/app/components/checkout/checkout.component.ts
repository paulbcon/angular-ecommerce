import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { SpriNGShopFormService } from 'src/app/services/spri-ngshop-form.service';
import { SpringValidators } from 'src/app/validators/spring-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private spriNGShopFormService: SpriNGShopFormService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2),SpringValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), SpringValidators.notOnlyWhitespace]),
        email: new FormControl('',
                                [Validators.required,
                                Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
                              ])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, SpringValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, SpringValidators.notOnlyWhitespace]),
        state:  new FormControl('',[Validators.required]),
        zipCode: new FormControl('', [Validators.required, SpringValidators.notOnlyWhitespace]),
        country: new FormControl('',[Validators.required])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, SpringValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, SpringValidators.notOnlyWhitespace]),
        state:  new FormControl('',[Validators.required]),
        zipCode: new FormControl('', [Validators.required, SpringValidators.notOnlyWhitespace]),
        country: new FormControl('',[Validators.required])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), SpringValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.pattern('^[0-9]{16}$'), Validators.required]),
        securityCode: new FormControl('',[Validators.pattern('^[0-9]{3}$'), Validators.required]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    // populate credit card months
    const startMonth = new Date().getMonth() + 1;
    console.log(`startMonth: ${startMonth}`);

    this.spriNGShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((months) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(months));
        this.creditCardMonths = months;
      });
    // populate credit card years
    this.spriNGShopFormService.getCreditCardYears().subscribe((years) => {
      console.log('Retrieved credit card years: ' + JSON.stringify(years));
      this.creditCardYears = years;
    });

    // populate countries
    this.spriNGShopFormService.getCountries().subscribe((countries) => {
      console.log('Retrieved countries:' + JSON.stringify(countries));
      this.countries = countries;
    });
  }
  reviewCartDetails() {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe((totalQuantity) => {
      this.totalQuantity = totalQuantity;
    });

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe((totalPrice) => {
      this.totalPrice = totalPrice;
    });
  }

  // get customer information
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  //get shipping address information
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  //get billing address information
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  // get credit card information
  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }



  copyShipToBilling(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      //bug fix for state
      this.billingAddressStates = this.shippingAddressStates;

    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for state
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log('Handling the submit event');
    // console.log(this.checkoutFormGroup.get('customer').value);
    // console.log("The email address is:" + this.checkoutFormGroup.get('customer').value.email);
    // console.log("The shipping address is:" + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    // console.log("The shipping address is:" + this.checkoutFormGroup.get('shippingAddress').value.state.name);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup.value.expirationYear
    );

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.spriNGShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((months) => {
        console.log('Retrieved credit card months:' + JSON.stringify(months));
        this.creditCardMonths = months;
      });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(
      `{formGroupName: ${formGroupName}, countryCode: ${countryCode}, countryName: ${countryName}}`
    );
    this.spriNGShopFormService.getStates(countryCode).subscribe((states) => {
      //console.log('Retrieved states:'+ JSON.stringify(states));

      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = states;
      } else if (formGroupName === 'billingAddress') {
        this.billingAddressStates = states;
      }

      //select first item by default
      formGroup.get('state').setValue(states[0]);
    });
  }
}
