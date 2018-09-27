[![Build Status](https://travis-ci.org/mendixlabs/google-maps.svg?branch=master)](https://travis-ci.org/mendixlabs/google-maps)
[![Dependency Status](https://david-dm.org/mendixlabs/google-maps.svg)](https://david-dm.org/mendixlabs/google-maps)
[![Dev Dependency Status](https://david-dm.org/mendixlabs/google-maps.svg#info=devDependencies)](https://david-dm.org/mendixlabs/google-maps#info=devDependencies)
[![codecov](https://codecov.io/gh/mendixlabs/google-maps/branch/master/graph/badge.svg)](https://codecov.io/gh/mendixlabs/google-maps)
![badge](https://img.shields.io/badge/mendix-7.9.0-green.svg)

# Maps
* Show locations on maps

## Available map types
* Google maps
* Open street maps
* Map box
* Here maps

## Features
* Show location on a map based on coordinates
* Show list of coordinates on the map
* Data sources Context, Static, XPath or Microflow
* Support for Multiple data sources
* Addresses are supported for **Google maps (deperecated)** only
* Support actions when a marker is clicked:
    * Open Page
    * Call Microflow
    * Call Nanoflow
* Customize the display of the marker. If the marker can not be found from the custom markers. The widget will use
the specified custom markers else it will use the widget bundled marker.

## Limitations
* Context and static datasource are Offline capable with Mendix data, however you still need to be online to view the map  
* Addresses are not supported for the **Maps** widget
* For all Map types except **open street maps** you need to have a token inorder to view the map. You can get the tokens from here  
[Mapbox](https://www.mapbox.com)  
[Here maps](https://www.here.com/)  
[Google maps](https://cloud.google.com/maps-platform/)
* The Google maps widget uses [Google Maps API v3](https://developers.google.com/maps/). So the [Limitations](https://developers.google.com/maps/premium/usage-limits)
from Google apply, especially for geocoding. We even advise geocoding your locations within your Mendix application and store them for later use as coordinates on the widget.

## Dependencies
Mendix 7.18.0

## How it Works
This widget consists of two wigdets that is: **Maps** and **Google maps (deprecated)**  
For **Google maps (deprecated)**, see [Google maps](Googlemaps.md)  

* Locations are displayed based on coordinates. if there are multiple locations, the Map will center to a position in which all markers are visible
* If there is one location, the Map will center to that location
* If no locations available, a default center location of the mendix offices is provided in case default center coordinates are not specified
* If autozoom is enabled the Map will use bounds zoom otherwise it will use a custom zoom level specified
* Min Zoom level is 2 and the Maximum is 20

## Demo Project

[https://leafletmaps.mxapps.io/](https://leafletmaps.mxapps.io/)

![Running leaflet maps widget](/assets/maps-google.png)

## Usage
- To add basic a map to your application select **new** under the **Map properties** tab
- Select data source **context** under the **Data source** tab
- Select the **Locations entity**, **latitude** and **longitude** attributes
- Under the **Map properties** tab, select a **Map provider**
- Add Access token if **Map provider** is not **Open street**
- Run the application and add some locations

![Locations](/assets/maps-locations.png)
### Data source: Static
- On the **Map properties** tab, select **new** on the **locations** option
- Select **Static** under **Data source**
- On the **Static** tab add new static locations

![static](/assets/maps-static.png)

### Data source: Xpath
- On the **Map properties** tab, select **new** on the **locations** option
- Select **Database**, Add the **locations** entity
- Add the **Latitude** and **Longitude** attributes
- Add an **XPath Constraint** `Optional`

### Custom Markers
-  It is used to configure how the marker icon should be look.
- Select the **Markers** tab under **locations** option on the **Map properties** tab
- For the **static image** option, upload a static image
- For Dynamic marker images, upload an image into the database to view the map during runtime
- Markers can also be created based on enumeration. An enumeration containing the name and caption of the markers should be created within your project and that enumeration assigned to the `Locations entity`.  
![Markers](/assets/maps-markers.png)  
From the `Marker Images` tab, the enumeration key and image is then specified under `Images`  
![Enumeration markers](/assets/markers.png)

## Issues, suggestions and feature requests
We are actively maintaining this widget, please report any issues or suggestion for improvement at  
[https://github.com/mendixlabs/google-maps/issues](https://github.com/mendixlabs/google-maps/issues).

## Development
See [here](/development.md)
