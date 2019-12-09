import { Component } from '@angular/core';
import { Destroyer } from '../../models/destroyer';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { trigger, transition, query, stagger, animate, style } from '@angular/animations';

interface BanList {
    weapons: string[];
    armor: string[];
}

@Component({
    selector: 'app-destiny-rules',
    templateUrl: './destiny-rules.component.html',
    styleUrls: ['./destiny-rules.component.scss'],
    animations: [
        trigger('listAnimation', [
            transition('* => *', [ // each time the binding value changes
                query(':leave', [
                    stagger(50, [
                        animate('150ms', style({ opacity: 0 }))
                    ])
                ], { optional: true }),
                query(':enter', [
                    style({ opacity: 0 }),
                    stagger(50, [
                        animate('150ms', style({ opacity: 1 }))
                    ])
                ], { optional: true })
            ])
        ])
    ]
})
export class DestinyRulesComonent extends Destroyer {

    public banList = new BehaviorSubject<BanList>(null);

    public weaponFilter$ = new BehaviorSubject<string>('');

    public armorFilter$ = new BehaviorSubject<string>('');

    get weaponList(): Observable<string[]> {
        return this.weaponFilter$.pipe(
            switchMap(weaponFilter => {
                if (weaponFilter) {
                    return this.banList.pipe(
                        map(list => {
                            return list.weapons.filter(weapon => {
                                const wpn = weapon.toLowerCase();
                                const search = weaponFilter.toLowerCase();
                                const wpnNoSpace = wpn.replace(' ', '');
                                const searchNoSpace = search.replace(' ', '');
                                return wpn.includes(search) ||
                                    wpnNoSpace.includes(searchNoSpace) ||
                                    search.includes(weapon) ||
                                    searchNoSpace.includes(wpnNoSpace);
                            });
                        })
                    );
                }
                return this.banList.pipe(map(list => {
                    if (list && list.weapons) {
                        return list.weapons;
                    }
                    return null;
                }));
            })
        );
    }

    get armorList(): Observable<string[]> {
        return this.armorFilter$.pipe(
            switchMap(armorFilter => {
                if (armorFilter) {
                    return this.banList.pipe(
                        map(list => {
                            return list.armor.filter(piece => {
                                const pc = piece.toLowerCase();
                                const search = armorFilter.toLowerCase();
                                const pcNoSpace = pc.replace(' ', '');
                                const searchNoSpace = search.replace(' ', '');
                                return pc.includes(search) ||
                                    pcNoSpace.includes(searchNoSpace) ||
                                    search.includes(pc) ||
                                    searchNoSpace.includes(pcNoSpace);
                            });
                        })
                    );
                }
                return this.banList.pipe(map(list => {
                    if (list && list.armor) {
                        return list.armor;
                    }
                    return null;
                }));
            })
        );
    }

    public searchWeapons(term: string): void {
        this.weaponFilter$.next(term);
    }

    public searchArmor(term: string): void {
        this.armorFilter$.next(term);
    }

}
