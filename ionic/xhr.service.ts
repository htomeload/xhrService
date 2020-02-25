import { Injectable } from '@angular/core';

const acceptDataType = {
	'string': true,
	'number': true,
	'boolean': true,
	'bigint': true,
	'object': true,
	'function': false,
	'symbol': false,
	'undefined': false
};
const sensitiveKeyword = {
	'password': true,
	'pass': true,
	'pw': true
};
const options = {
	host: "http://localhost",
	async: true,
	headers: {'Content-Type': 'multipart/form-data'},
	timeout: 15000,
    withCredentials: false,
    enableLog: true
};

@Injectable({
	providedIn: 'root'
})
export class XhrService {
	constructor() { }

	async post(route: string, params: any) {
		try {
			let xhr = new XMLHttpRequest();

			xhr.open("POST", options.host + route, options.async);
			xhr.timeout = options.timeout;
			xhr.withCredentials = options.withCredentials;

            let formData_ = await this._buildFormData(params);

			const promise_ = await new Promise((resolve, reject) => {
				xhr.onerror = (event: any) => {
                    if (options.enableLog) {
                        console.log("XhrService: "+event.target.readyState+";"+event.target.status+" :", event);
                        console.log("XhrService: Error => ", event);
                    }
					reject(event);
				};
				xhr.ontimeout = (event: any) => {
                    if (options.enableLog) {
                        console.log("XhrService: "+event.target.readyState+";"+event.target.status+" :", event);
                        console.log("XhrService: Timeout => ", event);
                    }
					reject(event);
				};
				xhr.onreadystatechange = (event: any) => {
                    if (options.enableLog) {
                        console.log("XhrService: "+event.target.readyState+";"+event.target.status+" :", event);
                    }
					if (event.target.readyState == 4 && event.target.status == 200) {
						if (event.target.response.substr(0, 1) == "{" && event.target.response.substr(event.target.response.length-1, 1) == "}") {
                            if (options.enableLog) {
                                console.log("XhrService: Reponse => ", JSON.parse(event.target.response));
                            }
							resolve(JSON.parse(event.target.response));
						}else{
                            reject(event.target.response);
                        }
					}
                };

				if (formData_){
                    xhr.send(formData_);
                }else{
                    xhr.abort();
                    reject();
                }
			});

			return promise_;
		} catch (error) {
            console.error(error);
            const promise_ = await new Promise((resolve, reject) => {
                reject(error);
            });
            return promise_;
		}
	}

	async get(route: string, params: any) {
		try {
			let xhr = new XMLHttpRequest();

            let paramStr = await this._buildParamStr(params);

            if (options.enableLog) {
                console.log("XhrService: paramStr = "+paramStr);
                console.log("XhrService: Full URL with params URL string = ", options.host + route + "&" + paramStr);
            }
            xhr.open("GET", options.host + route + "&" + paramStr.substr(0, paramStr.length - 1), options.async);
            xhr.timeout = options.timeout;
            xhr.withCredentials = options.withCredentials;

			const promise_ = await new Promise((resolve, reject) => {
                if (paramStr){
                    xhr.onerror = (event: any) => {
                        if (options.enableLog) {
                            console.log("XhrService: "+event.target.readyState+";"+event.target.status+" :", event);
                            console.log("XhrService: Error => ", event);
                        }
                        reject(event);
                    };
                    xhr.ontimeout = (event: any) => {
                        if (options.enableLog) {
                            console.log("XhrService: "+event.target.readyState+";"+event.target.status+" :", event);
                            console.log("XhrService: Timeout => ", event);
                        }
                        reject(event);
                    };
                    xhr.onreadystatechange = (event: any) => {
                        if (options.enableLog) {
                            console.log("XhrService: "+event.target.readyState+";"+event.target.status+" :", event);
                        }
                        if (event.target.readyState == 4 && event.target.status == 200) {
                            if (event.target.response.substr(0, 1) == "{" && event.target.response.substr(event.target.response.length-1, 1) == "}") {
                                if (options.enableLog) {
                                    console.log("XhrService: Reponse => ", JSON.parse(event.target.response));
                                }
                                resolve(JSON.parse(event.target.response));
                            }else{
                                reject(event.target.response);
                            }
                        }
                    };

                    xhr.send();
                }else{
                    xhr.abort();
                    reject();
                }
			});

			return promise_;
		} catch (error) {
			console.error(error);
            const promise_ = await new Promise((resolve, reject) => {
                reject(error);
            });
            return promise_;
		}
	}

