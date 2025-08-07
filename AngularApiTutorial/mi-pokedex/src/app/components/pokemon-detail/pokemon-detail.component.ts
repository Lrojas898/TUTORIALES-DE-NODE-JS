import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule], // Importamos RouterModule para el botón de volver
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any = null; // Usaremos 'any' para simplificar, aquí guardaremos los detalles

  // Inyectamos ActivatedRoute para leer la URL y PokemonService para pedir los datos
  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    // Obtenemos el parámetro 'name' de la URL
    const pokemonName = this.route.snapshot.paramMap.get('name');

    // Si existe el nombre, pedimos los detalles al servicio
    if (pokemonName) {
      this.pokemonService.getPokemonDetails(pokemonName).subscribe(details => {
        this.pokemon = details;
      });
    }
  }
}
