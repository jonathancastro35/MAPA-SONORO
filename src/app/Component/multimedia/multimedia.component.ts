import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

import { FamiliasetnicasService } from 'src/app/Services/familiasetnicas.service';
import { SonidosImagenesAudiosService } from 'src/app/Services/materialmultimedia/sonidosimagenesaudios.service';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.css']
})
export class MultimediaComponent implements AfterViewInit {

  private map!: L.Map;
  private layer = L.layerGroup();

  panelMultimedia = false;

  // 🔵 SOLO IMÁGENES Y VIDEOS EN UI
  multimediaTipo: 'imagenes' | 'videos' = 'imagenes';

  imagenes: string[] = [];
  videos: string[] = [];

  imagenSeleccionada: string | null = null;
  videoSeleccionado: string | null = null;

  constructor(
    private familiasService: FamiliasetnicasService,
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
            <div>
              <div><strong>${familia}</strong></div>

              <button id="img">🖼 Imágenes</button>
              <button id="vid">🎬 Videos</button>
            </div>
          `);

          layer.on('popupopen', (e: any) => {

            const popup = e.popup._contentNode;

            popup.querySelector('#img')?.addEventListener('click', () => {
              this.loadMedia(familia, 'imagenes');
            });

            popup.querySelector('#vid')?.addEventListener('click', () => {
              this.loadMedia(familia, 'videos');
            });
          });
        }
      });

      geoJsonLayer.addTo(this.map);

      setTimeout(() => {
        this.map.fitBounds(geoJsonLayer.getBounds());
      }, 0);
    });
  }

  loadMedia(familia: string, tipo: 'imagenes' | 'videos') {

    const nombre = familia.toUpperCase();

    this.panelMultimedia = true;
    this.multimediaTipo = tipo;

    this.imagenes = [];
    this.videos = [];

    if (tipo === 'imagenes') {
      this.multimediaService.getImagenes(nombre)
        .subscribe(r => this.imagenes = r);
    }

    if (tipo === 'videos') {
      this.multimediaService.getVideos(nombre)
        .subscribe(r => this.videos = r);
    }
  }

  cerrarMultimedia() {
    this.panelMultimedia = false;
  }

  verImagen(img: string) {
    this.imagenSeleccionada = img;
  }

  cerrarPreview() {
    this.imagenSeleccionada = null;
  }

  verVideo(video: string) {
    const videoId = this.extractYouTubeId(video);
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