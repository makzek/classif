import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

declare var System: any;

/* метаданные сущностей */
var _ES = { Added: "POST", Modified: "MERGE", Deleted: "DELETE" }
var _t = { i: "i", s: "s", d: "d", dt: "dt", dec: "n" };

export interface iTypeDef {
	pk: string;
	properties: any;
	relations: iRelationDef[];
}

export interface iRelationDef {
	name: string;
}

export class ApiCfg {
	dataSrv: string;
	metadataJs: string[];
}

export class MetaData {
	constructor(cfg: ApiCfg) {
		_metadata = this;
		window["_metadata"] = this;
		this.init(cfg.metadataJs);
	}

	public init(paths: string[]) {
		for (let i = 0; i < paths.length; i++)
			System.import(paths[i]);
	}

	public merge(types: any) {
		for (var t in types) {
			var old = _metadata[t];
			if (!old)
				_metadata[t] = types[t];
			else {
				old.relations = (old.relations || []).concat(types[t].relations || []);
			}
		}
	}

	etn(item: any) {
		return item.__metadata.__type;
	}

	td(etn: string): iTypeDef {
		return this[etn];
	}
}

export var _metadata: MetaData;


window["_t"] = _t;

@Injectable()
export class pipRX {
	public SequenceMap: SequenceMap = new SequenceMap();
	constructor(private http: Http, private cfg: ApiCfg) { }

	private getData(url: string) {
		return this.http.get(this.cfg.dataSrv + url)
			.map(r => {
				return r.json().value;
			});
	}

	private makeArgs(args: iKeyValuePair): string {
		var url = "";
		for (var argname in args) {
			var q = "",
				v = args[argname];
			var t = typeof (args[argname]);
			if (t !== "number") {
				q = "'";
				v = t !== "string" ? encodeURIComponent(JSON.stringify(v)) : v;
			}
			url += ["&", argname, "=", q, v, q].join('');
		}
		return url;
	}

	private makeUrls(r: iR, ask: iAsk, ids: any) {
		if (r.url) return [r.url];
		var result = [];
		var url = r.urlParams || "";
		if (r.expand) {
			var exp = r.expand.split(",");
			if (exp.length > 10) {
				r._moreJSON.expand = exp.splice(10, exp.length - 10).join(",");
			}
			url += "&$expand=" + exp.join(",");
		}

		if (ask.criteries)
			//проблема с кириллицей, поэтому escape
			url += "&criteries=" + encodeURIComponent(JSON.stringify(ask.criteries));
		if (ask.args)
			url += this.makeArgs(ask.args);

		if (r.foredit)
			url += "&ForEdit=true";

		if (r.top) url += "&$top=" + r.top.toString();
		if (r.skip) url += "&$skip=" + r.skip.toString();
		if (r.orderby) url += "&$orderby=" + r.orderby;

		if (r._moreJSON)
			url += "&_more_json=" + JSON.stringify(r._moreJSON);

		if (ids !== undefined) {
			var idss = chunkIds(distinctIDS(ids instanceof Array ? ids : [ids]));
			for (var i = 0; i < idss.length; i++)
				result.push([this.cfg.dataSrv, r._et, "/?ids=", idss[i], url].join(""));
		} else
			result.push(this.cfg.dataSrv + r._et + url.replace("&", "?"));
		return result;
	}

	public read<T>(req: iRequest): Observable<T[]> {
		var r = req as iR;
		r._et = Object.keys(req)[0];
		var ask = req[r._et];
		delete req[r._et];
		var a = ask;
		var ids = (a.criteries === undefined && a.args === undefined && a !== AllRows) ? a : undefined;

		var urls = this.makeUrls(r, a, ids);
		return this.odataGet(urls, req);
	}

	//
	private odataGet<T>(urls: string[], req: iRequest): Observable<T[]> {
		var rl = Observable.of(...urls).flatMap(url => {
			return this.http.get(url,
				{ headers: new Headers({ "MaxDataServiceVersion": "3.0", 'Accept': 'application/json;odata=light;q=1,application/json;odata=minimalmetadata;' }) })
				.map(r => {
					try {
						return nativeParser(r.json());
					}
					catch (e) {
						return Observable.throw(new Error(e));
						//return this.errorService.errorHandler({ odataErrors: [e], _request: req, _response: r });
					}
				})
				.catch((err: Response) => {
					let details = err.json();
					return Observable.throw(new Error(details));
				});
		});
		return rl.reduce((acc: T[], v: T[]) => {
			acc.push(...v);
			return acc;
		});
	}

