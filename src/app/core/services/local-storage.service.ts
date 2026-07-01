import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * Guarda un elemento en el disco de manera segura.
   * @param key Clave del diccionario
   * @param value Valor a almacenar (se serializará automáticamente)
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`[Storage Audit 🚨] Fallo crítico al guardar en disco la llave: ${key}`, error);
      if (this.isQuotaExceeded(error)) {
        console.error('El almacenamiento del navegador está lleno.');
        // Aquí se pondrían el NotificationService para avisar al usuario
      }
    }
  }

  /**
   * Recupera y parsea un elemento del disco fuertemente tipado.
   */
  public getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`[Storage Audit 🚨] Fallo al leer o parsear la llave: ${key}`, error);
      return null;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[Storage Audit 🚨] Fallo al eliminar la llave: ${key}`, error);
    }
  }

  public clearAll(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[Storage Audit 🚨] Fallo al limpiar el disco entero.', error);
    }
  }

  // Utilidad para detectar si el error fue por falta de espacio
  private isQuotaExceeded(e: any): boolean {
    let quotaExceeded = false;
    if (e) {
      if (e.code) {
        switch (e.code) {
          case 22:
            quotaExceeded = true;
            break;
          case 1014:
            // Firefox
            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              quotaExceeded = true;
            }
            break;
        }
      } else if (e.number === -2147024882) {
        // IE8
        quotaExceeded = true;
      }
    }
    return quotaExceeded;
  }

}
