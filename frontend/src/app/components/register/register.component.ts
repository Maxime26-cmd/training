import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        console.error('Erreur d\'inscription:', error);
      }
    });
  }
}
