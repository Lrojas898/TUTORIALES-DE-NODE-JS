import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
} )
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  // Inyectamos HttpClient para poder hacer peticiones HTTP
  constructor(private http: HttpClient ) { }

  // Función para obtener la lista de los primeros 151 Pokémon (1ª generación)
  getPokemonList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon?limit=151` );
  }

  // Función para obtener los detalles de un Pokémon por su nombre
  getPokemonDetails(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${name}` );
  }
}
