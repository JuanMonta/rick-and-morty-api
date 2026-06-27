import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { areUrlsEqual } from '../utils/url-comparation';

interface CachedResponse {
  response: HttpResponse<unknown>;
  addedTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {

  private cache = new Map<string, CachedResponse>();
  // Definimos el tiempo de vida de la caché en milisegundos
  private readonly CACHE_TTL_MS = 1 * 60 * 1000; // 1 minuto(s)

  private findMatchingKey(urlWithParams: string): string | undefined {
    return Array.from(this.cache.keys()).find(key => areUrlsEqual(key, urlWithParams));
  }

  getCachedResponse(originalUrl: string, urlWithParams: string): HttpResponse<unknown> | null {
    const matchedKey = this.findMatchingKey(urlWithParams);
    if (!matchedKey) {
      console.log(`%c[Memory Cache ❄️ MISS] Sin datos locales para: ${originalUrl} | Derivando tráfico a la red.`, 'color: #bdc3c7; font-weight: 500;');
      return null
    }

    const entry = this.cache.get(matchedKey)!;
    const isExpired = (Date.now() - entry.addedTime) > this.CACHE_TTL_MS;

    if (isExpired) {
      console.log(`%c[Memory Cache 🗑️] Datos caducados para: ${originalUrl} | Purgando entrada obsoleta.`, 'color: #e74c3c; font-weight: bold; font-style: italic;');
      // Si caducó la caché, limpiamos la basura y dejamos que la petición continúe a internet
      this.cache.delete(matchedKey);
      return null;
    }
    console.log(`%c[Memory Cache 🔥 HIT] Recuperando clon inmutable de RAM para: ${originalUrl}`, 'color: #e67e22; font-weight: bold; text-decoration: underline;');
    // Devolvemos un CLON de la respuesta.
    // Siempre usar .clone() porque los HttpResponse en Angular son inmutables
    return entry.response.clone();
  }

  addToCache(originalUrl: string, urlWithParams: string, response: HttpResponse<unknown>): void {
    const matchedKey = this.findMatchingKey(urlWithParams) || urlWithParams;
    console.log(`%c[Memory Cache 💾 STORE] Congelando respuesta en RAM para futuras dimensiones: ${originalUrl}`, 'color: #f1c40f; font-weight: bold;');
    this.cache.set(matchedKey, {
      response: response.clone(),
      addedTime: Date.now()
    });
  }

  // Ventaja: Con esto puedes limpiar la caché cuando quieras
  clearCache(): void {
    this.cache.clear();
  }
}
