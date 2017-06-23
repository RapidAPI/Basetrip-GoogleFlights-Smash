const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI("****", "***************************");
const unirest = require('unirest');

// Get both destination arguements
let destinationFrom = process.argv[2];
let destinationTo = process.argv[3];

// Call Google Flights API first, passing two IATA city codes
rapid.call('GoogleFlightsAPI', 'searchSingleTrip', {
	'apiKey': '*************************',
	'origin': destinationFrom,
	'destination': destinationTo,
	'passengersAdultCount': '1',
	'passengersChildCount': '0',
	'fromDate': '2017-06-20'

}).on('success', (googleFlightsPayload) => {

	// convert IATA destination city code to country code
  rapid.call('IATACodes', 'getCitiesByCodes', {
  	'apiKey': '**********************',
  	'cityCodes': `${destinationTo}`

  }).on('success', (destToCity) => {

		// convert IATA country code to country name
	  rapid.call('IATACodes', 'getCountriesByCodes', {
	    'apiKey': '***********************',
	    'countryCodes': `${destToCity[0].response[0].country_code}`

	    }).on('success', (destToCountry) => {

				// call Basetrip API passing in the country name into the URL
	      unirest.get(`https://thebasetrip.p.mashape.com/v2/countries/${destToCountry[0].response[0].name}`)
	        .header("X-Mashape-Key", "*****************************")
	          .header("Content-Type", "application/json")
	            .header("Accept", "application/json")
	              .end((result) => {

									// Log the Basetrip and GoogleFlights data
	                console.log(result.body, googleFlightsPayload);
	              });
    }).on('error', (err) => {
       throw err;
    });
  }).on('error', (err) => {
  	 throw err;
  });
}).on('error', (err) => {
   throw err;
});
