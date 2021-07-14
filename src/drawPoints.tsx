import React from 'react';
import ReactDOMServer from 'react-dom/server';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
L.Marker.prototype.options.icon = L.icon({
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
	iconSize: [20, 26],
	shadowSize: [20, 26],
	iconAnchor: [10, 25],
	shadowAnchor: [10, 25],
	popupAnchor: [0, -25],
})

import 'leaflet.polyline.snakeanim';
import {
	RouteData,
	Place,
	calculateCenter
} from './utils';

interface LeafletPopupContentProps extends Place {
	baseUrl: string
}
const LeafletPopupContent: React.FunctionComponent<LeafletPopupContentProps> = (props) => {
	return (
		<React.Fragment>
			<div>
				{props.image !== undefined && props.image.map(image => {
					return <img src={props.baseUrl + image} width="100%" />
				})}
			</div>
			<div>
				<h1>{props.name}</h1>
				<p>{props.description}</p>
				<small>{Object.values(props.location).join(",")}</small>
			</div>
		</React.Fragment>
	)
}

interface drawPointsReturns {
	latLngs: L.LatLng[]
}

const drawPoints = (routeData: RouteData, baseUrl: string, map: L.Map): drawPointsReturns => {
	console.log(routeData.title);
	let latlngs: L.LatLng[] = [];
	routeData.route.forEach(place => {
		// 各ポイントを結んでパスを作るため各地の緯度経度をまとめた配列を作る
		const latlng = new L.LatLng(place.location.latitude, place.location.longitude);
		console.log(place.location);
		latlngs.push(latlng);
		// 各地点にピンを立てる
		const marker = L.marker(latlng).bindPopup(ReactDOMServer.renderToString(<LeafletPopupContent {...place} baseUrl={baseUrl} />));
		marker.addTo(map);
	});

	// 全体が入るように表示領域を変更
	map.setView(calculateCenter(latlngs), 10);

	// leaflet.polyline.snakeanimを使って動くパスを描画
	// @ts-ignore
	const path = L.polyline(latlngs, { snakingSpeed: 2000 });
	// @ts-ignore
	path.addTo(map).snakeIn();

	return {
		latLngs: latlngs
	}
}

export default drawPoints;