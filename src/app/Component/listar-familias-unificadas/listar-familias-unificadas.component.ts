import { Component, OnInit } from '@angular/core';
import { FamiliasLingusticasUnificadasService } from 'src/app/Services/familias-lingusticas-unificadas.service';
import { SonidosImagenesAudiosService } from 'src/app/Services/materialmultimedia/sonidosimagenesaudios.service';

@Component({
  selector: 'app-listar-familias-unificadas',
  templateUrl: './listar-familias-unificadas.component.html',
  styleUrls: ['./listar-familias-unificadas.component.css']
})
export class ListarFamiliasUnificadasComponent implements OnInit {

  // 📌 LISTADO
  listarFamilias: string[] = [];
  listaFiltrada: string[] = [];
  datosPaginados: string[] = [];

  // 📌 PAGINACIÓN
  paginaActual = 1;
  registrosPorPagina = 20;
  totalPaginas = 0;

  // 📌 FILTRO
  filtro = '';

  // 📌 MODAL MULTIMEDIA
  mostrarModal = false;
  multimediaFamilia = '';

  imagenes: string[] = [];
  audios: string[] = [];
  videos: string[] = [];

  constructor(
    private service: FamiliasLingusticasUnificadasService,
    private multimediaService: SonidosImagenesAudiosService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  // 🔹 CARGAR FAMILIAS
  cargarDatos(): void {
    this.service.getFamiliasUnificadas().subscribe({
      next: (data: string[]) => {
        this.listarFamilias = data.map(x => x.trim());
        this.listaFiltrada = [...this.listarFamilias];
        this.calcularPaginacion();
      },
      error: (err) => console.error(err)
    });
  }

  // 🔹 FILTRO
  filtrar(): void {
    const valor = this.filtro.toLowerCase();

    this.listaFiltrada = this.listarFamilias.filter(f =>
      f.toLowerCase().includes(valor)
    );

    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  // 🔹 PAGINACIÓN
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

  // 🎭 ABRIR MODAL MULTIMEDIA
  abrirMultimedia(familia: string): void {

    this.multimediaFamilia = familia;
    this.mostrarModal = true;

    // limpiar antes de cargar
    this.imagenes = [];
    this.audios = [];
    this.videos = [];

    this.multimediaService.getMaterial(familia, 'imagenes')
      .subscribe(r => this.imagenes = r);

    this.multimediaService.getMaterial(familia, 'audios')
      .subscribe(r => this.audios = r);

    this.multimediaService.getMaterial(familia, 'videos')
      .subscribe(r => this.videos = r);
  }

  // ❌ CERRAR MODAL
  cerrarModal(): void {
    this.mostrarModal = false;

    this.imagenes = [];
    this.audios = [];
    this.videos = [];
  }
}
