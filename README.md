# Kibana browser performance test

An experiment using Kibana to monitor Chrome browser performance as part of application testing. The extension based on the [system monitor chrome extension](https://chrome.google.com/webstore/detail/system-monitor/ecmlflnkenbdjfocclindonmigndecla)

Contains a dockerised version of [Kibana 7.7.0](https://www.elastic.co/kibana) and a chrome browser extension that sends cpu, memory and network data to Kibana.


## 1. Spin up Kibana
 
``` bash
docker-compose up
```

Kibana can be accessed from [http://localhost:5601/](http://localhost:5601/)

Elastic can be accessed from [http://localhost:9200/](http://localhost:9200/)

## 2. Add the dashboard to Kibana 

```bash
curl -X POST -H 'Content-Type: application/json' -H 'kbn-xsrf: true' -d @./kibana/dashboard.json http://localhost:5601/api/kibana/dashboards/import
```

## 3 Add the custom extension to Chrome

It's currently configured to post to elasticsearch at ```http://localhost/``` in the ```config.js```.  You can also change the frequency that data is sent to elastic and the name that appears on the Kibana dashboard inside the ```config.js```.  

The chrome-extension must have permission to post to Kibana. If you change config to point to a different, you must update the permissions in the ```manifest.json```.

Build the plugin (into ```dist``` in the ```chrome/extension``` folder):

```bash
cd chrome
yarn start 
``` 

Then:

* Vist ```chrome://extensions/``` in your browser.  
* Toggle the ```Developer mode``` switch on the top right-hand-side.
* Click the ```Load unpacked``` button and and select the ```chrome/extension``` folder.

You should see the ```Kibana system pump (beat)``` extension:
 
![ext](./assets/extension.png)

and the CPU activity extension icon at the top. 

![ext](./assets/icon.png)

## 4 View the data on the Dashboard

The ```Browser Performance``` dashboard can be accessed from [http://localhost:5601/app/kibana#/dashboards](http://localhost:5601/app/kibana#/dashboards)

## Handy docker commands

* `docker ps -aq -f status=exited` ~ list all your stopped containers using
* `docker rm $(docker ps -aq -f status=exited)` ~ remove all your stopped containers
* `docker rm $(docker ps -a -q)` ~ remove all containers
* `docker volume ls` ~ view all volumes
* `docker volume prune` ~ remove unused volumes

## Handy Elastic links and commands

* ```http://localhost:9200/_cat/indices?v``` - see status, size doc-count of all indexes.
* ```curl -X DELETE http://localhost:9200/browser-cpu``` - remove cpu index

## Refs

* https://www.elastic.co/guide/en/kibana/current/tutorial-build-dashboard.html
* https://www.elastic.co/guide/en/kibana/current/tutorial-discovering.html
