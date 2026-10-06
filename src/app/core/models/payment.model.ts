// export interface RazorpayOrderResponse {
//     success: boolean;

//     data: {
//         orderId: string;

//         amount: number;

//         currency: string;

//         key: string;
//     };
// }


export interface RazorpayOrderData {

    orderId: string;

    razorpayOrderId: string;

    amount: number;

    currency: string;

    key: string;

}

export interface RazorpayOrderResponse {

    success: boolean;

    data: RazorpayOrderData;

}

export interface PaymentVerificationRequest {

    orderId: string;

    razorpayOrderId: string;

    razorpayPaymentId: string;

    razorpaySignature: string;

}