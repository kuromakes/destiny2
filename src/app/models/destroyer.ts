import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export class Destroyer implements OnDestroy {
    destroy$ = new Subject();
    ngOnDestroy() {
        if (this.destroy$) {
            this.destroy$.next();
            this.destroy$.complete();
        }
    }
}
