# Snapshot

Copy or clone source code into your `ixi` directory such that it can be found as `ixi/Snapshot/{index.js, package.json}`. 
Your node may be running at this time, and it will hot-load the script. 
After you've cloned it, and with a running iri node, run the following command to get the latest snapshot (note that "milestoneIndex" is optional):

```
curl http://localhost:14265 -X POST -H 'X-IOTA-API-Version: 1.4.1' -H 'Content-Type: application/json'   -d '{"command": "Snapshot.getState", "milestoneIndex":"[some index]"}'
```

-----

#### Troubleshooting:

- Make sure the result `index` matches `latestSolidSubtangleMilestoneIndex`:

```
curl http://localhost:14265 -X POST -H 'X-IOTA-API-Version: 1.4.1' -H 'Content-Type: application/json'   -d '{"command": "getNodeInfo"}'
```

- If not, re-run iri with `--revalidate` flag, this will re-validate all the milestones & build an up-to-date snapshot. after the `latestSolidSubtangleMilestoneIndex` is up-to-date, rerun `Snapshot.getState` API command.

- _it's always best to backup your DB._
