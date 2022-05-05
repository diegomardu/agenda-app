import { PaginaContato } from './contato/paginaContato';
import { Contato } from './contato/contato';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  url: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  salvarContato(contato: Contato): Observable<Contato>{
    return this.http.post<Contato>(this.url,contato)
  }

  listarContatos(page,size): Observable<PaginaContato>{
    const params = new HttpParams()
      .set('page',page)
      .set('size',size)
    return this.http.get<any>(`${this.url}?${params.toString()}`)
  }

  favoritarContato(contato: Contato): Observable<any>{
    return this.http.patch(`${this.url}/${contato.id}/favorito`,null);
  }

  uploadFoto(contato: Contato, formData: FormData): Observable<any>{
    return this.http.put(`${this.url}/${contato.id}/foto`, formData, { responseType : 'blob' });
  }
}