import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActoresPelicula, Genre, PeliculaDetalle, RespuestaMDB } from '../interfaces/interfaces';

const url = environment.url;
const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private popularPages = 0;
  generos: Genre[] = [];

  constructor(private http: HttpClient) { }

  private ejecutarQuery<T>(query: string){
    query = url + query;
    query += `&api_key=${apiKey}`;//opcional: &language=es&include_image_language=es
    return this.http.get<T>(query);
  }

  getCartelera(){
    const hoy = new Date();
    const ultimoDia = new Date( hoy.getFullYear(), hoy.getMonth() + 1,0).getDate();

    const mes = hoy.getMonth() + 1;

    let mesString;

    if( mes < 10){
      mesString = '0' + mes;
    }else{
      mesString = mes;
    }
    
    const inicio = `${hoy.getFullYear()}-${mesString}-01`;
    const fin = `${hoy.getFullYear()}-${mesString}-${ultimoDia}`;

    return this.ejecutarQuery<RespuestaMDB>(`/discover/movie?primary_release_date.gte=${inicio}&primary_release_date.lte=${fin}`);

  }

  getPopular(){

    this.popularPages++;

    const query = `/discover/movie?sort_by=popularity.desc&page=${this.popularPages}`;
    
    return this.ejecutarQuery<RespuestaMDB>(query);
  }

  getPeliculaDetalle(id: string){
    return this.ejecutarQuery<PeliculaDetalle>(`/movie/${id}?a=1`)
  }

  getActoresPelicula(id: string){
    return this.ejecutarQuery<ActoresPelicula>(`/movie/${id}/credits?a=1`)
  }

  SearchMovies(texto: string){
    return this.ejecutarQuery(`/search/movie?query=${texto}`);
  }

  cargarGeneros(): Promise<any []>{
    return new Promise(resolve => {
      this.ejecutarQuery<any>(`/genre/movie/list?a=1`)
        .subscribe( resp => {
          this.generos = resp.genres;
          resolve(this.generos);
        });
    });
  }
}
