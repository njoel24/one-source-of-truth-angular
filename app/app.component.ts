import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";

import {CurrentSearch} from "./models/current-search.model";
import {SearchResult} from "./models/search-result.model";
import {YouTubeService} from "./services/youtube.service";

@Component({
    selector: 'my-app',
    template: `
    <section class="col-md-8">
        <h1>{{title}}</h1>
        <div class="row col-md-8">
            <search-box [store]="store"></search-box>
            <proximity-selector [store]="store" [disabled]="disableSearch || errorLocation"
            [ngClass]="{ disabled: disableSearch }"></proximity-selector>
        </div>
        <div class="row col-md-8 alert alert-danger" *ngIf="errorEmptySearch">
            <p>Can't use geolocalization with an empty searchbox</p>
        </div>
        <div class="row col-md-8 alert alert-warning" *ngIf="errorLocation">
            <p>{{ errorLocationMessage }}</p>
        </div>
        <div class="row col-md-8">
            <h6 *ngIf="!disableSearch">Search results:</h6>
        </div>
        <div class="row col-md-8">
            <h6 *ngIf="searchResults.length == 0">No results</h6>
        </div>
        <div class="row col-md-8">
            <a *ngFor="let result of searchResults" class="col-md-8" href="https://www.youtube.com/watch?v={{ result.id }}" target='_blank'>
                <div class="row col-md-7">{{ result.title }}</div>
                <div class="row col-md-1"><img src="{{ result.thumbnailUrl }}" style='max-width:100px;' /></div>
            </a>
        </div>
        </section>
    `
})
export class AppComponent implements OnInit {

    title = '';

    private state: CurrentSearch;
    private currentSearch: Observable<CurrentSearch>;
    private searchResults: SearchResult[] = [];
    private disableSearch = false;
    private errorEmptySearch = true;
    private errorLocation = false;
    private errorLocationMessage = '';

    constructor(
        private store: Store<CurrentSearch>,
        private youtube: YouTubeService
    ) {
        this.currentSearch = this.store.select<CurrentSearch>('currentSearch');
        this.youtube.searchResults.subscribe((results: SearchResult[]) => this.searchResults = results);
    }

    ngOnInit() {
        this.currentSearch.subscribe((state: CurrentSearch) => {
            this.state = state;
            if (state && state.name && state.name.length > 0) {
                this.disableSearch = false;
                this.errorEmptySearch = false;
                this.youtube.search(state);
            } else {
                this.disableSearch = true;
                this.errorEmptySearch = true;
                this.searchResults = [];
            }
            if (state && state.error) {
              this.errorLocation = true;
              this.errorLocationMessage = state.error;
            } else {
              this.errorLocation = false;
            }
        });
    }

}