	batch(changeSet: any[], vc: string): Observable<any> {
		if (changeSet.length == 0) return Observable.of([]);
		var d = buildBatch(changeSet);
		return this.http.post(this.cfg.dataSrv + "$batch?" + vc, d,
			{
				headers: new Headers({
					"DataServiceVersion": "1.0", Accept: "multipart/mixed", "Content-Type": "multipart/mixed;boundary=" + batchBoundary,
					"MaxDataServiceVersion": "3.0"
				})
			}).map(r => {
				var answer: any[] = [];
				var e = parseBatchResponse(r, answer);
				if (e)
					return Observable.throw(new Error(e.toString()));
				return answer;
			});
	}

	public prepareAdded<T extends iEnt>(ent:T, typeName:string): T {
		ent.__metadata = { __type: typeName };
		ent._State = _ES.Added;
		return ent;
	}

	
}

interface iKeyValuePair {
	[key: string]: any;
}

interface iRequest extends iKeyValuePair {

	url?: string;
	expand?: string;
	_moreJSON?: any;

	foredit?: boolean;
	reload?: boolean;
	top?: number;
	skip?: number;
	orderby?: string;

	urlParams?: string;

	//	errHandler?: (e) => any;
}

export var AllRows = { ar: true };

interface iAsk {
	ids?: any[];
	criteries?: any;
	args?: any;
	then?: any;
}

interface iR extends iRequest {
	_et: string;
}

function distinctIDS(l: any[]): string {
	var result = ",";
	for (var i = 0; i < l.length; i++) {
		if (l[i] === null) continue;
		var id = typeof (l[i]) !== "string" ? (l[i] + ",") : ("'" + l[i] + "',");
		if (result.indexOf("," + id) === -1) result += id;
	}
	result = result.substr(1, result.length - 2);
	return result;
}
export var URL_LIMIT: number = 1000;

function chunkIds(ids: any): string[] {
	var ss = ids.split(",");
	var result = [""];
	var cp = 0;
	for (var i = 0; i < ss.length; i++) {
		if (result[cp].length > URL_LIMIT) {
			result.push("");
			result[cp] = result[cp].substring(1);
			cp++;
		}
		result[cp] += "," + ss[i];
	}
	result[cp] = result[cp].substring(1);
	return result;
}


function parseMoreJson(item: any, tn: string) {
	item._more_json = JSON.parse(item._more_json);
	var exp = item._more_json.expand;
	if (exp) {
		for (var ln in exp)
			item[ln] = exp[ln];
		delete item._more_json.expand;
	}
}

export function parseEntity(items: any[], tn: string) {
	var t = (tn) ? _metadata[tn] : undefined;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item._more_json)
			parseMoreJson(item, tn);
		for (var pn in item) {
			if (pn.indexOf("@") !== -1 || pn.indexOf(".") !== -1)
				delete item[pn];
			else if (t) {
				var pt = t.properties[pn];
				var pv = item[pn];
				if (pv === null) continue;
				if (pn.lastIndexOf("_List") != -1) {
					var chT = pn.replace("_List", "");
					parseEntity(pv, chT);
				}
			}
		}
		item.__metadata = { __type: tn };
	}
}

function nativeParser(data: any) {
	var md = data["odata.metadata"];
	var tn = md.split("#")[1].split("/")[0];
	var items = data.value || [data];
	parseEntity(items, tn);
	return items;
}


export function criteries(cr: any) {
	return { criteries: cr };
}

export function args(ar: any) {
	return { args: ar };
}

//------------Batch
const batchBoundary = "batch__lima";
var changeSetBoundary = "changeSet__lima";//createBoundary("changeset_");

function buildBatch(changeSets: any[]) {
	var batch = "";
	var i, len;
	batch = ["--" + batchBoundary, "Content-Type: multipart/mixed; boundary=" + changeSetBoundary, ""]
		.join("\r\n");

	for (i = 0, len = changeSets.length; i < len; i++) {
		var it = changeSets[i];
		batch += [
			"", "--" + changeSetBoundary,
			"Content-Type: application/http",
			"Content-Transfer-Encoding: binary",
			"",
			it.method + " " + it.requestUri + " HTTP/1.1",
			"Accept: application/json;odata=light;q=1,application/json;odata=nometadata;",
			"MaxDataServiceVersion: 3.0",
			"Content-Type: application/json",
			"DataServiceVersion: 3.0",
			"",
			it.data ? JSON.stringify(it.data) : ""
		].join("\r\n");
	}

	batch += ["", "--" + changeSetBoundary + "--", "--" + batchBoundary + "--"].join("\r\n");
	return batch;
}

