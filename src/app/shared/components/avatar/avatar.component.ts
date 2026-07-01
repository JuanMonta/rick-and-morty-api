import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit, OnChanges {
  private imgDefaultSize: number = 40;
  @Input() imageUrl?: string = '';
  @Input() characterName: string = '';
  @Input() size: string = `${this.imgDefaultSize}px`;
  @Input() isCircular: boolean = false;
  @Input() borderRadius: string = "5px";

  public isImageLoaded = false;
  public hasError = false;

  public computedImageUrl: string = '';
  public computedInitials: string = '???';
  public numericSize: number = this.imgDefaultSize;

  private readonly DEFAULT_AVATAR = "https://rickandmortyapi.com/api/character/avatar/104.jpeg"

  constructor() { }

  ngOnInit(): void {
  }

  // Interceptamos los cambios de los Inputs para recalcular solo cuando es estrictamente necesario
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl'] || changes['characterName']) {
      this.computedImageUrl = this.calculateDisplayImageUrl(this.imageUrl);
      this.computedInitials = this.calculateInitials(this.characterName);

      // Reiniciamos el estado si la URL cambia en tiempo real
      this.hasError = false;
      this.isImageLoaded = false;
    }

    if (changes['size']) {
      // Extraemos solo el valor numérico para pasarlo al HTML nativo
      this.numericSize = parseInt(this.size, 10) || this.imgDefaultSize;
    }
  }
  private calculateDisplayImageUrl(url?: string): string {
    return (!url || url.trim() === '') ? this.DEFAULT_AVATAR : url;
  }

  private calculateInitials(name: string): string {
    if (!name || name === 'Desconocido') return "???";
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  onImageLoad() {
    this.isImageLoaded = true;
    this.hasError = false
  }

  onImageLoadError() {
    this.hasError = true;
    this.isImageLoaded = false;
  }


}
