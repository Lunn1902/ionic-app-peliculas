import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cast, PeliculaDetalle } from 'src/app/interfaces/interfaces';
import { DataLocalService } from 'src/app/services/data-local.service';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent implements OnInit {

  @Input() id;

  pelicula: PeliculaDetalle = {};
  actores: Cast[] = [];
  truncar = 150;
  fav = 'star-outline';

  slideOptsActores={
    slidesPerView: 3.3,
    freeMode: true,
    spacebetween: -5
  };

  constructor(private moviesService: MoviesService,
              private modalCrtl: ModalController,
              private dataLocal: DataLocalService) { }

  ngOnInit() {
    this.moviesService.getPeliculaDetalle(this.id)
      .subscribe( resp => {
        this.pelicula = resp;
      });

    this.moviesService.getActoresPelicula(this.id)
       .subscribe( resp => {
         this.actores = resp.cast;
       });
    
    this.dataLocal.existFilm (this.id)
      .then(existe => this.fav = (existe) ? 'star':'star-outline');
  }

  regresar(){
    this.modalCrtl.dismiss();
  }

  favorito(){
    this.dataLocal.saveRemoveArticle(this.pelicula)
      .then (existe => this.fav = (existe) ? 'star' : 'star-outline');
  }
}
