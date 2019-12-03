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
- Web version
Just do 
``
<script src="xhr.service.js"></script>
``
and you're ready to go. Usage by using xhrService or window.xhrService following by `post`, `get` or `create` function.

- Ionic Framework version
For now, works only on android, for iOS, its recommend to use Ionic Framework's native plugin like HTTP instead. 

## Note
For uploading to server, as blob, library will assume that one parameter should have only one blob, also for files, library is assume that source of files is from input with type="file" and must pass parameter into function as for example, event.target.files, etc., files from source maybe selected more than one file, library will try to packing it into same parameter.