import json
import time
import os
import re
from boto3 import Session as AWSSession
from requests_aws4auth import AWS4Auth

from gql import gql
from gql.client import Client
from gql.transport.requests import RequestsHTTPTransport

import pandas as pd

import tweepy
from tweepy import StreamingClient, StreamRule

import gensim.models.word2vec as w2v
import multiprocessing
import numpy as np
import sklearn.manifold

APPSYNC_ENDPOINT=os.getenv('APPSYNC_ENDPOINT'),
BEARER_TOKEN=os.getenv('BEARER_TOKEN'),

def make_client():
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }

    aws = AWSSession(aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                     aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                     region_name=os.getenv('AWS_REGION_NAME'))

    credentials = aws.get_credentials().get_frozen_credentials()

    auth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        aws.region_name,
        'appsync',
        session_token=credentials.token,
    )

    transport = RequestsHTTPTransport(url=APPSYNC_ENDPOINT,
                                      headers=headers,
                                      auth=auth)
    client = Client(transport=transport,
                    fetch_schema_from_transport=False)
    return client


# Edited code from Boom Devahastin Na Ayudhya
# Define vectorization function
def vectorize_corpus(keyword_list):    
    
    # Instantiate counter for number of words in keyword_list that exists
    n_words = 0
    
    # Create template for cumulative corpus vector sum
    corpus_vec_sum = np.zeros((1,300))                 
    
    # Scan through each word in list
    for word in keyword_list:
        if word in tweets2vec:                    
            word_vec = tweets2vec.word_vec(word)        
            n_words +=1                                
            corpus_vec_sum = corpus_vec_sum + word_vec 

    # Compute average vector by taking cumulative vector sum and dividing it by number of words traced
    corpus_avg_vec = corpus_vec_sum/n_words
    
    # Squeeze this N-dimensional nested array object into a 1-D array to streamline future processing
    corpus_avg_vec = np.squeeze(corpus_avg_vec)
    
    return(corpus_avg_vec)

def cos_sim(vector_1, vector_2):
    dp = np.dot(vector_1, vector_2)
    magnitude_v1 = np.sqrt(np.dot(vector_1,vector_1))
    magnitude_v2 = np.sqrt(np.dot(vector_2,vector_2))
    return(dp/(magnitude_v1*magnitude_v2))

def text_clean(text):
       
    # removing non-letters
    letters_only = re.sub("[^a-zA-Z]", " ", text)
    
    # converting to lower case, split into individual words
    words = letters_only.lower().split()
        
    # creating a custom list of stopwords then converting it to a set to run faster
    stop_words = ['us', 'http', 'www', 'https', 'com', 'ourselves', 'hers', 'between', 
                  'yourself', 'but', 'there', 'about', 'once', 'during',  
                  'very', 'having', 'with', 'they', 'own', 'an', 'be', 'some', 'for', 'do', 
                  'its', 'yours', 'such', 'into', 'of', 'most', 'itself', 'other', 'off', 
                  'is', 's', 'am', 'or', 'who', 'as', 'from', 'him', 'each', 'the', 
                  'themselves', 'until', 'below', 'are', 'we', 'these', 'your', 'his', 
                  'through', 'don', 'nor', 'me', 'were', 'her', 'more', 'himself', 'this', 
                  'should', 'our', 'their', 'while', 'above', 'both', 'up', 'to', 
                  'ours', 'had', 'she', 'all', 'at', 'any', 'before', 'them', 
                  'same', 'and', 'been', 'have', 'in', 'will', 'does', 'yourselves', 
                  'then', 'that', 'because', 'what', 'over', 'so', 'can', 'did', 
                  'not', 'under', 'he', 'you', 'herself', 'has', 'just', 'where', 
                  'too', 'only', 'myself', 'which', 'those', 'i', 'after', 'few', 'whom', 
                  't', 'being', 'if', 'theirs', 'my', 'against', 'a', 'by', 'doing', 'it', 
                  'further', 'was', 'here', 'than', 'twitter', 'instagram', 'node', 
                  'pic', 'bit', 'ly', 'utm', 'source', 'ts','hi','gh','rt','yr',]
    stops = set(stop_words)
    
    # removing stop words
    meaningful_words = [w for w in words if not w in stops]
    
    # joining the words back into one string separated by space, 
    # and return the result.
    return(" ".join(meaningful_words))

def postcode_test(txt):
    if txt.startswith('RT '):
        txt = txt[3:]
        print("Retweet")
    pattern = r"\b[A-Z\d]{2,}(?: *[A-Z\d]+)*\b"
    match = re.search(pattern, txt)
    if match:
        code=match.group()
    else:
        code=None
    return code


def validate_postcode(tweet_text, postcode, weight):
    try:
        lat, lng = df.loc[postcode]
        # print(f'Valid Postcode found - {postcode} - {lat}, {lng}')
        geo = {
            'COORDINATES': [lng, lat],
            'WEIGHT': weight*100,
            }
    
    except KeyError as exc:
        # print(f'Postcode does not exist - {postcode}')
        geo = None
        return geo
    return geo


def process_text(txt):
    clean_text = text_clean(txt)

    tweet_avg_vec = vectorize_corpus(clean_text)

    out = cos_sim(tweet_avg_vec,power_out_vec)
    on = cos_sim(tweet_avg_vec,not_out_vec)
    score = out - on

    print(f"Out: {out}, On: {on}, Diff: {out - on}")
    if score > 0:
        cut_type = 'PowerOff'
    elif score < 0:
        cut_type = 'PowerOn'
    else:
        cut_type = 'Unknown'
    return cut_type, score


