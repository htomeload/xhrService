((window) => {
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

    XhrService = () => {
        let xhr_ = {};

        xhr_.post = async (route, params) => {
            try {
                const promise_ = await new Promise((resolve, reject) => {
                    let xhr = new XMLHttpRequest();

                    xhr.open("POST", options.host + route, options.async);
                    xhr.timeout = options.timeout;
                    xhr.withCredentials = options.withCredentials;

                    xhr.onerror = (event) => {
                        if (options.enableLog) {
                            console.log("XhrService: "+event.target.readyState+";"+event.target.status+" :", event);
                            console.log("XhrService: Error => ", event);
                        }
                        reject(event);
                    };
                    xhr.ontimeout = (event) => {
                        if (options.enableLog) {
                            console.log("XhrService: "+event.target.readyState+";"+event.target.status+" :", event);
                            console.log("XhrService: Timeout => ", event);
                        }
                        reject(event);
                    };
                    xhr.onreadystatechange = (event) => {
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

                    _buildFormData(params).then((formData_) => {
                        if (formData_){
                            xhr.send(formData_);
                        }else{
                            xhr.abort();
                            reject();
                        }
                    }, (error) => {
                        reject(error);
                    }).catch((error) => {
                        reject(error);
                    });
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

        xhr_.get = async (route, params) => {
            try {
                const promise_ = await new Promise((resolve, reject) => {
                    let xhr = new XMLHttpRequest();

                    this._buildParamStr(params).then((paramStr) => {
                        if (paramStr){
                            if (options.enableLog) {
                                console.log("XhrService: paramStr = "+paramStr);
                                console.log("XhrService: Full URL with params URL string = ", options.host + route + "&" + paramStr);
                            }
                            xhr.open("GET", options.host + route + "&" + paramStr.substr(0, paramStr.length - 1), options.async);
                            xhr.timeout = options.timeout;
                            xhr.withCredentials = options.withCredentials;
        
                            xhr.onerror = (event) => {
                                if (options.enableLog) {
                                    console.log("XhrService: "+event.target.readyState+";"+event.target.status+" :", event);
                                    console.log("XhrService: Error => ", event);
                                }
                                reject(event);
                            };
                            xhr.ontimeout = (event) => {
                                if (options.enableLog) {
                                    console.log("XhrService: "+event.target.readyState+";"+event.target.status+" :", event);
                                    console.log("XhrService: Timeout => ", event);
                                }
                                reject(event);
                            };
                            xhr.onreadystatechange = (event) => {
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
                    }, (error) => {
                        reject(error);
                    }).catch((error) => {
                        reject(error);
                    });
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

        xhr_.create = async (method, route, params) => {
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

                switch(method.toLowerCase()) {
                    case 'post': {
                        return this.post(route, params);
                    }
                    case 'get': {
                        return this.get(route, params);
                    }
                }
            } catch (error) {
                console.error(error);
                const promise_ = await new Promise((resolve, reject) => {
                    reject(error);
                });
                return promise_;
            }
        }

        _buildParamStr = async (params) => {
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
        
        /**
         * @param Object params - plain object to convert into formData object.
         * @return FormData object.
         */
        _buildFormData = async (params) => {
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
                            let files_ = params[key]['files'];
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
        
        return xhr_;
    }

    if (typeof window.xhrService === "undefined") {
        window.xhrService = XhrService();
    }
})(window);
