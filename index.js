
var System = java.lang.System;

var MilestoneViewModel = com.iota.iri.controllers.MilestoneViewModel

var tracker 			= IOTA.milestoneSolidifier
var tangle 				= IOTA.tangle;
var snapshotProvider 	= IOTA.snapshotProvider;
var snapshotService 	= IOTA.snapshotService;
var ledgerService		= IOTA.ledgerService;
var config 				= IOTA.configuration;

var iri = com.iota.iri;
var Callable = iri.service.CallableRequest;
var Response = iri.service.dto.IXIResponse;
var ErrorResponse = iri.service.dto.ErrorResponse;

var STATE_FILE_NAME = "ledgerState";

/**
 * Gets a copy of the ledger state from the IRI instance
 */
function getLedgerState(){
	return snapshotProvider.getLatestSnapshot().clone();
}

/**
 * Updates the ledger to the supplied index 
 *
 * @param ledgerState The current state of the ledger
 * @param milestoneIndex The index we want to roll back/forward to
 */
function updateLedgerState(ledgerState, milestoneIndex){
	if (ledgerState.getIndex() > milestoneIndex){
		snapshotService.rollBackMilestones(ledgerState, milestoneIndex+1);
	} else if (ledgerState.getIndex() < milestoneIndex){
		snapshotService.replayMilestones(ledgerState, milestoneIndex-1);
	}
}


/*
curl http://localhost:14265 -X POST -H 'X-IOTA-API-Version: 1.4.1' -H 'Content-Type: application/json' -d '{"command": "LedgerState.getState", "milestoneEpoch": "0", "milestoneIndex": ""}'
*/
function getSnapshot(request) {
	var milestoneIndex = parseInt(request['milestoneIndex']);

	if (!milestoneIndex){
		milestoneIndex = snapshotProvider.getLatestSnapshot().getIndex();
	} else if (milestoneIndex < snapshotProvider.getInitialSnapshot().getIndex()){
		return ErrorResponse.create("Milestone index is too old. (min: " + snapshotProvider.getInitialSnapshot().getIndex() + ")");
	} else if (milestoneIndex > tracker.getLatestMilestoneIndex()){
		return ErrorResponse.create("We dont have this milestone yet. (max: " + tracker.getLatestMilestoneIndex() + ")");
	}

	try {
		var ledgerState = getLedgerState();

		if (ledgerState.getIndex() !== milestoneIndex && !snapshotProvider.getLatestSnapshot().isConsistent()){
			return ErrorResponse.create("You cant make a snapshot when the ledger is inconsistent");
		}
		updateLedgerState(ledgerState, milestoneIndex);
		
		//This doesnt allow snapshotting of current 
		//var milestone = MilestoneViewModel.get(tangle, milestoneIndex);
		//var ledgerState = snapshotService.generateSnapshot(tracker, milestone);
		
		if (ledgerState.getIndex() !== milestoneIndex){
			return ErrorResponse.create("Failed to change to milestone");
		} else if (!config.isTestnet() 
				   && snapshotProvider.getLatestSnapshot().getIndex() !== milestoneIndex 
				   && ledgerState.equals(snapshotProvider.getLatestSnapshot())){
			
			return ErrorResponse.create("Nothing changed during updating. Missing StateDiff in database?");
		}

	    return Response.create({
	        index: milestoneIndex,
	        state: ledgerState.getBalances()
	    });
	} catch (exception) {
        return ErrorResponse.create(exception.getCause());
    }
}

API.put("getState", new Callable({ call: getSnapshot }))

