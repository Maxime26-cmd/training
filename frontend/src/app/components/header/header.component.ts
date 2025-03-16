import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink, RouterModule, CommonModule]
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); 
  }

  getUsername(): string | null {
    return this.authService.getUsername();
  }

  getProfilePicture(): string | null {
    return this.authService.getProfilePicture();
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '/assets/default-avatar.png';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.authService.uploadProfilePicture(file).subscribe({
        next: (response) => {
          console.log('Photo uploaded successfully:', response);
        },
        error: (error) => {
          console.error('Error uploading photo:', error);
        }
      });
    }
  }

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }
}