def add_tweet(msg):
    client = make_client()
    power_cut_type, power_cut_value = process_text(msg.text)

    postcode = postcode_test(msg.text)
    if postcode is not None:
        deduced_location_geo = validate_postcode(msg.text, postcode, power_cut_value)
    else:
        deduced_location_geo = None

    params = {
        "text": msg.text,
        "author_id": msg.author_id,
        "conversation_id": msg.conversation_id,
        "created_at": msg.created_at.strftime("%H:%M:%S %d-%m-%Y"),
        "created_at_ttl": int(time.time()),
        "deduced_location_geo": json.dumps(deduced_location_geo),
        "power_cut_type": power_cut_type,
        "power_cut_value": power_cut_value,
    }

    print(f"Params: {params}")
    new_tweet_obj = """
        mutation addTweet($input: CreateTwitterMapV2Input!) {
        createTwitterMapV2(input: $input) {
            id
            text
            author_id
            conversation_id
            created_at
            created_at_ttl
            power_cut_value
            power_cut_type
            deduced_location_geo
        }
        }
    """
    resp = client.execute(gql(new_tweet_obj), variable_values=json.dumps({'input': params}))
    return resp



class TweetPrinterV2(tweepy.StreamingClient):
    def on_tweet(self, tweet):
        # print(f"{tweet.id} {tweet.created_at} ({tweet.author_id}): {tweet.text}")
        print("-"*50)
        print(tweet.text)
        r = add_tweet(tweet)
        print(r)
 

        
##############################################
print("Initialisaing")
df = pd.read_csv('postcode.csv').set_index('postcode')

# Instantiate Word2Vec model
tweets2vec = w2v.Word2Vec(
    sg = 1, # skip-gram train algo
    seed = 42, # Random Number Generator to make results repeatable
    workers = multiprocessing.cpu_count(), # number of threads
    vector_size = 300, # Dimensionality of the hidden layer
    min_count = 3, # how many times the word has to appear to be kept in the vocab.
    window = 7, # size of the window to train words
    sample = 1e-5 # downsampling setting for frequent words
)

tweets2vec = tweets2vec.wv.load("tweets2vec.w2v")

tsne = sklearn.manifold.TSNE(n_components = 2, random_state = 42, perplexity= 70,learning_rate = 150,verbose =1,n_iter=5000)
all_word_vectors_matrix = tweets2vec.vectors
all_word_vectors_matrix_2d = tsne.fit_transform(all_word_vectors_matrix)

#creating our pos/neg keyword lists 

# List of words for legitimate outages
power_out = ['generators','flooding','grid', 'massive',
           'failure','fail','generator','darkness','dark','powers','thunderstorms',
           'major', 'serious', 'surge', 'storm','storms','transformer','power','windstorm',
           'substation', 'alert', 'electrical', 'lights','thunderstorm','street','area',
           'lightning','electricity','poweroutage','delays','nopower','lightsout','battery','hour','day','gone','happened','happening','estimate',
           'candlelight','candle','candles','expect','expected','when','power off', 'off','no','elderly','without', 'power cut', 'please', 'ASAP', 'update', 'houses','house','weather', ]

# List of words for non-legitimate outages (such as internet, Netflix, Facebook, or other service outages)
#not_out = ['lines','whatsapp','broadband','thank', 'great news', 'great', 'news', 'great']
not_out = ['involved','thank','you','on','quickly','amazing','friendly','helpful','pleased','appreciate','thanks','much','back']


#vectorizing the keyword lists
power_out_vec = vectorize_corpus(power_out)
not_out_vec = vectorize_corpus(not_out)

points = pd.DataFrame(
    [
        (word, coords[0], coords[1])
        for word, coords in [
            (word, all_word_vectors_matrix_2d[tweets2vec.key_to_index.get(word)])
            for word in tweets2vec.index_to_key
        ]
    ],
    columns=["word", "x", "y"]
)

points['power_out_cs'] = [cos_sim(tweets2vec.word_vec(word),power_out_vec) for word in points['word']]
points['not_out_cs'] = [cos_sim(tweets2vec.word_vec(word),not_out_vec) for word in points['word']]
points['power_out_label'] = np.where(points['power_out_cs'] >= points['not_out_cs'],'power_out','not_out')

print("Initialisised nlp")

#######################################################################################


printer = TweetPrinterV2(BEARER_TOKEN)
 
# clean-up pre-existing rules
rule_ids = []
result = printer.get_rules()

if result.data is not None:
    for rule in result.data:
        print(f"rule marked to delete: {rule.id} - {rule.value}")
        rule_ids.append(rule.id)
 
if(len(rule_ids) > 0):
    printer.delete_rules(rule_ids)
    printer = TweetPrinterV2(BEARER_TOKEN)
else:
    print("no rules to delete")

usernames = ['@NorthPowergrid']
keywords = f"({' OR '.join(usernames)})"

rule_power = StreamRule(value=keywords)

printer.add_rules(rule_power)

printer.filter(expansions=["author_id", "in_reply_to_user_id", "geo.place_id"],tweet_fields=["created_at", "conversation_id", "geo"])