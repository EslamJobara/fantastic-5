import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @Input() placeholder: string = 'Search...';
  @Input() width: string = 'w-64';
  @Input() variant: 'navbar' | 'page' = 'navbar';
  @Output() search = new EventEmitter<string>();
  
  searchValue: string = '';
  
  onSearch() {
    this.search.emit(this.searchValue);
  }
  
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