function parseBatchResponse(response: Response, answer: any[]): any[] {
	var dd = response.text().split('--changesetresponse');
	dd.shift();
	dd.pop();
	for (var i = 0; i < dd.length; i++)
		if (dd[i].indexOf("{") != -1)
			dd[i] = dd[i].substr(dd[i].indexOf("{"));
		else
			dd[i] = null;

	var allErr = [];
	for (var i = 0; i < dd.length; i++)
		if (dd[i] !== null) {
			var d = JSON.parse(dd[i]);
			answer.push(d);
			var e = d["odata.error"];
			if (e) allErr.push(e);
			//if (d.TempID) SequenceMap.Fix(d.TempID, d.ID);
		}
	if (allErr.length != 0)
		return allErr;
}

export interface iEnt {
	_State?: string;
	__metadata?: any;
	_orig?: any;
	_more_json?: any;
}

export function changeList(entities: iEnt[]) {
	var startTime = new Date().getTime();

	var chr:any[] = [];
	for (var i = 0; i < entities.length; i++) {
		var it = entities[i];
		appendChange(it, chr, "");
	};
	console.log("changeList " + (new Date().getTime() - startTime));
	return chr;
}

//function IsModified(it: iEnt, orig?: iEnt, propNames?: string[]) {
//	orig = orig || it._orig;
//	if (!orig && it._State === _ES.Added) return true;
//	if (!propNames) {
//		var etn = _metadata.etn(it);
//		var et = _metadata[etn];
//		propNames = et.properties;
//	}
//	if (!propNames) return undefined;

//	for (var pn in propNames) {
//		if (it[pn] === undefined) continue;
//		var v = it[pn];
//		if (orig && v != it._orig[pn])
//			return true;
//	}
//	return false;
//}

function appendChange(it: any, chr: any[], path: string) {
	var etn = _metadata.etn(it);
	var et = _metadata[etn];
	var pkn = et.pk;
	var hasChanges = it._State === _ES.Added || it._State === _ES.Deleted;
	var ch: any = { method: it._State };
	//if (it._State === _ES.Added && !it[pkn])
	//	it[pkn] = SequenceMap.GetTempISN();


	if (it._State === _ES.Added || it._State === _ES.Modified || (!it._State && it._orig)) {
		ch.data = {};

		for (var pn in et.properties) {
			if (et.readonly.indexOf(pn) != -1) continue;
			if (it[pn] === undefined) continue;
			var v = it[pn];
			if (v instanceof Function) v = v();
			if (!it._orig || it._State === _ES.Added || v != it._orig[pn]) {
				ch.data[pn] = v;
				hasChanges = true;
			}
		}
		if (hasChanges && !it._State) ch.method = _ES.Modified;
	}
	if (hasChanges) {
		ch.requestUri = (path.length != 0) ? path : etn;
		if (ch.method != _ES.Added)
			ch.requestUri += PKinfo(it._orig || it);
		chr.push(ch);
	};
	if (et.prepareChange)
		et.prepareChange(it, ch, path, chr);

	if (et.relations && it._State !== _ES.Deleted)
		for (var i = 0; i < et.relations.length; i++) {
			var pr = et.relations[i];
			if (pr.name.indexOf("_List") === -1) continue;
			var l = it[pr.name];
			if (!l) continue;

			for (var j = 0; j < l.length; j++) {
				l[j].__metadata = l[j].__metadata || {};
				l[j].__metadata.__type = pr.__type || pr.name.replace("_List", "");

				if (!l[j].hasOwnProperty(pr.tf))
					l[j][pr.tf] = it[pr.sf];

				appendChange(l[j], chr, combinePath((path ? path : etn) + PKinfo(it._orig || it), pr.name));
			}
		}
}

function combinePath(path: string, s: string) {
	if (path.length != 0) path += "/";
	return path + s;
}

function PKinfo(it: any) {
	var etn = _metadata.etn(it);
	var et = _metadata[etn];
	var v = it[et.pk];
	return (et.properties[et.pk] === _t.s) ? ("('" + v + "')") : ("(" + v + ")");
};

export class SequenceMap {
	private nextIsn: number = -20000;
	private fixed: any = {};

	GetTempISN = function () {
		return ++this.nextIsn;
	}

	GetFixed(tempID:any) {
		return this.fixed[tempID];
	}
	Fix(tempID:any, id:any) {
		this.fixed[tempID] = id;
	}
}


function clone<T>(o: T): T {
	var r = <T>{};
	for (var pn in o)
		r[pn] = o[pn];
	return r;
}

export function prepareForEdit<T extends iEnt>(it: T) {
	if (it._State !== _ES.Added && !it._orig)
		it._orig = clone(it);
}

