import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CaracterizacionLenguaService {

  // 1. ruta del JSON
  private jsonUrl = '/assets/materialpoblacion/Caracterizacionlenguasnativa.json';

  // 2. inyección
  constructor(private http: HttpClient) {}

  // 3. trae todo el JSON crudo
  getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  // 4. arreglo principal ya limpio
  getAll(): Observable<any[]> {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(res => res.Caracterizacioneslenguas)
    );
  }
//desspués de unificar dos datas donde sacamos nombre probaremos este de caracterización
  getInfoByPueblo(pueblo: string): Observable<any> {
  return this.getAll().pipe(
    map(data => {

      const normalize = (text: string) =>
        text
          ?.normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // quita tildes
          .toUpperCase()
          .trim();

      const puebloNormalizado = normalize(pueblo);

      const resultado = data.find(item => {
        const col3 = normalize(item.Column3);
        const col4 = normalize(item.Column4);

        return col3 === puebloNormalizado || col4 === puebloNormalizado;
      });

      if (!resultado) return null;

      return {
        denominacion_lengua: resultado.Column5,
        autodenominacion_de_la_lengua: resultado.Column6,
        familia_linguistica: resultado.Column7
      };
    })
  );
}
}
