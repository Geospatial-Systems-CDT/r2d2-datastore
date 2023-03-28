This code uses the Twitter API to pull data related to @northpowergrid.

Using the regex function it sorts these into a table which includes a postcode column.

Natural Language Processing techniques - Word2Vec - and - t-SNE dimensionality reduction algorithms then classify the words contained in the tweets to classify the tweets into a tweet being related to a power cut (power_out) and other tweets (not_out). 

The location of the relevant tweet can then be mapped, using the geojson file which has the centroid of the relevant postcode.


INPUT DATA

ukpostcodes.csv - Thanks to nelsonic at https://github.com/dwyl/uk-postcodes-latitude-longitude-complete-csv

Dataset.csv - set of 7,000 tweets containing @northernpowergrid collected using the Twitter API. Further details on Twitter API licensing can be found at https://developer.twitter.com/en/developer-terms/agreement-and-policy

SCRIPTS

power_cut_twitter_analysis.ipynb
