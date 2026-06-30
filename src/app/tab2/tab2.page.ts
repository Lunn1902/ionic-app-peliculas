import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from '../components/detalle/detalle.component';
import { Pelicula } from '../interfaces/interfaces';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  textoBuscar= '';
  cargando = false;
  peliculas: Pelicula[] = [];
  ideas: string[] = ['Shift','Luck','Prey','Top Gun','Thor','Black Phone','Dr.Strange'];

  constructor(private moviesService: MoviesService,
              private modalCtrl: ModalController) {}

  buscar( event){
    const valor = event.detail.value;

    if(valor.length === 0){
      this.cargando = false;
      this.peliculas = [];
      return;
    }

    this.cargando = true;
    //console.log(valor);
    this.moviesService.SearchMovies(valor)
      .subscribe( resp => {
        console.log(resp);
        this.peliculas = resp['results'];
        this.cargando = false;
      });
  }

  async mostrarModal(id: string){
    const modal = await this.modalCtrl.create({
      component: DetalleComponent,
      componentProps: {
        id
      }
    });
    modal.present();
  }

  

}
