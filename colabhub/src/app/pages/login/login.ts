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

  //Muestra la contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  //Inicia sesión. Petición al backend
  onSubmit() {

    if (!this.username || !this.password) {
      this.error = 'Por favor, ingresa usuario y/o contraseña.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {

        //TODO: Debug
        console.log('Respuesta del backend:', response);
        
        // Extraemos el rol del usuario
        const userRole = response.user.role;

        // Redirigesegún el rol
        if (userRole === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (userRole === 'pmo_reader'){
          this.router.navigate(['/pmo-dashboard']);
        }else{
          this.router.navigate(['/pmo-dashboard']);
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error.message || 'Error al iniciar sesión.';
        this.isLoading = false;
        //TODO: Debug
        console.error('Error del backend:', err);
      }
    });
  }

  //Navega a la pagina de resetear contraseña
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
