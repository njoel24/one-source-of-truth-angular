import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";

import {CurrentSearch} from "./models/current-search.model";
import {IMessage} from "./models/message.model";
import {SearchResult} from "./models/search-result.model";
import {YouTubeService} from "./services/youtube.service";


@Component({
    selector: 'my-app',
    template: `
    <section class="col-md-8" *ngIf="!videoLoaded">
        <h1>{{title}}</h1>
        <div class="row col-md-8">
            <search-box [store]="store"></search-box>
            <proximity-selector *ngIf="!disableGeoLocalization" [store]="store" [disabled]="disableSearch || errorLocation"
            [ngClass]="{ disabled: disableSearch }"></proximity-selector>
        </div>
        <div class="row col-md-8 alert alert-danger" *ngIf="errorEmptySearch && !disableGeoLocalization">
            <p>Can't use geolocalization with an empty searchbox</p>
        </div>
        <div class="row col-md-8 alert alert-warning" *ngIf="errorLocation && !disableGeoLocalization">
            <p>{{ errorLocationMessage }}</p>
        </div>
        <div class="row col-md-12">
            <h6 *ngIf="!disableSearch">Search results:</h6>
        </div>
        <div class="row col-md-12">
            <h6 *ngIf="searchResults.length == 0">No results</h6>
        </div>
        <div class="row col-md-12">
            <a *ngFor="let result of searchResults" class="col-md-12" >
                <div class="row col-md-7">{{ result.title }}</div>
                <div class="row col-md-1"><img src="{{ result.thumbnailUrl }}"
                 (click)="playVideo(result.id)" style='max-width:100px;cursor:pointer;' /></div>
            </a>
        </div>
    </section>
    <section *ngIf="videoLoaded">
        <div class="row col-md-12" >
            <a  class="col-md-12" >
                <div class="row col-md-7" style="cursor:pointer" (click)="stopVideo()">Back</div>
            </a>
            <youtube-player [store]="store" ></youtube-player>
        </div>
    </section>
    `
})
export class AppComponent implements OnInit {

    title = '';

    static StoreEvents = {
        playVideo: 'Youtube:PLAY_VIDEO',
        stopVideo: 'Youtube:STOP_VIDEO'
    };

    private state: CurrentSearch;
    private currentSearch: Observable<CurrentSearch>;
    private searchResults: SearchResult[] = [];
    private disableSearch = false;
    private errorEmptySearch = true;
    private disableGeoLocalization = true;
    private errorLocation = false;
    private errorLocationMessage = '';
    private videoLoaded: boolean = false;
    private appWindow;
    private appOrigin;

    constructor(
        private store: Store<CurrentSearch>,
        private youtube: YouTubeService
    ) {
        this.currentSearch = this.store.select<CurrentSearch>('currentSearch');
        this.youtube.searchResults.subscribe((results: SearchResult[]) => this.searchResults = results);
        window.addEventListener('message', this.onMessage.bind(this));        
    }

    stopVideo() {
        this.store.dispatch({
            type: AppComponent.StoreEvents.stopVideo
        })
    }

    playVideo(id: any) {
        console.log("dispatch:"+id);
        this.store.dispatch({
            type: AppComponent.StoreEvents.playVideo,
            payload: {
                videoId: id
            }
        })
    }

    prepareMessage(isLoaded: boolean): void {
        let message: IMessage = {};
        message.source = "youtube";
        message.event = "videoLoaded";
        message.data = {"isLoaded": isLoaded};
        return message;
    }


    onMessage(e) {
        this.appWindow = e.source;
        this.appOrigin = e.origin;
    }

    doSendMessage(message) {
        if (this.appWindow && this.appOrigin) {
            this.appWindow.postMessage(message, this.appOrigin);
        } 
    }

    ngOnInit() {
        this.currentSearch.subscribe((state: CurrentSearch) => {
            this.state = state;
            if (state && state.name && state.name.length > 0) {
                this.disableSearch = false;
                this.errorEmptySearch = false;
                this.youtube.search(state);
                this.videoLoaded = this.state.videoId ? true: false;
                this.doSendMessage(this.prepareMessage(this.videoLoaded));
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
