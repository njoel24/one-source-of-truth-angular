import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import {Store, StoreModule} from "@ngrx/store";

import {AppComponent} from "./app.component";
import {YouTubeService} from "./services/youtube.service";
import {ProximitySelector} from "./components/proximity-selector.component";
import {SearchBox} from "./components/search-box.component";
import { YoutubePlayer } from "./components/youtube-player.component";
import { SafePipe } from "./components/safe-pipe.component";
import {SearchReducer} from "./reducers/search.reducer";

const storeManager = StoreModule.provideStore({ currentSearch: SearchReducer });

@NgModule({
    imports:      [ BrowserModule, HttpModule, StoreModule, storeManager ],
    declarations: [ AppComponent, SearchBox, ProximitySelector, YoutubePlayer ],
    bootstrap:    [ AppComponent ],
    providers:    [ YouTubeService, SafePipe ]
})
export class AppModule { }
