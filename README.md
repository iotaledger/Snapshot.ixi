# Snapchot

Copy or clone source code into your `ixi` directory such that it can be found as `ixi/Snapchot/{index.js, package.json}`. 
Your node may be running at this time, and it will hot-load the script. 
After you've cloned it, and with a running iri node, run the following command to get the latest snapshot:

```
curl http://localhost:14265 -X POST -H 'Content-Type: application/json'   -d '{"command": "Snapchot.getState"}'
```
