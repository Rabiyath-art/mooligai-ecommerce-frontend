import {
    Component,
    OnInit,
    inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
    FormsModule
} from '@angular/forms';

import {
    Router,
    RouterLink
} from '@angular/router';

import {
    CartService
} from '../../core/services/cart.service';

import {
    AddressService
} from '../../core/services/address.service';

import {
    Cart
} from '../../core/models/cart.model';

import {
    Address
} from '../../core/models/address.model';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { RazorpayService } from '../../core/services/razorpay.service';
import { RazorpayOrderData } from '../../core/models/payment.model';

@Component({
    selector: 'app-checkout',
    imports: [
        CommonModule,
        FormsModule,
        RouterLink
    ],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
    private readonly cartService = inject(CartService);
    private readonly addressService = inject(AddressService);
    private readonly orderService = inject(OrderService);
    private readonly paymentService = inject(PaymentService);
    private readonly razorpayService = inject(RazorpayService); private readonly router = inject(Router);

    cart: Cart | null = null;

    addresses: Address[] = [];

    selectedAddressId = '';

    loading = false;

    savingAddress = false;

    showAddressForm = false;

    errorMessage = '';

    successMessage = '';


    newAddress = {
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        isDefault: false
    };


    ngOnInit(): void {

        this.loadCart();

        this.loadAddresses();

    }


    loadCart(): void {

        this.loading = true;

        this.cartService
            .getCart()
            .subscribe({

                next: (response) => {

                    this.cart =
                        response.data;

                    this.loading = false;

                    if (
                        !this.cart ||
                        this.cart.items.length === 0
                    ) {

                        this.router.navigate([
                            '/cart'
                        ]);

                    }

                },

                error: (error) => {

                    console.error(error);

                    this.errorMessage =
                        'Unable to load your cart.';

                    this.loading = false;

                }

            });

    }


    loadAddresses(): void {

        this.addressService
            .getAddresses()
            .subscribe({

                next: (response) => {

                    this.addresses =
                        response.data;

                    const defaultAddress =
                        this.addresses.find(
                            address =>
                                address.isDefault
                        );

                    if (defaultAddress) {

                        this.selectedAddressId =
                            defaultAddress._id;

                    } else if (
                        this.addresses.length
                    ) {

                        this.selectedAddressId =
                            this.addresses[0]._id;

                    }

                },

                error: (error) => {

                    console.error(error);

                }

            });

    }


    selectAddress(
        addressId: string
    ): void {

        this.selectedAddressId =
            addressId;

    }


    addAddress(): void {

        if (
            !this.newAddress.name ||
            !this.newAddress.phone ||
            !this.newAddress.addressLine1 ||
            !this.newAddress.city ||
            !this.newAddress.state ||
            !this.newAddress.pincode
        ) {

            this.errorMessage =
                'Please fill all required fields.';

            return;

        }


        this.savingAddress = true;

        this.errorMessage = '';


        this.addressService
            .addAddress(
                this.newAddress
            )
            .subscribe({

                next: (response) => {

                    this.addresses = [
                        ...this.addresses,
                        response.data
                    ];

                    this.selectedAddressId =
                        response.data._id;

                    this.showAddressForm =
                        false;

                    this.savingAddress = false;

                    this.resetAddressForm();

                },

                error: (error) => {

                    console.error(error);

                    this.errorMessage =
                        'Unable to save address.';

                    this.savingAddress = false;

                }

            });

    }


    resetAddressForm(): void {

        this.newAddress = {

            name: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pincode: '',
            landmark: '',
            isDefault: false

        };

    }


    proceedToPayment(): void {
        if (!this.selectedAddressId) {
            this.errorMessage = 'Please select a delivery address.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        /*
         * STEP 1
         * Create our MongoDB order
         */

        this.orderService.createOrder(this.selectedAddressId).subscribe({
            next: (orderResponse) => {
                const orderId = orderResponse.data._id;
                /*
                 * STEP 2
                 * Ask backend to create
                 * Razorpay order
                 */
                this.createRazorpayOrder(orderId);
            },

            error: (error) => {
                console.error(error);
                this.loading = false;
                this.errorMessage = error.error?.message ?? 'Unable to create order.';
            }
        });
    }

    private createRazorpayOrder(
        orderId: string
    ): void {

        this.paymentService
            .createPaymentOrder(
                orderId
            )
            .subscribe({

                next: async (response) => {

                    this.loading = false;

                    const loaded =
                        await this.razorpayService
                            .loadScript();


                    if (!loaded) {

                        this.errorMessage =
                            'Unable to load payment gateway.';
                        return;

                    }


                    this.openRazorpay(
                        response.data
                    );

                },

                error: (error) => {

                    console.error(error);

                    this.loading = false;

                    this.errorMessage =
                        error.error?.message ??
                        'Unable to create payment order.';

                }

            });

    }

    private openRazorpay(paymentData: RazorpayOrderData): void {
        const options: RazorpayOptions = {

            key: paymentData.key,

            amount: paymentData.amount,

            currency: paymentData.currency,

            name: 'Mooligai Mart',

            description:
                'Mooligai products purchase',

            order_id:
                paymentData.razorpayOrderId,


            theme: {

                color: '#212529'

            },


            handler: (response) => {

                this.verifyPayment(
                    paymentData.orderId,
                    response
                );

            },


            modal: {

                ondismiss: () => {

                    console.log(
                        'Razorpay checkout closed'
                    );

                }

            }

        };


        const razorpay =
            new window.Razorpay(
                options
            );


        razorpay.open();

    }

    private verifyPayment(orderId: string, response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }
    ): void {

        this.loading = true;


        this.paymentService.verifyPayment({
            orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
        })
            .subscribe({

                next: (result) => {
                    this.loading = false;
                    console.log('Payment verified:', result);
                    // this.router.navigate(['/order-success', orderId]);
                    this.router.navigate(['/orders']);
                },

                error: (error) => {

                    console.error(error);

                    this.loading = false;

                    this.errorMessage =
                        error.error?.message ??
                        'Payment verification failed.';

                }

            });

    }
}
