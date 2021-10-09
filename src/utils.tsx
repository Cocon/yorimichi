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

export const helpMessage = [
	"Cocon/yorimichiを使えば旅の記録を簡単に共有できます。",
	"・JavaScriptに関する知識は一切不要",
	"・画像ファイルと設定ファイル(json)を作成し公開サーバーに設置すればOK",
	"・'https://cocon.github.io/yorimichi?url=' + '設定ファイルのURL'にアクセス"
]