	async create(method: string, route: string, params: any) {
		try {
            for(let key of Object.keys(params)) {
                if ((typeof params[key]['files'] !== 'undefined' && params[key]['files'].length > 0) || params[key] instanceof Blob) {
                    if (method == "get" && options.enableLog) {
                        console.warn("XhrService: WARNING => GET request method isn't support for uploading file, aborted function");
                        const promise_ = await new Promise((resolve, reject) => {
                            reject();
                        });
                        return promise_;
                    }
                }
            }

            let res: any;

            switch(method.toLowerCase()) {
                case 'post': {
                    res = await this.post(route, params);
                    break;
                }
                case 'get': {
                    res = await this.get(route, params);
                    break;
                }
            }

            return res;
		} catch (error) {
			console.error(error);
            const promise_ = await new Promise((resolve, reject) => {
                reject(error);
            });
            return promise_;
		}
	}

	private async _buildParamStr(params: any) {
		try {
            let paramStr = "";
            if (options.enableLog) {
                console.log("XhrService: start build params URL string");
            }
			for (let key of Object.keys(params)) {
				if (acceptDataType[typeof params[key]]) {
					if (typeof params[key] === 'object') {
						paramStr += key + "=" + JSON.stringify(params[key]) + "&";
						if (options.enableLog && !sensitiveKeyword[ key ]) {
							console.log("XhrService: paramStr => "+ key + ": "+ typeof params[key] + " = ", params[key]);
						}
					} else if (typeof params[key] !== 'string') {
						paramStr += key + "=" + params[key].toString() + "&";
						if (options.enableLog && !sensitiveKeyword[ key ]) {
							console.log("XhrService: paramStr => "+ key + ": "+ typeof params[key] + " = ", params[key]);
						}
					} else {
                        paramStr += key + "=" + params[key] + "&";
						if (options.enableLog && !sensitiveKeyword[ key ]) {
							console.log("XhrService: paramStr => "+ key + ": "+ typeof params[key] + " = ", params[key]);
						}
                    }
				} else {
					let accTyp = '';
					for (let types of Object.keys(acceptDataType)) {
						if (acceptDataType[types]) {
							accTyp += types + ", ";
						}
					}

					console.error("XhrService: [WrongType]\nIn:\nutilities/formdata.js\n\nFrom:\nformData <<Call>> build\n\nMessage:\nType of value of input [ "+key+" ] is not as accept type. The list of accept type are "+accTyp);
					return false;
				}
			}
			
			return paramStr;
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	private async _buildFormData(params: any) {
		try {
            let formData_ = new FormData();
            if (options.enableLog) {
                console.log("XhrService: start build formData");
            }
			for(let key of Object.keys(params)){
				if (acceptDataType[ typeof params[key] ]){
					if (params[key] instanceof Blob) {
						formData_.append(key, params[key]);
						if (options.enableLog && !sensitiveKeyword[ key ]) {
							console.log("XhrService: append => "+ key + ": Blob = ", params[key]);
						}
					}else if (typeof params[key]['files'] !== 'undefined' && params[key]['files'].length > 0){
                        let files_:any = params[key]['files'];
                        for(let f of files_) {
                            formData_.append(key, f, f.name);
                            if (options.enableLog && !sensitiveKeyword[ key ]) {
                                console.log("XhrService: append => "+ key + ": file = " + f);
                            }
                        }
					}else if (typeof params[key] === 'object'){
						formData_.append(key, JSON.stringify(params[key]));
						if (options.enableLog && !sensitiveKeyword[ key ]) {
							console.log("XhrService: append => "+ key + ": "+ typeof params[key] + " = ", params[key]);
						}
					}else{
						formData_.append(key, params[key]);
						if (options.enableLog && !sensitiveKeyword[ key ]) {
							console.log("XhrService: append => "+ key + ": "+ typeof params[key] + " = " + params[key]);
						}
					}
				}else{
					let accTyp = '';
					for(let types of Object.keys(acceptDataType)){
						if (acceptDataType[ types ]){
							accTyp += types+", ";
						}
					}
	
					console.error("XhrService: [WrongType]\nIn:\nutilities/formdata.js\n\nFrom:\nformData <<Call>> build\n\nMessage:\nType of value of input [ "+key+" ] is not as accept type. The list of accept type are "+accTyp);
					return false;
				}
			}

			return formData_;
		} catch (error) {
			console.error(error);
			return error;
		}
	}
}
