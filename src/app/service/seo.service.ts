import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

    private readonly DEFAULT_TITLE = 'Destiny 2 by Kuroi';

    private readonly DEFAULT_DESCRIPTION = 'Destiny 2 clan rosters, PvP and PvE stats, clan leaderboards, sweats and scrim rules, and more, by kuroi.io.'

    constructor(
      private title: Title,
      private meta: Meta
    ) {
        this.resetTitle();
        this.updateDescription();
    }
  
    public updateTitle(title: string): void {
        this.title.setTitle(`${title} | ${this.DEFAULT_TITLE}`);
    }

    public resetTitle(): void {
        this.title.setTitle(this.DEFAULT_TITLE);
    }
  
    public updateDescription(desc?: string): void {
        this.meta.updateTag({
            name: 'description',
            content: desc || this.DEFAULT_DESCRIPTION
        });
    }
  
}