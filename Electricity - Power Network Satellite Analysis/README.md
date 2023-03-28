# Electricity - Power Network Satellite Analysis
The datastore for the R2D2 project, created as part of Cohort 4's group project

## Introduction
Satellite imagery has been utilised for a number of applications around the world. Particularly in times of disaster and recovery from incidents to aid various teams and agencies in responding. Electricity networks have been discussed as requirement for a good human life, while not a human right by demand, as such in the event of a power cut to those that have typical access to it should have it restored to in a timely manner. In the case of a power cut the UK regulator Ofgem states that power must be restored within 12 hours during normal weather or within 24 hours in the case of an abnormal weather event.

Improving the resilience of the power network can lead to significant benefits to customers and the infrastructure manager. Vegetation management is one of the leading causes of power cuts with major incidents in the US caused by poor vegetation management costing $1500 USD per second of disruption for short duration events. Mitigation of this is being explored by UK network providers with one stating investment of £90 million over the next 5 years through data analysis to optimise management activities due to the large geographic distances of power networks over varying terrain. Ability to detect these areas and mitigate the risk to the network critical to reduce the impact particularly to people vulnerable to electrical disturbances

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20Power%20Network%20Satellite%20Analysis/Write%20Up/incursion.png "Concept of an incursion")
Concept of an incursion

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20Power%20Network%20Satellite%20Analysis/Write%20Up/min-heights.png "Minimum Heights around electricitiy networks")
Minimum Heights around electricitiy networks

## Conclusion
This analysis has investigated a method of using satellite data to improve the response of resilience teams in particular improving the resilience of the power network. Identification of use of radar data, in this case LiDAR, to characterise the risk of the network to various objects near the power network that could pose a risk. The methodology makes use of freely accessible open data and sources but could also be applied to other networks quite easily.

The method established creates a risk ranking for both the areas of interest (incursions) but also ranking of the parts of the network with the highest volume of incursions to help prioritise the risk. This is done to make it easier for end users to make decisions to focus on improvements to the network resilience.

235 areas of interest were found with a total area of 4290m\textsuperscript{2} with 29 incursions over 25m\textsuperscript{2} that could be addressed to improve the resilience of the network.

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20Power%20Network%20Satellite%20Analysis/Write%20Up/incursion%20areas.png "Distribution of Incursion Areas")
Distribution of detected incursion areas

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20Power%20Network%20Satellite%20Analysis/Write%20Up/Weighted%20Ranking%20-%20zoomed%20metrocentre.png "Example of incursion weighted area")
Example of a detected incursion in the Metrocentre Area of Newcastle

A number of issues with access to ideal data exist, with the provision of improved network data from the utility provider in particular could add significant value to the analysis possible however use of the high quality LiDAR data could also be applied to other networks such as emergency vehicle access to check for vegetation incursions that may be of a high risk in a storm event and block access to vital emergency vehicle routes.

