var iri = com.iota.iri;
var snapshot = IOTA.milestone.latestSnapshot;

var Snapshot = Java.type("com.iota.iri.Snapshot");
var stateField = Snapshot.class.getDeclaredField("state");
stateField.setAccessible(true);

var Callable = iri.service.CallableRequest;
var Response = iri.service.dto.IXIResponse;

function getSnapshot(request) {
    return Response.create({
        index: snapshot.index(),
        state: stateField.get(snapshot)
    });
}

API.put("getState", new Callable({ call: getSnapshot }))
