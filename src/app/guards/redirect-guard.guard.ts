import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserServiceService } from '../services/user-service/user-service.service';

export const redirectGuardGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserServiceService);
  const router = inject(Router);

  if(userService.isAuth()) {
    router.navigate(['/home'])
    return false;
  } else {
    return true;
  }

  
};
