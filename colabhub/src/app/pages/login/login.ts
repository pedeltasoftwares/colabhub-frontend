import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    if (!this.username) {
      this.error = 'Por favor, ingresa usuario.';
      return;
    }

    if (!this.password) {
      this.error = 'Por favor, ingresa contraseña.';
      return;
    }

    // 🔹 Por ahora simulemos login correcto
    if (this.username === 'admin' && this.password === '1234') {
      this.router.navigate(['/dashboard-admin']);
    } else {
      this.error = 'Usuario o contraseña incorrectos.';
    }
  }
}
