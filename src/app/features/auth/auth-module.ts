import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, BlobBackgroundComponent],
})
export class AuthModule {}
