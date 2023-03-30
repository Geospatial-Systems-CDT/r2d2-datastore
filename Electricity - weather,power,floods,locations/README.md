# Electricity - Northern Power Grid & Weather 
The datastore for the R2D2 project, created as part of Cohort 4's group project

## Introduction
One factor that can exacerbate the impact of power cuts is adverse weather conditions, such as heavy rain, strong winds, or extreme temperatures. In recent years, the frequency and severity of extreme weather events have increased, making it even more critical to monitor weather patterns and their potential impact on power infrastructure. In this study, we explore the prospect of monitoring weather conditions during power cuts. 

Data sources like the Northern Power Grid website, WeatherAPI, National Flood Watch, Google Maps have been used to pull in the data. 

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20weather%2Cpower%2Cfloods%2Clocations/Write%20up/7_mapdurham.png"Floods, Power Cuts, wind speeds, Hospitals in Durham")
Floods, wind speeds, in Durham.


Power Cut Statistics.

## Conclusion

Northern power statistics
From studying the nature of the power cuts themselves, we can see that the majority of power cuts are localised fault categories, and cumulatively take as much time as the planned works on the system to resolve. It is to be noted that these entries get modified about every 5 minutes, which is the frequency at which Northern Power Grid updates its entries. 

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20weather%2Cpower%2Cfloods%2Clocations/Write%20up/6-power-hours.png "Power Cut frequency and Counts in the North East")

![alt text](https://github.com/Geospatial-Systems-CDT/r2d2-datastore/blob/main/Electricity%20-%20weather%2Cpower%2Cfloods%2Clocations/Write%20up/power_freq.png "Unique Power Cuts plotted by reason of fault")
Example of a detected incursion in the Metrocentre Area of Newcastle

Additionally, the bulk of the power cuts on those 3 days were from unexpected problems with the cables or equipment, which means that isolating power cut causes for something like a natural disaster might be a bit difficult without corroborating the known power cuts with other forms of data, such as twitter, night time imagery, etc. 
