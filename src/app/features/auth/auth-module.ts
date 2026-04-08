import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthPageComponent } from './auth-page/auth-page';
import { BlobBackgroundComponent } from '../../shared/components/blob-background/blob-background';

@NgModule({
  declarations: [AuthPageComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, BlobBackgroundComponent],
})
export class AuthModule {}
