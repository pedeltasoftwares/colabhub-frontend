import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { RouterLink, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, CommonModule,RouterLink]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {

    if (!this.username || !this.password) {
      this.error = 'Por favor, ingresa usuario y/o contraseña.';
      return;
    }

    console.log('Mandando al backend:', this.username, this.password);
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        console.log('Respuesta del backend:', res);
      },
      error: (err) => {
        this.error = err.error.message;
        console.error('Error del backend:', err);
      }
    });
  }

  goToResetPassword() {
    if (this.username) {
      this.router.navigate(['/set-password'], { 
        queryParams: { username: this.username } 
      });
    } else {
      this.error = 'Ingresa tu usuario.';
    }
  }



}
