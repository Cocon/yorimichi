import React from 'react';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';

export const MousePositionBar: React.FunctionComponent<{ latlng: L.LatLng }> = (props) => {
	const latlng = props.latlng.wrap();
	return (
		<div>
			<small>{latlng.lat} {latlng.lng}</small>
		</div>
	)
}
export default class MousePosition extends L.Control {
	_div: HTMLElement | null;
	constructor(options?: L.ControlOptions) {
		super(options);
		this._div = null;
	}

	onAdd = (map: L.Map) => {
		this._div = L.DomUtil.create("div", "custom-panel leaflet-bar");
		return this._div;
	}
	onRemove = () => {
		console.log("Bye");
	}
	update = (latlng: L.LatLng) => {
		if (this._div !== null) {
			this._div.innerHTML = ReactDOMServer.renderToString(<MousePositionBar latlng={latlng} />);
		}
	}
}
