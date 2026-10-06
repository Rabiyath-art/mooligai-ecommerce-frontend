import {
    Injectable
} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RazorpayService {

    private readonly scriptUrl =
        'https://checkout.razorpay.com/v1/checkout.js';


    loadScript(): Promise<boolean> {

        return new Promise(
            (resolve) => {

                if (
                    document.querySelector(
                        'script[src="' +
                        this.scriptUrl +
                        '"]'
                    )
                ) {

                    resolve(true);

                    return;

                }


                const script =
                    document.createElement(
                        'script'
                    );

                script.src =
                    this.scriptUrl;

                script.onload = () => {

                    resolve(true);

                };

                script.onerror = () => {

                    resolve(false);

                };

                document.body.appendChild(
                    script
                );

            }
        );

    }

}