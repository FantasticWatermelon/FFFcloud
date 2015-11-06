
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
    var currentTime = new Date(); // current time
    query.lessThan('DateEnd', currentTime); // set up to find expired posts

    query.find().then( // find and delete
        function (events) { // events = list of expired events
            Parse.Object.destroyAll(events, { // destory them
                success: function() { // on success
                    status.success('All expired events are removed.');
                },
                error: function() {   // on failure
                    status.error('Error, expired events are not removed.');
                }
            });
        },
        function (error) { console.log(error); } // error log on find
    ); // end of find
});
