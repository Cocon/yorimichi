import React from 'react';
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import leaflet from 'leaflet';
import { MousePosition, MousePositionControlProps } from 'leaflet.mouseposition.ts';
import { HeaderMenu } from 'materialui-component-collection';
import drawPoints from './drawPoints';
import {
	RouteData,
	helpMessage
} from './utils';

const config = {
	basemap: {
		name: "OpenStreetMap's Standard tile layer",
		tile: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
		credit: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	},
	center: {
		lng: 135.7484472,
		lat: 35.039672
	},
	zoom: 13
}

const customElement: React.FunctionComponent<MousePositionControlProps> = (
	props
) => {
	return (
		<table>
			<tr>
				<td>Latitude</td>
				<td>{props.latlng.lat}</td>
			</tr>
			<tr>
				<td>Longitude</td>
				<td>{props.latlng.lng}</td>
			</tr>
		</table>
	);
};

const App: React.FunctionComponent = () => {
	const [routeData, setRouteData] = React.useState<RouteData>();
	let parameter: URLSearchParams;
	let map: leaflet.Map;
	let mousePositionBar: MousePosition;
	const mapRef = React.useRef<HTMLDivElement>(null);
	const mapStyle: React.CSSProperties = {
		width: "100%",
		height: "90vh"
	}
	React.useEffect(() => {
		map = leaflet.map(mapRef.current!, {
			center: config.center,
			zoom: config.zoom
		});
		leaflet.tileLayer(config.basemap.tile, {
			attribution: config.basemap.credit,
			id: config.basemap.name,
			detectRetina: true
		}).addTo(map);

		mousePositionBar = new MousePosition({
			position: "topright",
			customComponent: customElement
		}).addTo(map);
		map.on({
			mousemove: event => {
				mousePositionBar.update(event.latlng);
			}
		});
	}, []);
	React.useEffect(() => {
		parameter = new URLSearchParams(window.location.search);
		const url = parameter.get("url");
		if (url != null) {
			const baseUrl = url.split("/").slice(0, -1).join("/") + "/";
			console.log(url);
			(async () => {
				const response: RouteData = await fetch(url).then(result => result.json());
				setRouteData(response);
				drawPoints(response, baseUrl, map);
			})();
		}
	}, [window.location.search]);

	return (
		<React.Fragment>
			<HeaderMenu title={routeData?.title || "Cocon/yorimichi"} helpMessage={helpMessage} />
			<div id="map" ref={mapRef} style={mapStyle}></div>
		</React.Fragment>
	)
}
ReactDOM.render(<App />, document.getElementById("app"));