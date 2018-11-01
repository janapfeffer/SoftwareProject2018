## Here JavaScript API

This package contains the following files of HERE maps in order to bundle them within your own project.

* https://js.api.here.com/v3/3.0/mapsjs-core.js
* https://js.api.here.com/v3/3.0/mapsjs-service.js
* https://js.api.here.com/v3/3.0/mapsjs-ui.js
* https://js.api.here.com/v3/3.0/mapsjs-mapevents.js
* https://js.api.here.com/v3/3.0/mapsjs-clustering.js
* https://js.api.here.com/v3/3.0/mapsjs-ui.css


## Usage

After installing the package via npm you can import the different files via
```
import 'here-js-api/scripts/mapsjs-core';
import 'here-js-api/scripts/mapsjs-service';
import 'here-js-api/scripts/mapsjs-ui';
import 'here-js-api/scripts/mapsjs-mapevents';
import 'here-js-api/scripts/mapsjs-clustering';
```


## Maintenance

The API scripts and styles are downloaded automatically via an included Rakefile.
The API version is kept in the file API_VERSION.
Touch or update this file to re-download.
`rake download` starts the download.
