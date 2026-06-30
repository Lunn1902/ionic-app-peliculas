import { Component, OnInit } from '@angular/core';
import { Genre, PeliculaDetalle } from '../interfaces/interfaces';
import { DataLocalService } from '../services/data-local.service';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page{

  peliculas: PeliculaDetalle[] = [];
  generos: Genre[] = [];

  favoritoGenero: any[] = [];

  /*get getpeliculas(): PeliculaDetalle[]{
    return this.dataLocal.getPeliculas;
  }*/

  constructor(private dataLocal: DataLocalService,
              private moviesService: MoviesService) {}

  async ionViewWillEnter(){
    this.peliculas = await this.dataLocal.loadFavorites();
    this.generos = await this.moviesService.cargarGeneros();

    this.pelisPorGenero(this.generos, this.peliculas);
  }

  pelisPorGenero(generos: Genre[],peliculas: PeliculaDetalle[]){
    this.favoritoGenero = [];
    generos.forEach( genero => {
      this.favoritoGenero.push({
        genero: genero.name,
        pelis: peliculas.filter(peli => {
          return peli.genres.find(genre => genre.id === genero.id);
        })
      });
    });
  }
}
