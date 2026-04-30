import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  @Input() imageUrl: string = '';
  @Input() characterName: string = '';
  @Input() size: string = '40px';

  isImageLoaded = false;
  hasError = false;

  constructor() { }

  ngOnInit(): void {
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
