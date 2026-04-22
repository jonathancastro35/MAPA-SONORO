import { Component, OnInit } from '@angular/core';
import { FamiliasLingusticasUnificadasService } from 'src/app/Services/familias-lingusticas-unificadas.service';
import { SonidosImagenesAudiosService } from 'src/app/Services/materialmultimedia/sonidosimagenesaudios.service';

@Component({
  selector: 'app-listar-familias-unificadas',
  templateUrl: './listar-familias-unificadas.component.html',
  styleUrls: ['./listar-familias-unificadas.component.css']
})
export class ListarFamiliasUnificadasComponent implements OnInit {

  listarFamilias: string[] = [];
  listaFiltrada: string[] = [];
  datosPaginados: string[] = [];

  paginaActual = 1;
  registrosPorPagina = 20;
  totalPaginas = 0;

  filtro = '';

  // modal multimedia
  mostrarModal = false;
  multimediaFamilia = '';

  imagenes: string[] = [];
  videos: string[] = [];

  // previews
  imagenSeleccionada: string | null = null;
  videoSeleccionado: string | null = null;

  constructor(
    private service: FamiliasLingusticasUnificadasService,
    private multimediaService: SonidosImagenesAudiosService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.service.getFamiliasUnificadas().subscribe(data => {
      this.listarFamilias = data.map(x => x.trim());
      this.listaFiltrada = [...this.listarFamilias];
      this.calcularPaginacion();
    });
  }

  filtrar(): void {
    const valor = this.filtro.toLowerCase();

    this.listaFiltrada = this.listarFamilias.filter(f =>
      f.toLowerCase().includes(valor)
    );

    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.listaFiltrada.length / this.registrosPorPagina);
    this.actualizarPagina();
  }

  actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;

    this.datosPaginados = this.listaFiltrada.slice(inicio, fin);
  }

  siguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPagina();
    }
  }

  anterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPagina();
    }
  }

  // 🎭 multimedia
  abrirMultimedia(familia: string): void {

    this.multimediaFamilia = familia;
    this.mostrarModal = true;

    this.imagenes = [];
    this.videos = [];

    this.multimediaService.getMaterial(familia, 'imagenes')
      .subscribe(r => this.imagenes = r);

    this.multimediaService.getMaterial(familia, 'videos')
      .subscribe(r => this.videos = r);
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  // 🖼 imagen
  verImagen(img: string) {
    this.imagenSeleccionada = img;
  }

  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

  // 🎬 video YouTube
  verVideo(v: string) {
    const videoId = this.extractYouTubeId(v);
    this.videoSeleccionado = `https://www.youtube.com/embed/${videoId}`;
  }

  cerrarVideo() {
    this.videoSeleccionado = null;
  }

  private extractYouTubeId(url: string): string {
    const regExp = /(?:youtube\.com.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : url;
  }
}