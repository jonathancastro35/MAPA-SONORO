import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

import { FamiliasetnicasService } from 'src/app/Services/familiasetnicas.service';
import { LenguaspoblacionetnicaService } from 'src/app/Services/lenguaspoblacionetnica.service';
import { SonidosImagenesAudiosService } from 'src/app/Services/materialmultimedia/sonidosimagenesaudios.service';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.css']
})
export class MultimediaComponent implements AfterViewInit {

  private map!: L.Map;
  private layer = L.layerGroup();

  familiaSeleccionada = '';
  lenguasSeleccionadas: any[] = [];

  panelMultimedia = false;
  multimediaTipo: 'imagenes' | 'audios' | 'videos' | '' = '';

  imagenes: string[] = [];
  audios: string[] = [];
  videos: string[] = [];

  imagenSeleccionada: string | null = null;

  constructor(
    private familiasService: FamiliasetnicasService,
    private lenguasService: LenguaspoblacionetnicaService,
    private multimediaService: SonidosImagenesAudiosService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.cargarFamilias();
  }

  private initMap(): void {
    this.map = L.map('map').setView([4.5709, -74.2973], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.layer.addTo(this.map);
  }

  private colores: any = {
    'Chibcha': '#e74c3c',
    'Arawak': '#3498db',
    'Caribe': '#9b59b6',
    'Quechua': '#f1c40f',
    'Tucano': '#1abc9c',
    'Guahibo': '#e67e22',
    'Aislada': '#2ecc71',
    'Criolla': '#34495e'
  };

  private getColor(familia: string): string {
    return this.colores[familia] || '#95a5a6';
  }

  private cargarFamilias(): void {

    this.familiasService.getAll().subscribe(data => {

      const geoJsonLayer = L.geoJSON(data, {

        style: (feature) => ({
          color: this.getColor(feature?.properties?.Familia),
          weight: 2,
          fillOpacity: 0.4
        }),

        onEachFeature: (feature, layer) => {

          const familia = feature?.properties?.Familia ?? 'SIN FAMILIA';

          layer.bindPopup(`
            <div class="popup-card">
              <div class="popup-header">${familia}</div>

              <button class="popup-btn" id="btn-pueblos">📍 Pueblos</button>
              <button class="popup-btn" id="btn-img">🖼 Imágenes</button>
              <button class="popup-btn" id="btn-audio">🎧 Audios</button>
              <button class="popup-btn" id="btn-video">🎬 Videos</button>
            </div>
          `);

          layer.on('popupopen', (e: any) => {

            const popup = e.popup._contentNode;

            popup.querySelector('#btn-pueblos')?.addEventListener('click', () => {
              this.verLenguas(familia);
            });

            popup.querySelector('#btn-img')?.addEventListener('click', () => {
              this.loadMedia(familia, 'imagenes');
            });

            popup.querySelector('#btn-audio')?.addEventListener('click', () => {
              this.loadMedia(familia, 'audios');
            });

            popup.querySelector('#btn-video')?.addEventListener('click', () => {
              this.loadMedia(familia, 'videos');
            });
          });
        }
      });

      geoJsonLayer.addTo(this.map);
      this.map.fitBounds(geoJsonLayer.getBounds());
    });
  }

  private loadMedia(familia: string, tipo: 'imagenes' | 'audios' | 'videos') {

    const nombre = familia.toUpperCase();

    this.panelMultimedia = true;
    this.multimediaTipo = tipo;

    if (tipo === 'imagenes') {
      this.multimediaService.getImagenes(nombre).subscribe(r => this.imagenes = r);
    }

    if (tipo === 'audios') {
      this.multimediaService.getAudios(nombre).subscribe(r => this.audios = r);
    }

    if (tipo === 'videos') {
      this.multimediaService.getVideos(nombre).subscribe(r => this.videos = r);
    }
  }

  verLenguas(familia: string): void {

    this.familiaSeleccionada = familia;

    this.lenguasService.getPorFamilia(familia).subscribe(res => {
      this.lenguasSeleccionadas = res || [];
      this.map.closePopup();
      this.layer.clearLayers();
    });
  }

  cerrarPanel(): void {
    this.familiaSeleccionada = '';
    this.lenguasSeleccionadas = [];
    this.layer.clearLayers();
  }

  cerrarMultimedia(): void {
    this.panelMultimedia = false;
    this.multimediaTipo = '';
    this.imagenes = [];
    this.audios = [];
    this.videos = [];
  }

  verImagen(img: string) {
    this.imagenSeleccionada = img;
  }

  cerrarPreview() {
    this.imagenSeleccionada = null;
  }
}
