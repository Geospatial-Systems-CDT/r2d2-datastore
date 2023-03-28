# Electricity - REST Location Analysis
The datastore for the R2D2 project, created as part of Cohort 4's group project

## Introduction
To identify the key elements of the power network a number of network analysis tools can be used to characterise the behaviour of the network and resilience activities that can be planned or take place around the network.

Understanding of the power distribution networks behaviour through analytical methods can be useful to plan for resilience activities in the event of a power failure or incident.

Utilisation of geospatial information from satellite data can be used to define the physical topology rather than its electrical topology. When augmenting this information with other spatial data an effective resilience plan can be derived or assess and existing plan based on the characterised network to estimate its effectiveness.

The study of network analysis can help researchers to understand the structure and function of complex networks, and to identify important nodes and subgroups that may play key roles in the network's behavior. This data is rarely shared with response teams in order to create resilience plans or incident response standard operating procedures.

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20REST%20Location%20Analysis/write%20up/subsurface-power-network.png "Synthetic Power Network for Newcastle")
Synthetic Power Network for Newcastle used for this analysis

## Conclusion
Analysis of a synthetic power network in Newcastle was performed in order to characterise the network to provide LRF users with further understanding of the network and provide information on how it may behave in the event of an incident.

The results from community detection and centrality calculations were possible to extract and can provide information on the network to the LRF users however further work is required to improve the outputs and incorporate further calculations to assess the current locations of REST centres and potentially optimal locations for these in consideration of the power network to provide faster relief to the community in the event of an incident.

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20REST%20Location%20Analysis/write%20up/community-detection.png "Community Detection")
Community Detection

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20REST%20Location%20Analysis/write%20up/betweenness-centrality.png "Betweenness Centrallity Analysis")
Betweenness Centrallity Analysis

Incorporation of this type of analysis with other factors or networks could provide a multivariate considered analysis of the factors that LRF forces consider when planning the location of the REST centre locations.
