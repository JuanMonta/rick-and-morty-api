import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  // Obligatorios
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  //-------------------------------
  //Opcionales
  @Input() siblingCount: number = 1;
  //-------------------------------

  @Output() pageChange = new EventEmitter<number>();

  // Contendrá los número de página y elipsis, ej: (1, '...', 4, 5, 6, '...', 20)
  pagesRange: (number | string)[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    // Cada vez que se cambie de página o cambie el total de páginas, recalculamos el rango
    if (changes['currentPage'] || changes['totalPages']) {
      this.pagesRange = this.generatePageRange();
    }
  }

  private generatePageRange(): (number | string)[] {
    const totalNumbers = this.siblingCount * 2 + 5; // Total de bloques a mostrar (primera, última, actual, hermanos, 2 elipsis)
    const totalBlocks = totalNumbers + 2; // Incluyendo elipsis

    // Si hay menos páginas que bloques, mostramos todas sin elipsis
    if (this.totalPages <= totalNumbers) {
      return this.range(1, this.totalPages);
    }

    const leftSiblingIndex = Math.max(this.currentPage - this.siblingCount, 1);
    const rightSiblingIndex = Math.min(this.currentPage + this.siblingCount, this.totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < this.totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = this.totalPages;

    // Mostrar elipsis solo a la derecha
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * this.siblingCount;
      let leftRange = this.range(1, leftItemCount);
      return [...leftRange, '...', this.totalPages];
    }

    // Mostrar elipsis solo a la izquierda
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * this.siblingCount;
      let rightRange = this.range(this.totalPages - rightItemCount + 1, this.totalPages);
      return [firstPageIndex, '...', ...rightRange];
    }

    // Mostrar elipsis en ambos lados
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = this.range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  }

  // Funciones auxiliares para el HTML y eventos
  range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  onPageClick(page: number | string): void {
    // Si es un número válido y diferente a la página actual, emitimos el evento
    if (typeof page === 'number' && page !== this.currentPage && page > 0 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onNext(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  onPrevious(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

}
