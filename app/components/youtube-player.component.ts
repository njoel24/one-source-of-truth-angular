import { Pipe, PipeTransform, OnInit, Component, Input } from '@angular/core';
import {Store} from '@ngrx/store';
import {CurrentSearch} from "../models/current-search.model";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SafePipe} from "./safe-pipe.component";


@Component({
    selector: 'youtube-player',
    template: `
    <iframe width="420" height="345" [src]="url">
    </iframe>
    `
})

export class YoutubePlayer implements OnInit  {

    private url: SafeResourceUrl;

    constructor (private safe: SafePipe) {
    }
        
    @Input()
        store: Store<any>;        

    ngOnInit() {
        this.store.subscribe((state: any) => {
            if(state.currentSearch && state.currentSearch.videoId) {
                const dynamicUrl = "https://www.youtube.com/embed/"+state.currentSearch.videoId+"?autoplay=1";
                this.url =  this.safe.transform(dynamicUrl);
            }
        });
    }
}
