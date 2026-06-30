import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Pelicula, PeliculaDetalle } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  private _storage: Storage | null = null;

  private _peliculas: PeliculaDetalle[] = [];

  constructor(private storage: Storage,
              private toastCrtl: ToastController) { 

    this.cargarFavoritos();

  }

  async presentToast(message: string){
    const toast = await this.toastCrtl.create({
      message,
      duration: 1500
    });
    toast.present();
  }

  get getPeliculas(){
    return [... this._peliculas]
  }

  async cargarFavoritos(){
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadFavorites();
  }

  async saveRemoveArticle(pelicula:PeliculaDetalle){
    let mensaje = '';

    const exists = this._peliculas.find(localFilm => localFilm.title === pelicula.title);

    if(exists){
      this._peliculas = this._peliculas.filter(localFilm => localFilm.title !== pelicula.title);
      mensaje = 'Removido de favoritos!';
    }else{
      this._peliculas = [ pelicula, ...this._peliculas];
      mensaje = 'Agregado a favoritos!';
    }
    this.presentToast(mensaje);
    this._storage.set('films',this._peliculas);

    return !exists;
  }

  async loadFavorites(){
    try{
      const films = await this._storage.get('films');
      this._peliculas = films || [];
      return this._peliculas;
    }catch(error){

    }
  }

  articleInFavorites(pelicula: PeliculaDetalle){
    return !!this._peliculas.find( localFilm => localFilm.title === pelicula.title);
  }

  async existFilm(id){
    await this.cargarFavoritos();
    const existe = this._peliculas.find(film => film.id === id);
    
    return (existe)? true:false;
  }

}