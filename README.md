# r2d2-datastore
The datastore for the R2D2 project, created as part of Cohort 4's group project

## r2d2-datastore
Data will be stored inline with the R2 D2 Project Data Management Plan - stored here for details (link to be provided). Please ensure the following concepts are followed on submission of data:
- Data is stored in an open and accessible format in line with the FAIR principles
- A licence file is provided for any specific data licences
- No personal inforamtion or authentication keys are added to the repository
- Large datasets can be added as a link due to github restrictions

### Data Licences
All data is licenced under its relative Licence file, all data provided in this repository has a open source based licence unless stated in a relevant licence file.

### Folder Structure
In line with the data management plan data is stored in the following folder structure, in the event of large files, some may not be included or packages in a compressed file format

```bash
├── {Sub Group} - {Analysis name} eg Electricity - Twitter Analysis
│   ├── Readme.md - please provide a suitable readme file/description where possible
│   ├── Input Data
│   │   ├── Any files that could are indexed in the project data register
│   │   ├── *.geojson
│   │   ├── *.shp
│   │   ├── *.*
│   │   ├── licence.lic - please provide a suitable licence file where relevant if the data requires a specific standard data licence
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
Any issues with this please contact any of the project data managers for further details.

