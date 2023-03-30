# Electricity - Northern Power Grid & Weather 
The datastore for the R2D2 project, created as part of Cohort 4's group project

## Introduction
One factor that can exacerbate the impact of power cuts is adverse weather conditions, such as heavy rain, strong winds, or extreme temperatures. In recent years, the frequency and severity of extreme weather events have increased, making it even more critical to monitor weather patterns and their potential impact on power infrastructure. In this study, we explore the prospect of monitoring weather conditions during power cuts. 

Data sources like the Northern Power Grid website, WeatherAPI, National Flood Watch, Google Maps have been used to pull in the data. 

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20Power%20Network%20Satellite%20Analysis/Write%20Up/incursion.png "Concept of an incursion")
Concept of an incursion

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20Power%20Network%20Satellite%20Analysis/Write%20Up/min-heights.png "Minimum Heights around electricitiy networks")
Minimum Heights around electricitiy networks

## Conclusion

Northern power statistics
From studying the nature of the power cuts themselves, we can see that the majority of power cuts are localised fault categories, and cumulatively take as much time as the planned works on the system to resolve. It is to be noted that these entries get modified about every 5 minutes, which is the frequency at which Northern Power Grid updates its entries. 

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20Power%20Network%20Satellite%20Analysis/Write%20Up/incursion%20areas.png "Distribution of Incursion Areas")
Distribution of detected incursion areas

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20Power%20Network%20Satellite%20Analysis/Write%20Up/Weighted%20Ranking%20-%20zoomed%20metrocentre.png "Example of incursion weighted area")
Example of a detected incursion in the Metrocentre Area of Newcastle

Additionally, the bulk of the power cuts on those 3 days were from unexpected problems with the cables or equipment, which means that isolating power cut causes for something like a natural disaster might be a bit difficult without corroborating the known power cuts with other forms of data, such as twitter, night time imagery, etc. 
