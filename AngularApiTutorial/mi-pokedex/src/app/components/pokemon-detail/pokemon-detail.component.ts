import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  // Cambiar a signal
  pokemon = signal<any>(null);

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    const pokemonName = this.route.snapshot.paramMap.get('name');
    
    if (pokemonName) {
      this.pokemonService.getPokemonDetails(pokemonName).subscribe(details => {
        // Actualizar el signal
        this.pokemon.set(details);
        console.log('Pokemon details loaded:', details);
      });
    }
  }
}