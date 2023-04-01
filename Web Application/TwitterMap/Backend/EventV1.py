import boto3
import time
import json
from boto3.dynamodb.conditions import Attr
from boto3 import Session as AWSSession
from requests_aws4auth import AWS4Auth
from datetime import timedelta, datetime
import os
from gql import gql
from gql.client import Client
from gql.transport.requests import RequestsHTTPTransport

import numpy as np
from sklearn.cluster import DBSCAN
from sklearn import metrics
import pandas as pd

import shapely
from shapely.geometry import Point
from shapely import geometry
import geopandas as gpd
import math
import uuid

APPSYNC_ENDPOINT=os.getenv('APPSYNC_ENDPOINT')
TwitterMapV2Table=os.getenv('TwitterMapV2Table')


def make_client():
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }

    sesh = AWSSession(aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                     aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                     region_name=os.getenv('AWS_REGION_NAME'))


    credentials = sesh.get_credentials().get_frozen_credentials()

    auth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        sesh.region_name,
        'appsync',
        session_token=credentials.token,
    )

    transport = RequestsHTTPTransport(url=APPSYNC_ENDPOINT,
                                      headers=headers,
                                      auth=auth)
    client = Client(transport=transport,
                    fetch_schema_from_transport=False)
    return client, sesh

client, aws = make_client()

dynamodb = aws.resource('dynamodb')
table = dynamodb.Table(TwitterMapV2Table)

###############################################
def Average(lst):
    return sum(lst) / len(lst)

def min_bounding_circle(points):
    c_x, c_y, dists = [],[],[]
    for cp in points:
        c_x.append(cp[0])
        c_y.append(cp[1])
    centroi = (float(Average(c_x)), float(Average(c_y)))

    for cp in points:
        dists.append(math.dist(cp, [Average(c_x), Average(c_y)]))
    rad = max(dists)
    if rad == 0.0:
        rad = 0.001

    return centroi, rad

def remove_event(event_dict):
    params = {
          'cluster_UUId': event_dict['clusterUUId']
    }
    query = """
            mutation DeleteEvent($deleteevent: DeleteTwitterEventV2Input!) {
              deleteTwitterEventV2(input: $deleteevent) {
                cluster_UUId
              }
            }
        """
    variables_sent = json.dumps({'deleteevent': params})
    # print(f"Params sent: {variables_sent})")
    resp = client.execute(gql(query), variable_values=json.dumps({'deleteevent': params}))
    return resp

def update_event(event_dict):
    params = {
          'cluster_UUId': event_dict['clusterUUId'],
          'cluster_centroid': event_dict['clusterCentroid'],
          'cluster_updated_ttl': event_dict['detected_ttl'],
          'cluster_point': event_dict['cluster_point'],
          'cluster_polygon': event_dict['cluster_polygon'],
          'cluster_radius': event_dict['radius'],
          'cluster_tweets': event_dict['tweets'],
          'cluster_score': event_dict['cluster_score'],
    }
    query = """
        mutation Update($updateevent: UpdateTwitterEventV2Input!) {
          updateTwitterEventV2(input: $updateevent) {
            cluster_UUId
            cluster_centroid
            cluster_updated_ttl
            cluster_point
            cluster_polygon
            cluster_radius
            cluster_score
            cluster_tweets
          }
        }
        """
    variables_sent = json.dumps({'updateevent': params})
    # print(f"Params sent: {variables_sent})")
    resp = client.execute(gql(query), variable_values=json.dumps({'updateevent': params}))
    return resp

def new_event(event_dict):
    params = {
          'cluster_UUId': event_dict['clusterUUId'],
          'cluster_centroid': event_dict['clusterCentroid'],
          'cluster_detected_ttl': event_dict['detected_ttl'],
          'cluster_updated_ttl': event_dict['detected_ttl'],
          'cluster_point': event_dict['cluster_point'],
          'cluster_polygon': event_dict['cluster_polygon'],
          'cluster_radius': event_dict['radius'],
          'cluster_tweets': event_dict['tweets'],
          'cluster_score': event_dict['cluster_score'],
    }
    query = """
    mutation addEvent($eventinput: CreateTwitterEventV2Input!) {
      createTwitterEventV2(input: $eventinput) {
        cluster_score
        cluster_UUId
        cluster_centroid
        cluster_detected_ttl
        cluster_point
        cluster_polygon
        cluster_radius
        cluster_tweets
      }
    }
        """
    variables_sent = json.dumps({'eventinput': params})
    # print(f"Params sent: {variables_sent})")
    resp = client.execute(gql(query), variable_values=json.dumps({'eventinput': params}))
    return resp

def get_events():
    query = """
    query GetEventList {
      listTwitterEventV2s {
        nextToken
        items {
          cluster_UUId
          cluster_centroid
          cluster_detected_ttl
          cluster_point
          cluster_polygon
          cluster_radius
          cluster_tweets
          cluster_score
        }
      }
    }
        """
    resp = client.execute(gql(query))
    return resp


###############################################

# Set the TTL value for the records to retrieve
previous_seconds = 86400
ttl_threshold = int(time.time()) - previous_seconds

response = table.scan(
        FilterExpression=Attr("created_at_ttl").gt(ttl_threshold)
    )

data = response['Items']
while 'LastEvaluatedKey' in response:
    response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'],
                          FilterExpression=Attr("created_at_ttl").gt(ttl_threshold))
    data.extend(response['Items'])


