# xhrService
XMLHttpRequest library, write in pure JavaScript.

xhrService is library which base on XMLHttpRequest of JavaScript, it can do various request with simple POST and GET request, such as...
* GET request with automated encode parameter into string and concat it with url.
* POST request with or without upload in same request.
* Handle and encode each parameters into correct form before sent.

Currently, there is only Ionic Framework version, and for now, works only on android, for iOS, its recommend to use Ionic Framework's native plugin like HTTP instead. 

## Note
For uploading to server, as blob, library will assume that one parameter should have only one blob, also for files, library is assume that source of files is from input with type="file" and must pass parameter into function as for example, event.target.files, etc., files from source maybe selected more than one file, library will try to packing it into same parameter.