import { Component, OnInit } from '@angular/core';
import { PueblosDetalleUnificadoService, PuebloDetalle } from 'src/app/Services/pueblos-detalle-unificado.service';

@Component({
  selector: 'app-listar-pueblos-detalle',
  templateUrl: './listar-pueblos-detalle.component.html',
  styleUrls: ['./listar-pueblos-detalle.component.css']
})
export class ListarPueblosDetalleComponent implements OnInit {

  lista: PuebloDetalle[] = [];
  listaFiltrada: PuebloDetalle[] = [];
  datosPaginados: PuebloDetalle[] = [];

  paginaActual = 1;
  registrosPorPagina = 20;
  totalPaginas = 0;

  filtro = '';

  constructor(private service: PueblosDetalleUnificadoService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.service.getPueblosConDetalle().subscribe({
      next: (data: PuebloDetalle[]) => {
        this.lista = data;
        this.listaFiltrada = [...this.lista];
        this.calcularPaginacion();
      },
      error: (err) => {
        console.error('❌ Error cargando pueblos detalle:', err);

        // evita pantalla vacía silenciosa
        this.lista = [];
        this.listaFiltrada = [];
        this.datosPaginados = [];
      }
    });
  }

  filtrar(): void {
    const valor = this.filtro.toLowerCase();

    this.listaFiltrada = this.lista.filter(item =>
      item.pueblo.toLowerCase().includes(valor) ||
      (item.familia_linguistica || '').toLowerCase().includes(valor)
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
}
