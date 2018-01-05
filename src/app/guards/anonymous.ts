import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {StayDuvetService} from '../services/stayduvet';

@Injectable()
export class AnonymousGuard implements CanActivate {

    constructor(private router: Router, private service: StayDuvetService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!StayDuvetService.hasLoginToken()) {
            return true;
        }

        this.router.navigate(['/home']);
        return false;
    }
}
