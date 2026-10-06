import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    Observable
} from 'rxjs';

import {
    environment
} from '../../../environments/environment';

import {
    RazorpayOrderResponse,
    PaymentVerificationRequest
} from '../models/payment.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/payments`;


    createPaymentOrder(
        orderId: string
    ): Observable<RazorpayOrderResponse> {

        return this.http.post<RazorpayOrderResponse>(
            `${this.apiUrl}/create-order`,
            {
                orderId
            },
            {
                withCredentials: true
            }
        );

    }


    verifyPayment(request: PaymentVerificationRequest): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/verify`,
            request,
            {
                withCredentials: true
            }
        );

    }

}