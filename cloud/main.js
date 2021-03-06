
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
    console.log('Ran cloud function');
    response.success("Hello world!" + (request.params.a + request.params.b));
});

/**
 *  Delete old events
 */
Parse.Cloud.job('delete_expired_events', function(request, status)
{
    // all access
    Parse.Cloud.useMasterKey();

    /** Get the database + set up a query **/
    var DB = Parse.Object.extend("currentFreeFoodsDB");
    var query = new Parse.Query(DB); 

    /** get all the objects with time passed current date **/
    var now = new Date(); // current time
    var currentTime = now.getTime(); // time in MS after January 1st, 1970
    query.lessThan('Expiration', currentTime); // set up to find expired posts

    query.find().then( // find and delete
        function (events) { // events = list of expired events
            var numberOfDeletedEvents = events.length;
            Parse.Object.destroyAll(events, { // destory them
                success: function() { // on success
                    status.success(numberOfDeletedEvents + ' expired event(s) removed.');
                },
                error: function() {   // on failure
                    status.error('Error, expired events are not removed.');
                }
            });
        },
        function (error) { console.log(error); } // error log on find
    ); // end of find
});
