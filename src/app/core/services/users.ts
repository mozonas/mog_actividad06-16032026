import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUsersResponse } from '../models/users-response.interface';
import { IUser } from '../models/user.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Users {
  private httpClient = inject(HttpClient);
  private baseUrl: string = 'https://peticiones.online/users';

  getAll(url: string): Promise<IUsersResponse> {
    //lastValueFrom convierte el observa en promesa, firstValueFrom
    const miUrl = (url === "") ? this.baseUrl : url
    return lastValueFrom(this.httpClient.get<IUsersResponse>(miUrl))
  }


  /** getById lo vamos hacer con promesas y recibirá como parametro id el personaje */
  getById(id: number): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/${id}`))
  }
}
