import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './set-password.html',
  styleUrl: './set-password.css'
})

export class SetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  error: string = '';
  username: string = ''; 
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || '';
    });
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    // Por ahora solo mostramos en consola
    console.log('Nueva contraseña:', this.newPassword);
  }
}
