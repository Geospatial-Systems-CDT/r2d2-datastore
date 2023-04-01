# r2d2-datastore
The datastore for the R2D2 project, created as part of Cohort 4's group project

## Datastore Principles
Data will be stored inline with the R2 D2 Project Data Management Plan - stored here for details (link to be provided). Please ensure the following concepts are followed on submission of data:
- Data is stored in an open and accessible format in line with the FAIR principles
- A licence file is provided for any specific data licences
- No personal inforamtion or authentication keys are added to the repository
- Large datasets can be added as a link due to github restrictions

### Data Licences
All data is licenced under its relative Licence file, all data provided in this repository has a open source based licence unless stated in a relevant licence file. For help with licence files, please see the following link - [Adding a licence to a repository](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)

## Analysis Datastore
### Folder Structure
In line with the data management plan analysis data is stored in the following folder structure, in the event of large files, some may not be included or packages in a compressed file format

```bash
├── {Sub Group} - {Analysis name} eg Electricity - Twitter Analysis
│   ├── Readme.md - please provide a suitable readme file/description where possible
│   ├── Input Data
│   │   ├── Any files that could are indexed in the project data register
│   │   ├── *.geojson
│   │   ├── *.shp
│   │   ├── *.*
│   │   ├── licence.md - please provide a suitable licence file where relevant if the data requires a specific standard data licence
│   ├── Scripts
│   │   ├── Any files that perform analysis or transforms of the input data to produce the output data in Python or ArcGIS Pro package files
│   │   ├── *.py
│   │   ├── *.ipynb
│   │   ├── *.aprx
│   ├── Output Data
│   │   ├── Any data that is generated by the analysis scripts, this data will be presented on the [webapp](https://github.com/Geospatial-Systems-CDT/r2d2-dashboard)
│   │   ├── *.geojson
│   │   ├── *.shp
│   │   ├── *.*
│   ├── Write up
│   │   ├── any files or images purtenent to the write up of the analysis, eg latex documents and figures
│   │   ├── *.png
│   │   ├── *.bib
│   │   ├── *.tex
```

## Web Application Datastore
A copy of the source code for the web application is available through this repo, but stored in a different format to the analysis data.

Some files have been modified to remove sensitive data such as api keys before being placed in this public repo.

### TwitterMap
These applications run embeded in cloud systems as embeded docker files but also using AWS services, see TwitterMap Readme (link to be added), as such this is purely source code and the systems that operate these are not included.

### Website [r2d2.systems](https://www.r2d2.systems/)
This is a duplicate of the source code in the [private repo](https://github.com/Geospatial-Systems-CDT/r2d2-dashboard), this has been included to keep the private repo restricted as it is connected to CI/CD pipelines that can modify and rebuild the deployed [website](https://www.r2d2.systems/) and as such at this time is still protected.

### Folder Structure
Folder structure for storage of web application data
```bash
├── Weba Application
│   ├── Readme.md - please provide a suitable readme file/description where possible
│   ├── Website - React JS website hosted by AWS Amplify
│   │   ├── *.*
│   ├── TwitterMap
│   │   ├── Readme.md
│   │   │   ├── Frontend - Files pertaining to the dash web application, hosted in AWS Elastic Beanstalk
│   │   │   │   ├── *.*
│   │   │   ├── Backend - Files pertaining to the retrival, processing and analysis of the twitter data via the Dynamodb database tables and GraphQL API services offered by AWS
│   │   │   │   ├── *.py - The python scripts are embeded in a docker container registered on ECR and implemented in ECS
│   │   │   │   ├── *.* - Additional files for running python scripts
```

Any issues with this please contact any of the project data managers for further details.

