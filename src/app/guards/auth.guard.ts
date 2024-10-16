import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service/user-service.service';


export const authGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserServiceService);
  const router = inject(Router);

  if (userService.isAuth()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
