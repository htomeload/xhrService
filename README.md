# xhrService
XMLHttpRequest library, write in pure JavaScript.

xhrService is library which base on XMLHttpRequest of JavaScript, it can do various request with simple POST and GET request, such as...
* GET request with automated encode parameter into string and concat it with url.
* POST request with or without upload file in same request.

It have also have some minor but critical features, for example...
* Simplest receive parameters as one plain object and encode each parameters into correct form before sent.
* Logging every actions from beginning of building request parameters to sending request status.
* Logger can be easy enabled or disabled with set options enableLog into true or false, and can filter some sensitive parameter out from log by add key into sensitiveKeyword with value as true.
* All function is async, so it can do many requests in same time.
* All function return promise, resolve only on success request and reject on any failed case, so there can be sure that function would success request, otherwise, error can be catch.
* On success request, library will handle JSON.parse() before resolve, so, return value can be used right away.

Currently, there is available in Web version and Ionic Framework version.

## Requirement
* JavaScript (.js)
    - Internet Explorer > 10, Google Chrome > 48–55, Mozilla Firefox > 44–50, Microsoft Edge > 14, Opera > 35–42, Apple Safari > 10, SeaMonkey > 2.24–2.30 or higher with JavaScript ES6 supports, or Framework that support JavaScript ES6.

* Ionic Framework (ionic)
    - Ionic Framework >= 3

## Usage
- Web version
    - Just do 

```
<script src="xhr.service.js"></script>
```

and you're ready to go. Usage by using xhrService or window.xhrService following by `post`, `get` or `create` function.

- Ionic Framework version
    - Just import XhrService into page then declare in constructor and you're set.

## Note
For uploading to server, as blob, library will assume that one parameter should have only one blob, also for files, library is assume that source of files is from **input** with **type="file"** and must pass parameter into function as for example, *event.target*, then library will retrive all available in *files* that next from *event.target*, etc., files from source maybe selected more than one file, library will try to packing it into same parameter.

And for Ionic Framework verion, for now, works only on android, for iOS, its recommend to use Ionic Framework's native plugin like HTTP instead. 

## Available functions
- post(route: string, params: object)
    - Create post request, parameter may be empty object({}) if no parameter to sent, object must be in patern key-value format, for kind of value that support is `blob`, `number`, `string`, `file`, `object` and `array`.
    ```bash
    xhrservice.post('/api/login', {username: 'test', password: '******'});
    
    // return: <promise> resolve(data), reject(error)
    ```

- get(route: string, params: object)
    - Create get request, parameter may be empty object({}) if no parameter to sent, object must be in patern key-value format, for kind of value that support is `number`, `string`, `object` and `array`.
    ```bash
    xhrservice.get('/api/book', {searchword: 'cooking'});
    
    // return: <promise> resolve(data), reject(error)
    ```

- create(method: string, route: string, params: object)
    - Alternative function for manually set kind of method to create request, this function will sent route and params into function up to method, support method is `post` and `get`.
    ```bash
    xhrservice.create('post', '/api/login', {username: 'test', password: '******'});
    
    // return: <promise> resolve(data), reject(error)
    ```
    Note: Function will check all parameter is support by request method, for example, if it found file or blob in parameters but method is `get` then function will be aborted and return promise with empty reject().