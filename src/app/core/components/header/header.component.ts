import { Component } from '@angular/core';
import { Location } from '@angular/common'; // Importa el servicio Location
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
})
export class HeaderComponent {
  constructor(
    private themeService: ThemeService,
    private location: Location // Inyecta el servicio Location
  ) {}

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  goBack(): void {
    this.location.back(); // Navega a la página anterior
  }
}