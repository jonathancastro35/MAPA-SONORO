import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SonidosImagenesAudiosService {

  private url = 'assets/MATERIALDIDACTICO/material-linguistico.json';

  constructor(private http: HttpClient) {}

  // 🔹 1. Obtener todo el JSON
  getAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  // 🔹 2. Obtener familias lingüísticas
  getFamilias(): Observable<any[]> {
    return this.getAll().pipe(
      map(data => data.Material_linguistico || [])
    );
  }

  // 🔹 3. Buscar por nombre de familia
  getFamilia(nombre: string): Observable<any | undefined> {
    return this.getFamilias().pipe(
      map(familias =>
        familias.find(f =>
          this.normalize(f.nombre) === this.normalize(nombre)
        )
      )
    );
  }

  // 🔹 4. Obtener imágenes por familia
  getImagenes(nombre: string): Observable<string[]> {
    return this.getFamilia(nombre).pipe(
      map(f => f?.recursos?.imagenes || [])
    );
  }

  // 🔹 5. Obtener audios por familia
  getAudios(nombre: string): Observable<string[]> {
    return this.getFamilia(nombre).pipe(
      map(f => f?.recursos?.audios || [])
    );
  }

  // 🔹 6. Obtener videos por familia
  getVideos(nombre: string): Observable<string[]> {
    return this.getFamilia(nombre).pipe(
      map(f => f?.recursos?.videos || [])
    );
  }

  // 🔹 7. Método genérico (recomendado)
  getMaterial(nombre: string, tipo: 'imagenes' | 'audios' | 'videos'): Observable<string[]> {
    return this.getFamilia(nombre).pipe(
      map(f => f?.recursos?.[tipo] || [])
    );
  }

  // 🔹 8. Todos los materiales globales
  getTodasLasImagenes(): Observable<string[]> {
    return this.getFamilias().pipe(
      map(f => f.flatMap(x => x.recursos?.imagenes || []))
    );
  }

  getTodosLosAudios(): Observable<string[]> {
    return this.getFamilias().pipe(
      map(f => f.flatMap(x => x.recursos?.audios || []))
    );
  }

  getTodosLosVideos(): Observable<string[]> {
    return this.getFamilias().pipe(
      map(f => f.flatMap(x => x.recursos?.videos || []))
    );
  }

  // 🔹 UTILIDAD: normalizar texto
  private normalize(text: string): string {
    return text
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
