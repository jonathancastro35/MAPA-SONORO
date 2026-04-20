import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgencianacionaldetierraService } from './agencianacionaldetierra.service';


// 🔹 Interfaz del DANE (mínima pero correcta)
interface DANEItem {
  Cod_dep: string;
  Column2: string;
  Column3: string;
  Column4: string;
  Column5: string;
  Column6: string;
  Column7: string; // 👈 PUEBLO
  Column8: string;
  Column9: string;
  Column10: number;
  Column11: number;
  Column12: number;
  Column13: number;
  Column14: number;
}

@Injectable({
  providedIn: 'root'
})
export class LenguasUnificadasService {

  // 🔹 DANE
  private jsonUrl = 'assets/materialpoblacion/Lenguas_indigenas_2018_1_DANE.json';

  constructor(
    private http: HttpClient,
    private antService: AgencianacionaldetierraService
  ) {}

  // 🔥 Normalizador único
  private normalize(text: string): string {
    return text
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
  }

  // 🔹 1. Pueblos desde DANE (Column7)
  getPueblosDane(): Observable<string[]> {
    return this.http.get<{ lenguas_ind_2018_DANE: DANEItem[] }>(this.jsonUrl).pipe(
      map(res => res.lenguas_ind_2018_DANE),
      map((data: DANEItem[]) =>
        data
          .map((item: DANEItem) => item.Column7)
          .filter(Boolean)
          .map((p: string) => this.normalize(p))
      )
    );
  }

  // 🔹 2. Pueblos unificados (DANE + ANT)
  getPueblosUnificados(): Observable<string[]> {
    return forkJoin([
      this.getPueblosDane(),
      this.antService.getPueblosNormalizados()
    ]).pipe(
      map(([dane, ant]) => {

        const unidos = [...dane, ...ant];

        // eliminar duplicados
        const unicos = Array.from(new Set(unidos));

        return unicos.sort();
      })
    );
  }
}