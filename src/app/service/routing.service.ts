import { Injectable, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Destroyer } from '../models/destroyer';

@Injectable({
    providedIn: 'root'
})
export class RoutingService extends Destroyer implements OnDestroy {

    public lastUrl: BehaviorSubject<string>;
    private LAST_URL_KEY = '__kud2_lastUrl__';

    constructor(
        public router: Router,
        public location: Location,
        public activeRoute: ActivatedRoute
    ) {
        super();
        this.watch();
        const last = localStorage.getItem(this.LAST_URL_KEY);
        this.lastUrl = new BehaviorSubject<string>(last ? last : null);
    }

    private watch(): void {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe((event: NavigationEnd) => {
            this.lastUrl.next(event.url);
            this.cacheRoute(event.url);
        });
    }

    public navigate(route: string): void {
        this.router.navigate([route]);
    }

    public navigateToUrl(route: string): void {
        this.router.navigateByUrl(route);
    }

    public setLocationState(location: string): void {
        this.location.replaceState(location);
    }

    public cacheRoute(route: string): void {
        localStorage.setItem(this.LAST_URL_KEY, route);
    }

}
