import { CanActivateFn, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { inject } from '@angular/core';

export const redirectGuardGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserServiceService);
  const router = inject(Router);

  if(userService.isAuth()) {
    router.navigate(['/perfil'])
    return false;
  } else {
    return true;
  }

  
};
