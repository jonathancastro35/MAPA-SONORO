
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

import { FamiliasetnicasService } from 'src/app/Services/familiasetnicas.service';
import { LenguaspoblacionetnicaService } from 'src/app/Services/lenguaspoblacionetnica.service';
import { SonidosImagenesAudiosService } from 'src/app/Services/materialmultimedia/sonidosimagenesaudios.service';

@Component({
  selector: 'app-mapa-familias-etnicas',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.css']
})
export class MultimediaComponent implements AfterViewInit {

  private map!: L.Map;
  private layer = L.layerGroup();

  familiaSeleccionada = '';
  lenguasSeleccionadas: any[] = [];

  // 🎭 multimedia temporal
  imagenes: string[] = [];
  audios: string[] = [];
  videos: string[] = [];

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

        style: (feature) => {
          const familia = feature?.properties?.Familia;
          return {
            color: this.getColor(familia),
            weight: 2,
            fillOpacity: 0.4
          };
        },

        onEachFeature: (feature, layer) => {

          const familia = feature?.properties?.Familia ?? 'Sin familia';

          layer.bindPopup(`
            <div class="popup-card">
              <div class="popup-header">🌿 ${familia}</div>

              <button class="popup-btn" id="btn-pueblos">📍 Pueblos</button>
              <button class="popup-btn" id="btn-img">🖼 Imágenes</button>
              <button class="popup-btn" id="btn-audio">🎧 Audios</button>
              <button class="popup-btn" id="btn-video">🎬 Videos</button>
            </div>
          `);

          layer.on('popupopen', (e: any) => {

            const popup = e.popup._contentNode;

            const btnPueblos = popup.querySelector('#btn-pueblos');
            const btnImg = popup.querySelector('#btn-img');
            const btnAudio = popup.querySelector('#btn-audio');
            const btnVideo = popup.querySelector('#btn-video');

            // 📍 pueblos
            if (btnPueblos) {
              btnPueblos.onclick = () => this.verLenguas(familia);
            }

            // 🖼 imágenes
            if (btnImg) {
              btnImg.onclick = () => {
                this.multimediaService.getImagenes(familia).subscribe(res => {
                  this.imagenes = res;
                  console.log('IMÁGENES:', res);
                });
              };
            }

            // 🎧 audios
            if (btnAudio) {
              btnAudio.onclick = () => {
                this.multimediaService.getAudios(familia).subscribe(res => {
                  this.audios = res;
                  console.log('AUDIOS:', res);
                });
              };
            }

            // 🎬 videos
            if (btnVideo) {
              btnVideo.onclick = () => {
                this.multimediaService.getVideos(familia).subscribe(res => {
                  this.videos = res;
                  console.log('VIDEOS:', res);
                });
              };
            }
          });
        }
      });

      geoJsonLayer.addTo(this.map);
      this.map.fitBounds(geoJsonLayer.getBounds());
    });
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
}