# # Set the start and end datetime value for the records to retrieve
# start_time = int(datetime(2023,3,30,0,0).timestamp())
# end_time   = int(datetime(2023,3,30,2,0).timestamp())

# response = table.scan(
#         FilterExpression=Attr("created_at_ttl").between(start_time, end_time)
#     )

# data = response['Items']
# while 'LastEvaluatedKey' in response:
#     response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'],
#                           FilterExpression=Attr("created_at_ttl").between(start_time, end_time))
#     data.extend(response['Items'])

###############################################

df = pd.json_normalize(data)
df = df[df['deduced_location_geo.WEIGHT'].notna()]
df = df.drop(df[df['deduced_location_geo.COORDINATES'].apply(lambda x: isinstance(x[0], str))].index)

coords = []
weights = []
for x in list(df['deduced_location_geo.COORDINATES']):
    coords.append(x)
    
for x in list(df['deduced_location_geo.WEIGHT']):
    weights.append(x)

# to tune - drop eps to require further clustering
X = np.array(coords)
labels_true = np.array(weights)
db = DBSCAN(eps=0.01, min_samples=5).fit(X)
# db = DBSCAN(eps=0.01, min_samples=50).fit(X, sample_weight=labels_true)
labels = db.labels_

# Number of clusters in labels, ignoring noise if present.
n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
n_noise_ = list(labels).count(-1)
print("-"*50)
print("Calculating Clusters")
print("Estimated number of clusters: %d" % n_clusters_)
print("Estimated number of noise points: %d" % n_noise_)

existing_cluster_resp = get_events()

if n_clusters_ > 0:
    df['cluster'] = labels
    df['clusterId'] = df.apply(lambda x: 0 if x.cluster==-1 else x.cluster+1, axis=1)

    cluster_dict = {}
    unique, counts = np.unique(labels, return_counts=True)

    for x in range(1,n_clusters_+1):
        cluster_dict[x] = {
            'tweets': int(counts[x-1]),
            'clusterId': x,
            'clusterUUId': str(uuid.uuid4())
        }



    for x in cluster_dict:
        cluster_points = df['deduced_location_geo.COORDINATES'].loc[df['clusterId'] == x]
        cluster_score = float(sum(df['deduced_location_geo.WEIGHT'].loc[df['clusterId'] == x]))
        cluster_centroid, radius = min_bounding_circle(cluster_points)
        center = Point(float(cluster_centroid[0]), float(cluster_centroid[1]))
        circle = center.buffer(radius)

        cluster_dict[x]['clusterCentroid'] = str(cluster_centroid)
        cluster_dict[x]['radius'] = float(radius)
        cluster_dict[x]['Point'] = center
        cluster_dict[x]['detected_ttl'] = int(time.time())
        cluster_dict[x]['Polygon'] = circle
        cluster_dict[x]['cluster_polygon'] = gpd.GeoSeries([circle]).to_json()
        cluster_dict[x]['cluster_point'] = gpd.GeoSeries([center]).to_json()
        cluster_dict[x]['cluster_score'] = cluster_score

    # print(cluster_dict)
    ##### Get Clusters
    print("-"*50)
    print("Checking against existing clusters")
    events_to_finish = []

    if len(existing_cluster_resp['listTwitterEventV2s']['items']) == 0:
        for brand_new_cluster_id in cluster_dict:
            cluster_dict[brand_new_cluster_id]['resolution'] = 'new'

    else:
        for evnts in existing_cluster_resp['listTwitterEventV2s']['items']:
            not_found = True
            print(f"Check against existing cluster {evnts['cluster_UUId']}")
            existing_cluster_centroid = eval(evnts['cluster_centroid'])
            existing_cluster_radius = float(evnts['cluster_radius'])
            for new_cluster_id in cluster_dict:
                print(f"--- Detected cluster {new_cluster_id}")
                centroid_distance = math.dist([existing_cluster_centroid[0], existing_cluster_centroid[1]], [eval(cluster_dict[new_cluster_id]['clusterCentroid'])[0], eval(cluster_dict[new_cluster_id]['clusterCentroid'])[1]])

                if centroid_distance < (existing_cluster_radius*1.5):
                    print("----- existing event detected")
                    cluster_dict[new_cluster_id]['clusterUUId'] = evnts['cluster_UUId']
                    cluster_dict[new_cluster_id]['resolution'] = 'update'
                    not_found = False
                elif not_found:
                    print("----- new event detected")
                    cluster_dict[new_cluster_id]['resolution'] = 'new'
                    not_found = False

            if not_found:
                print("----- Event no longer detected")
                events_to_finish.append(evnts['cluster_UUId'])

    print("-"*50)
    print("Sending Updates to database")
    for x in cluster_dict:
        if 'resolution' in cluster_dict[x]:
            
            if cluster_dict[x]['resolution'] == 'update':
                r = update_event(cluster_dict[x])
                print (f"Updated -  {cluster_dict[x]['clusterUUId']}")
            if cluster_dict[x]['resolution'] == 'new':
                r = new_event(cluster_dict[x])
                print (f"New     -  {cluster_dict[x]['clusterUUId']}")
            print(r)

    for ids in events_to_finish:
        delete_dict = {'clusterUUId': ids}
        r = remove_event(delete_dict)

else:
    events_to_finish = []
    for evnts in existing_cluster_resp['listTwitterEventV2s']['items']:
        events_to_finish.append(evnts['cluster_UUId'])

    for ids in events_to_finish:
        delete_dict = {'clusterUUId': ids}
        r = remove_event(delete_dict)
        print (f"Removed -  {ids}")
        print(r)