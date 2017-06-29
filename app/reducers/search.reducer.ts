import { ActionReducer, Action } from '@ngrx/store';
import { SearchBox } from '../components/search-box.component';
import { AppComponent } from '../app.component';
import { ProximitySelector } from '../components/proximity-selector.component';
import { CurrentSearch } from "../models/current-search.model";

export const SearchReducer: ActionReducer<CurrentSearch> = (state: CurrentSearch, action: Action) => {
    switch (action.type) {
         case SearchBox.StoreEvents.text:
             return {...state, 
                 name: action.payload.text
             };
        case AppComponent.StoreEvents.playVideo:
             return {...state, 
                 videoId: action.payload.videoId
             };
        case AppComponent.StoreEvents.stopVideo:
             return {...state, 
                 videoId: null
            };
         case ProximitySelector.StoreEvents.position:
             return {...state,
                 location: {
                     latitude: action.payload.position.latitude,
                     longitude: action.payload.position.longitude
                 },
                 error: null
             };
         case ProximitySelector.StoreEvents.radius:
             return {...state,
                 radius: action.payload.radius
             };
         case ProximitySelector.StoreEvents.off:
             return {...state, 
                 location: null,
                 error: null
            };
        case ProximitySelector.StoreEvents.error:
            return {...state, 
                error: action.payload.message
            };
        default:
            return state;
    }
};
