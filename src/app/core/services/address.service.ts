import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Address } from '../models/address.model';

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/addresses`;

    getAddresses(): Observable<{ success: boolean; data: Address[]; }> {
        return this.http.get<{
            success: boolean;
            data: Address[];
        }>(
            this.apiUrl,
            {
                withCredentials: true
            }
        );

    }

    addAddress(
        address: Omit<
            Address,
            '_id' | 'createdAt' | 'updatedAt'
        >
    ): Observable<{
        success: boolean;
        data: Address;
    }> {

        return this.http.post<{
            success: boolean;
            data: Address;
        }>(
            this.apiUrl,
            address,
            {
                withCredentials: true
            }
        );

    }


    updateAddress(
        addressId: string,
        address: Partial<Address>
    ): Observable<{
        success: boolean;
        data: Address;
    }> {

        return this.http.put<{
            success: boolean;
            data: Address;
        }>(
            `${this.apiUrl}/${addressId}`,
            address,
            {
                withCredentials: true
            }
        );

    }

    deleteAddress(
        addressId: string
    ): Observable<{
        success: boolean;
        message: string;
    }> {

        return this.http.delete<{
            success: boolean;
            message: string;
        }>(
            `${this.apiUrl}/${addressId}`,
            {
                withCredentials: true
            }
        );

    }

}