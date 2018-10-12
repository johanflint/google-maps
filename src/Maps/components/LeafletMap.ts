import { Component, createElement } from "react";
import {
    FeatureGroup,
    LatLngLiteral,
    LeafletEvent,
    Map,
    Marker,
    icon,
    tileLayer
} from "leaflet";
import * as classNames from "classnames";

import { Container, MapUtils } from "../utils/namespace";
import { Shared } from "../utils/sharedConfigs";
import { Alert } from "../../components/Alert";
import MapProps = Container.MapProps;
import DataSourceLocationProps = Container.DataSourceLocationProps;
import Location = Container.Location;
import customUrls = MapUtils.customUrls;
import mapAttr = MapUtils.mapAttr;
import SharedProps = MapUtils.SharedProps;

export interface LeafletMapProps extends SharedProps, MapProps {
    onClickMarker?: (event: LeafletEvent, locationAttr: DataSourceLocationProps) => void;
}

export interface LeafletMapState {
    center: LatLngLiteral;
    alertMessage?: string;
}

export class LeafletMap extends Component<LeafletMapProps, LeafletMapState> {
    private leafletNode?: HTMLDivElement;
    private defaultCenterLocation: LatLngLiteral = { lat: 51.9107963, lng: 4.4789878 };
    private map?: Map;
    private markerGroup = new FeatureGroup();
    readonly state: LeafletMapState = {
        center: this.defaultCenterLocation
    };

    render() {
        return createElement("div", {},
            createElement(Alert, {
                bootstrapStyle: "danger",
                className: "widget-leaflet-maps-alert leaflet-control"
            }, this.props.alertMessage || this.state.alertMessage),
            createElement("div",
                {
                    className: classNames("widget-leaflet-maps-wrapper", this.props.className),
                    style: { ...this.props.divStyles , ...Shared.getDimensions(this.props) }
                },
                createElement("div", {
                    className: "widget-leaflet-maps",
                    ref: this.getRef
                })
            )
        );
    }

    componentDidMount() {
        if (this.leafletNode) {
            this.map = new Map(this.leafletNode, {
                scrollWheelZoom: this.props.optionScroll,
                zoomControl: this.props.optionZoomControl,
                attributionControl: this.props.attributionControl,
                zoom: this.props.zoomLevel,
                minZoom: 2,
                // Work around for page scroll down to botom on first click on map in Chrome and IE
                // https://github.com/Leaflet/Leaflet/issues/5392
                keyboard: false,
                dragging: this.props.optionDrag
            }).addLayer(this.setTileLayer());

        }
    }

    componentWillReceiveProps(newProps: LeafletMapProps) {
        if (this.props.allLocations !== newProps.allLocations) {
            this.setDefaultCenter(newProps);
        }
    }

    componentDidUpdate() {
        if (this.map && !this.props.fetchingData) {
            this.map.panTo(this.state.center);
        }
    }

    componentWillUnmount() {
        if (this.map) {
            this.map.remove();
        }
    }

    private getRef = (node: HTMLDivElement) => {
        this.leafletNode = node;
    }

    private setTileLayer = () => {
        const { mapProvider, mapsToken } = this.props;

        let urlTemplate = "";
        let mapAttribution = "";
        if (mapProvider === "mapBox") {
            urlTemplate = customUrls.mapbox + mapsToken;
            mapAttribution = mapAttr.mapboxAttr;
        } else if (mapProvider === "hereMaps" && mapsToken && mapsToken.indexOf(",") > 0) {
            const splitToken = mapsToken.split(",");
            urlTemplate = customUrls.hereMaps + `app_id=${splitToken[0]}&app_code=${splitToken[1]}`;
            mapAttribution = mapAttr.hereMapsAttr;
        } else {
            urlTemplate = customUrls.openStreetMap;
            mapAttribution = mapAttr.openStreetMapAttr;
        }

        return tileLayer(urlTemplate, {
            attribution: mapAttribution,
            id: mapProvider === "mapBox" ? "mapbox.streets" : undefined
        });
    }

    private setDefaultCenter = (props: LeafletMapProps) => {
        const { defaultCenterLatitude, defaultCenterLongitude, fetchingData } = props;
        if (defaultCenterLatitude && defaultCenterLongitude) {
            this.setState({
                center: {
                    lat: Number(defaultCenterLatitude),
                    lng: Number(defaultCenterLongitude)
                }
            });
        } else if (!fetchingData) {
            this.renderMarkers(props.allLocations);
        }
    }

    private renderMarkers = (locations?: Location[]) => {
        this.markerGroup.clearLayers();
        if (locations && locations.length) {
            locations.forEach(location => this.createMarker(location).then(marker =>
                this.markerGroup.addLayer(marker.on("click", event => {
                    if (this.props.onClickMarker && location.locationAttr) {
                        this.props.onClickMarker(event, location.locationAttr);
                    }
                }))).then(layer => this.map ? this.map.addLayer(layer) : undefined)
                .catch(reason => this.setState({ alertMessage: `${reason}` }))
            );
            this.setBounds();
        } else if (this.map) {
            this.map.removeLayer(this.markerGroup);
        }
    }

    private setBounds = () => {
        setTimeout(() => {
            if (this.map) {
                try {
                    this.map.fitBounds(this.markerGroup.getBounds(), { animate: false }).invalidateSize();
                    if (!this.props.autoZoom) {
                        this.map.setZoom(this.props.zoomLevel, { animate: false });
                    }
                } catch (error) {
                    this.setState({ alertMessage: `Invalid map bounds ${error.message}` });
                }
            }
        }, 0);
    }

    private createMarker = (location: Location): Promise<Marker> =>
        new Promise((resolve, reject) => {
            const { latitude, longitude, url } = location;
            if (location) {
                if (url) {
                    resolve(
                        new Marker([ Number(latitude), Number(longitude) ]).setIcon(icon({
                            iconUrl: url,
                            iconSize: [ 38, 95 ],
                            iconAnchor: [ 22, 94 ],
                            className: "marker"
                        }))
                    );
                } else {
                    resolve(new Marker([ Number(latitude), Number(longitude) ]));
                }
            } else {
                reject("No locations provided");
            }
        })
}
