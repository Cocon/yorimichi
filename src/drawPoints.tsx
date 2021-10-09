import React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as Turf from '@turf/turf';

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

import 'leaflet.vectorgrid';

import {
	RouteData,
	Place,
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
	let latlngList: L.LatLng[] = [];
	routeData.route.forEach(place => {
		// 各ポイントを結んでパスを作るため各地の緯度経度をまとめた配列を作る
		const latlng = new L.LatLng(place.location.latitude, place.location.longitude);
		console.log(place.location);
		latlngList.push(latlng);
		// 各地点にピンを立てる
		const marker = L.marker(latlng).bindPopup(ReactDOMServer.renderToString(<LeafletPopupContent {...place} baseUrl={baseUrl} />));
		marker.addTo(map);
	});

	// 全体が入るように表示領域を変更
	const pointList = latlngList.map(latlng => [latlng.lng, latlng.lat]);
	const center = Turf.getCoord(Turf.center(Turf.points(pointList)));
	map.setView([center[1], center[0]], 10);

	// 各ポイントを通る曲線を描画
	const simpleLine = Turf.lineString(pointList);
	const curve = Turf.bezierSpline(simpleLine);
	// @ts-ignore
	L.vectorGrid.slicer(curve).addTo(map);

	return {
		latLngs: latlngList
	}
}

export default drawPoints;