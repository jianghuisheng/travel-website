import React, {Component} from 'react';
import { Map, Marker } from 'react-amap';
import  './MyMap.css';
class MyMap extends Component {
    constructor() {
        super();
        this.amapEvents = {
            created: (mapInstance) => {
                console.log(mapInstance.getZoom());
            }
        };
        this.markerEvents = {
            created: (markerInstance) => {
                console.log(markerInstance.getPosition());
            }
        };
        this.markerPosition = { longitude:120, latitude:30};
    }
    render() {
        return <div style={{ width: '100%', height: '100%' }}>
            <Map events={this.amapEvents}>
                <Marker position={this.markerPosition} events={this.markerEvents} />
            </Map>
        </div>
    }
}
export default MyMap;