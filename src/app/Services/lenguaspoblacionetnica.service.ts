import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LenguaspoblacionetnicaService {

  private url = '/assets/materialpoblacion/Lenguas.json';

  constructor(private http: HttpClient) {}

  // 🔹 1. Obtener todo el JSON
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  // 🔹 2. Obtener solo las lenguas (sin metadata)
  getLenguas(): Observable<any[]> {
    return this.getAll().pipe(
      map(data => data.filter(item => item.nombre))
    );
  }

  // 🔹 3. Obtener todas las familias únicas
  getFamilias(): Observable<string[]> {
    return this.getLenguas().pipe(
      map(lenguajes => {
        const familias = lenguajes.map(l => l.familia);
        return [...new Set(familias)];
      })
    );
  }

  // 🔥 4. NUEVO: Obtener lenguas por familia (con lugares)
  getPorFamilia(nombreFamilia: string): Observable<any[]> {
    return this.getLenguas().pipe(
      map(lenguajes => {
        return lenguajes
          .filter(item =>
            item.familia &&
            item.familia.toLowerCase().trim() === nombreFamilia.toLowerCase().trim()
          )
          .map(item => ({
            nombre: item.nombre,
            iso: item.iso,
            familia: item.familia,
            poblacion_aprox: item.poblacion_aprox,
            lugares: (item.lugares || []).map((l: any) => ({
              nombre: l.nombre,
              lat: l.lat,
              lng: l.lng
            }))
          }));
      })
    );
  }

  // 🔹 5. Buscar por nombre de lengua
  getPorNombre(nombre: string): Observable<any[]> {
    return this.getLenguas().pipe(
      map(lenguajes =>
        lenguajes.filter(item =>
          item.nombre &&
          item.nombre.toLowerCase().includes(nombre.toLowerCase())
        )
      )
    );
  }

  // 🔹 6. Buscar por código ISO
  getPorIso(iso: string): Observable<any | undefined> {
    return this.getLenguas().pipe(
      map(lenguajes =>
        lenguajes.find(item =>
          item.iso &&
          item.iso.toLowerCase() === iso.toLowerCase()
        )
      )
    );
  }

  // 🔹 7. Obtener lenguas con más de X habitantes
  getMayoresA(poblacion: number): Observable<any[]> {
    return this.getLenguas().pipe(
      map(lenguajes =>
        lenguajes.filter(item =>
          item.poblacion_aprox &&
          item.poblacion_aprox >= poblacion
        )
      )
    );
  }

  // 🔹 8. Obtener solo nombres de lenguas
  getNombresLenguas(): Observable<string[]> {
    return this.getLenguas().pipe(
      map(lenguajes => lenguajes.map(l => l.nombre))
    );
  }
}
