import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUsersResponse } from '../models/users-response.interface';
import { IUser } from '../models/user.interface';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Users {
  private httpClient = inject(HttpClient);
  private baseUrl = 'https://peticiones.online/api/users';

  getAll(url: string): Promise<IUsersResponse> {
    //lastValueFrom convierte el observa en promesa, firstValueFrom
    const miUrl = (url === "") ? this.baseUrl : this.baseUrl+url
    return lastValueFrom(this.httpClient.get<IUsersResponse>(miUrl))
  }


  /** getById lo vamos hacer con promesas y recibirá como parametro id el personaje */
  getById(_id: string): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/${_id}`))
  }

  delete(_id: string): Promise<any> {
    return lastValueFrom(this.httpClient.delete(`${this.baseUrl}/${_id}`));
  }

  update(_id: string, data: Partial<IUser>): Promise<IUser> {
    return lastValueFrom(this.httpClient.put<IUser>(`${this.baseUrl}/${_id}`, data));
  }

  create(data: Partial<IUser>): Promise<IUser> {
    return lastValueFrom(this.httpClient.post<IUser>(this.baseUrl, data));
  }
}
