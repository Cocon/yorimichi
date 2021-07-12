import React from 'react';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
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
					return <img src={props.baseUrl + image} />
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

interface fetchDataReturns {
	latLngs: L.LatLng[]
}

const fetchData = async (url: string, map: L.Map): Promise<fetchDataReturns> => {
	const routeData: RouteData = await fetch(url).then(result => result.json());
	console.log(routeData.title);
	let latlngs: L.LatLng[] = [];
	routeData.route.forEach(place => {
		// 各ポイントを結んでパスを作るため各地の緯度経度をまとめた配列を作る
		const latlng = new L.LatLng(place.location.latitude, place.location.longitude);
		console.log(place.location);
		latlngs.push(latlng);
	});
	// 全体が入るように表示領域を変更
	//map.setView(calculateCenter(latlngs), 10);
	// leaflet.polyline.snakeanimを使って動くパスを描画
	// @ts-ignore
	const path = L.polyline(latlngs, { snakingSpeed: 2000 });
	// @ts-ignore
	path.addTo(map).snakeIn();
	return {
		latLngs: latlngs
	}
}

export default fetchData;