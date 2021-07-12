import L from 'leaflet';

export interface RouteData {
	title: string
	description?: string
	roadNames?: string[]
	date: DateTime
	updateDate?: DateTime
	route: Place[]
}
export interface DateTime {
	year: number | string
	month: number | string
	day: number | string
	time?: string
}
export interface Location {
	longitude: number
	latitude: number
}
export interface Place {
	name: string
	description: string
	image?: string[]
	location: Location
}

export const calculateCenter = (latLngs: L.LatLng[]): L.LatLng => {
	let a = 0;
	let b = 0;
	latLngs.forEach(x => {
		a = a + x.lat;
		b = b + x.lng;
	});
	const n = latLngs.length;
	return new L.LatLng(a / n, b / n);
}
/*
const mousePosition = L.Control.extend({
	onAdd: () => {
		this._div = L.DomUtil.create('div', 'custom-panel leaflet-bar');
		return this._div;
	},
	onRemove: () => {},
	setContent: (latlng: L.LatLng) => {
		latlng = latlng.wrap();
		this._div.innerHTML =
	}
})
*/

