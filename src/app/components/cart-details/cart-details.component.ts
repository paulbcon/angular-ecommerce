import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe((totalPrice) => {
      this.totalPrice = totalPrice;
    });

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe((totalQuantity) => {
      this.totalQuantity = totalQuantity;
    });

   // compute cart total price and quantity
   this.cartService.computeCartTotals();
  }

  incrementQuantity(item: CartItem) {
    {
      this.cartService.addToCart(item);
    }
  }

  decrementQuantity(item: CartItem) {
    {
      this.cartService.decrementQuantity(item);
    }
  }

  remove(item:CartItem) {
      this.cartService.remove(item);
  }

}
