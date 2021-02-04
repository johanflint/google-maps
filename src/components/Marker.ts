import { StatelessComponent, createElement } from "react";

export interface MarkerProps {
    lat: number;
    lng: number;
    url?: string;
    label?: string;
}

export const Marker: StatelessComponent<MarkerProps> = (props) => {
    if (props.url) {
        const style = { backgroundImage: `url(${props.url})` };

        return createElement("div", {
            className: "widget-google-maps-marker-url",
            style
        });
    } else if (props.label) {
        return createElement("div", { className: "widget-google-maps-marker" },
            createElement("div", { className: "widget-google-maps-marker-label" }, props.label.substring(0, 1)));
    }

    return createElement("div", { className: "widget-google-maps-marker" });
};

Marker.displayName = "Marker";
