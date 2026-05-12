import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  setObject(key: string, value: any): boolean {
    try {
      const jsonValue = JSON.stringify(value);
      this.setItem(key, jsonValue);
      return true;
    } catch (error) {
      return false;
    }
  }

  getObject<T>(key: string): T | null {
    try {

      const jsonValue = this.getItem(key);
      if (jsonValue) {
        return JSON.parse(jsonValue) as T;
      }
      return null;

    } catch (error) {
      return null;
    }
  }

}
