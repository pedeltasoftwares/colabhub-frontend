import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router} from '@angular/router';

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
  success: string = '';
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router:Router) {}

  //Pasa el username al query 
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || '';
    });
  }

  //Devuelve al login
  goBackToLogin(){
    this.router.navigate(['/login']);
  }

  //Muestra la contraseña escrita
  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  //Muestra la contraseña de confirmación escrita
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  //Llama el ENDPOINT de set_password
  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      this.success = '';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';

    //Invoca al backend
    this.authService.set_password(this.username, this.newPassword).subscribe({
      next: (res) =>{
        this.success = 'Contraseña cambiada con éxito.';
        this.error = '';
        //TODO:Debug
        console.log('Contraseña actualizada', res)

        setTimeout(() =>{
          this.router.navigate(['/login']);},1500); //Redigire después de 1.5 al login.
      },
      error: (err) =>{
        this.error = err.error?.message || 'Error al cambiar la contraseña';
        this.success = '';
        this.isLoading = false;
        console.error('Error:', err);
      }

    });
  }
}
