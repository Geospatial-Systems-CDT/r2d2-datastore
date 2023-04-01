import dash
import dash_bootstrap_components as dbc
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
from dash_bootstrap_templates import load_figure_template
import json
import pandas as pd
import geopandas as gpd
import plotly.express as px
import time
import os

from boto3.dynamodb.conditions import Attr
from boto3 import Session as AWSSession
from requests_aws4auth import AWS4Auth
from datetime import timedelta, datetime

from gql import gql
from gql.client import Client
from gql.transport.requests import RequestsHTTPTransport


import numpy as np
import geopandas as gpd


APPSYNC_ENDPOINT = os.getenv('APPSYNC_ENDPOINT')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION_NAME = os.getenv('AWS_REGION_NAME')

app = dash.Dash(external_stylesheets=[dbc.themes.SOLAR])
application = app.server

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


def make_client():
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }

    sesh = AWSSession(aws_access_key_id=AWS_ACCESS_KEY_ID,
                     aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                     region_name=AWS_REGION_NAME)

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


def check_for_events():
    print('Check for Events')
    event_pull = get_events()
    if len(event_pull['listTwitterEventV2s']['items']) > 0:
        return event_pull
    else: 
        return False

def process_events(event_data):
    print('Process Events')
    events = {}
    for x in event_data['listTwitterEventV2s']['items']:
        print(x['cluster_UUId'])
        events[x['cluster_UUId']] = x

    events_col = ['created_at_ttl', 'created_at', 'author_id', 'power_cut_value', 'conversation_id', 'deduced_location_geo', 'text', 'id', 'power_cut_type', 'deduced_location_geo.WEIGHT', 'deduced_location_geo.COORDINATES']
    events = pd.DataFrame.from_dict(events, orient='index', columns=events_col)
    events = events.reset_index().drop('index', axis=1)

    events_gdf = []
    for x in event_data['listTwitterEventV2s']['items']:
        events_gdf.append(json.loads(x['cluster_polygon'])["features"][0])

    g_events = gpd.GeoDataFrame.from_features(events_gdf)
    g_events = g_events.merge(events, left_index=True, right_index=True)

    g_events.reset_index()
    return g_events

def check_for_tweets():
    print('Check for Tweets')
    dynamodb = aws.resource('dynamodb')
    table = dynamodb.Table('TwitterMapV2Table')
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

    if len(data) > 0:
        return data
    else: 
        return False

def process_tweets(tweetdata):
    print('Process Tweets')
    df = pd.json_normalize(tweetdata)
    df = df[df['deduced_location_geo.WEIGHT'].notna()]
    df = df.drop(df[df['deduced_location_geo.COORDINATES'].apply(lambda x: isinstance(x[0], str))].index)

    df['latitude'] = df.apply(lambda row : row['deduced_location_geo.COORDINATES'][1], axis = 1)
    df['longitude'] = df.apply(lambda row : row['deduced_location_geo.COORDINATES'][0], axis = 1)
    df['deduced_location_geo.WEIGHT'] = df.apply(lambda row : float(row['deduced_location_geo.WEIGHT']), axis = 1)

    g_points = gpd.GeoDataFrame(
        df, geometry=gpd.points_from_xy(df.longitude, df.latitude))

    print("data reloaded")
    return g_points

##############################################################################################
load_figure_template('solar')
df_history = gpd.read_file('history.geojson')
df_history['z_score'] = 1

# Set Mapbox API key
token = os.getenv('MAPBOX_TOKEN')

app.layout = dbc.Container(
                children = [
                    html.H1("Live Twitter Map"),
                    html.H2('Red Dots are historical tweets to @Northernpowergrid from 2021 and 2022, Yellow Dots are recent ones in last 24 hours, if cluster is detected they will be shown as a circle around the recent tweets'),
                    html.Hr(),
                    html.H2(id='live-update-text'),
                    dbc.Row(
                        dcc.Graph(id="live-update-graph"), style={'height': '90vh'}
                        ),
                        
                        dcc.Interval(
                        id='interval-component',
                        interval=30*1000, # in milliseconds
                        n_intervals=0
                    )
                ],
                fluid=True,
)



@app.callback(Output('live-update-text', 'children'),
              Input('interval-component', 'n_intervals'))
def update_title(n):
    last_update_text = datetime.now().strftime("%H:%M:%S")
    style = {'padding': '5px', 'fontSize': '16px'}
    return [
        html.Span(f'Last Update: {last_update_text}', style=style)
    ]



@app.callback(Output('live-update-graph', 'figure'),
              Input('interval-component', 'n_intervals'))
def update_graph_live(n):
    print(f'{n} - {datetime.now().strftime("%H:%M:%S")} - Relead')

    print('Loading Initial Map')
    fig = px.scatter_mapbox(df_history,
                            lat=df_history.geometry.y,
                            lon=df_history.geometry.x,
                            hover_name="Postcode",
                            color_discrete_sequence=['darkred'],
                            text='Postcode',
                            opacity=0.2,
                            # center={"lat": 54.433, "lon": -1.829}, zoom=8,
                            size_max=2)

    fig.update_layout(
        margin={"r":0,"t":30,"l":0,"b":0},
        mapbox_accesstoken=token,
        mapbox_style="dark") #carto-positron
    fig.update_layout(mapbox_bounds={"west": -5, "east": 2, "south": 52, "north": 56})



    events_exist = check_for_events()
    if events_exist != False:
        gdf_events = process_events(events_exist)
        fig_events = px.choropleth_mapbox(
                                gdf_events,
                                geojson=gdf_events.geometry,
                                color=gdf_events.cluster_score,
                                locations=gdf_events.index,
                                opacity=0.5,
                                color_discrete_sequence=['green'],
                                # center={"lat": 55.1373, "lon": -1.7386}, zoom=9,
                                # range_color=[0, 100],
                                color_continuous_scale=px.colors.cyclical.IceFire,
                                )
        fig.add_trace(fig_events.data[0])

    tweets_exist = check_for_tweets()
    if tweets_exist != False:
        gdf_points = process_tweets(tweets_exist)
        fig_points = px.scatter_mapbox(gdf_points,
                                lat=gdf_points.geometry.y,
                                lon=gdf_points.geometry.x,
                                hover_name="text",
                                color=gdf_points.power_cut_type,
                                size=gdf_points['deduced_location_geo.WEIGHT'],
                                size_max=10)
        fig.add_trace(fig_points.data[0])

    return fig



if __name__ == '__main__':
    application.run(debug=True, port=8080)