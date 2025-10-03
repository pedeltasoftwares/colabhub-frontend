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
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {

    if (!this.username || !this.password) {
      this.error = 'Por favor, ingresa usuario y/o contraseña.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        //TODO: Debug
        console.log('Respuesta del backend:', res);
        this.isLoading = false;
        //Se navega otra pagina
      },
      error: (err) => {
        this.error = err.error.message || 'Error al iniciar sesión.';
        this.isLoading = false;
        //TODO: Debug
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
      this.error = 'Ingresa tu usuario primero';
    }
  }



}
