import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  @Input() imageUrl: string | undefined = '';
  @Input() characterName: string = '';
  @Input() size: string = '40px';
  @Input() isCircular: boolean = false;
  @Input() borderRadius: string = "5px";

  isImageLoaded = false;
  hasError = false;

  private readonly DEFAULT_AVATAR = "https://rickandmortyapi.com/api/character/avatar/104.jpeg"

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Si 'imageUrl' es undefined, null o un string vacío '',
   * devuelvela imagen por defecto.
   */
  get displayImageUrl(): string {
    if (!this.imageUrl || this.imageUrl.trim() === '') {
      return this.DEFAULT_AVATAR;
    }
    return this.imageUrl;
  }

  get characterNameInitials(): string {
    if (!this.characterName) return "???";
    return this.characterName
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
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
