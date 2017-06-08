var snapshot = IOTA.latestSnapshot;

function getSnapshot(request) {
    return Response.create({
        index: snapshot.index(),
        state: snapshot.getState()
    });
}

API.put("getSnapshot", new Callable( call: getSnapshot))