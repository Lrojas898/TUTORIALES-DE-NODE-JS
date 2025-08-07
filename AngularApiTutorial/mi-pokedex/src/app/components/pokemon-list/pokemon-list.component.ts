import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // Importamos CommonModule para ngFor y RouterModule para routerLink
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemonList: any[] = [];

  // Inyectamos nuestro servicio para usarlo
  constructor(private pokemonService: PokemonService) { }

  // ngOnInit se ejecuta cuando el componente se inicia
  ngOnInit(): void {
    this.pokemonService.getPokemonList().subscribe(response => {
      this.pokemonList = response.results;
    });
  }
}
