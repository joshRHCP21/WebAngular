import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { SignUpService } from './signup/services/signup.services';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ValidateUserComponent } from './validate-user/validate-user.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    declarations: [
        LandingComponent,
        SignupComponent,
        ProfileComponent,
        RegisterUserComponent,
        ValidateUserComponent,
        
    ],
    providers: [SignUpService]
})
export class ExamplesModule { }
