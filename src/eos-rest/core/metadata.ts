import { IApiCfg, ITypeDef } from '../interfaces/interfaces';
import {TypeExt} from '../clman/typeExt';

declare let System: any;
export let _metadata: Metadata; /* why we need global variable? */
interface IScript {
    src: string;
    loaded: boolean;
    status: string;
}

interface IScriptStore {
    [name: string]: IScript;
}

export class Metadata {
    private _scripts: IScriptStore;
    [key: string]: any;

    constructor(private _cfg: IApiCfg) {
        window['_metadata'] = this;
        this._scripts = {};
        _cfg.metadataJs.forEach((s) => {
            this._scripts[s] = {
                src: s,
                loaded: false,
                status: '',
            };
        });
    }

    public init(): Promise<any> {
        const promises: Promise<any>[] = [];
        console.log('init', this._cfg.metadataJs);
        this._cfg.metadataJs.forEach((s) => {
            promises.push(this._loadScript(s))
        });
        const r = Promise.all(promises);
        r.then(() => {TypeExt.mergeMetadata(this); });
        return r;
    }

    public merge(types: any) {
        Object.keys(types).forEach((t) => {
            const old = this[t];
            if (!old) {
                this[t] = types[t];
            } else {
                old.relations = (old.relations || []).concat(types[t].relations || []);
            }
        });
    }

    etn(item: any) {
        return item.__metadata.__type;
    }

    td(etn: string): ITypeDef {
        return this[etn];
    }

    private _loadScript(name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // resolve if already loaded
            if (this._scripts[name].loaded) {
                resolve({ script: name, loaded: true, status: 'Already Loaded' });
            } else {
                // load script
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = this._scripts[name].src;
                /*
                if (script.readyState) {  // IE
                    script.onreadystatechange = () => {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            this.scripts[name].loaded = true;
                            resolve({ script: name, loaded: true, status: 'Loaded' });
                        }
                    };
                } else
                */ {  // Others
                    script.onload = () => {
                        this._scripts[name].loaded = true;
                        resolve({ script: name, loaded: true, status: 'Loaded' });
                    };
                }
                script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        });
    }
}

