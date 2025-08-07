import { Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';

export const routes: Routes = [
  // Ruta principal: muestra la lista de Pokémon
  { path: '', component: PokemonListComponent },
  
  // Ruta para los detalles: usa un parámetro 'name' para saber qué Pokémon mostrar
  { path: 'pokemon/:name', component: PokemonDetailComponent },
  
  // Redirección: si alguien entra a una ruta no definida, lo mandamos a la principal
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
