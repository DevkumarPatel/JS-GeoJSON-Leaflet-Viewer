// borrowed from https://github.com/alexurquhart/free-tiles/blob/master/App.js
optional_tiles = [
    {
      "name":"OpenStreetMap",
      "link":"http://openstreetmap.org",
      "datasets":[
        {
          "name":"OSM Mapnik",
          "endpoint":"http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        },
        {
          "name":"OSM Humanitarian",
          "endpoint":"http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        },
        {
          "name":"OSM Landscape",
          "endpoint":"http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png"
        }
      ],
      "overlays":[
  
      ]
    },
    {
      "name":"ESRI",
      "link":"http://services.arcgisonline.com/arcgis/rest/services",
      "datasets":[
        {
          "name":"Dark Gray Base",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"Light Gray Base",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Hillshade",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Ocean Base",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"DeLorme World Base Map",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Street Map",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Navigation Charts",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Specialty/World_Navigation_Charts/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"National Geographic",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Imagery",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Physical Map",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Shaded Relief",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Terrain",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Topo Map",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        }
      ],
      "overlays":[
        {
          "name":"Dark Gray Reference",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"Light Gray Reference",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Ocean Reference",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Boundaries & Places",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Reference Overlay",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}"
        },
        {
          "name":"World Transportation",
          "endpoint":"http://services.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
        }
      ]
    },
    {
      "name":"CartoDB",
      "link":"https://cartodb.com/basemaps/",
      "datasets":[
        {
          "name":"Positron",
          "endpoint":"http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        },
        {
          "name":"Dark Matter",
          "endpoint":"http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        },
        {
          "name":"Positron (No Labels)",
          "endpoint":"http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        },
        {
          "name":"Dark Matter (No Labels)",
          "endpoint":"http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
        }
      ],
      "overlays":[
        {
          "name":"Positron Labels",
          "endpoint":"http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
        },
        {
          "name":"Dark Matter Labels",
          "endpoint":"http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png"
        }
      ]
    },
    {
      "name":"Stamen",
      "link":"http://maps.stamen.com",
      "datasets":[
        {
          "name":"Toner",
          "endpoint":"http://tile.stamen.com/toner/{z}/{x}/{y}.png",
          "attribution":"Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, under <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. Data by <a href=\"http://openstreetmap.org\">OpenStreetMap</a>, under <a href=\"http://www.openstreetmap.org/copyright\">ODbL</a>."
        },
        {
          "name":"Terrain",
          "endpoint":"http://tile.stamen.com/terrain/{z}/{x}/{y}.png"
        },
        {
          "name":"Watercolor",
          "endpoint":"http://tile.stamen.com/watercolor/{z}/{x}/{y}.png"
        }
      ],
      "overlays":[
  
      ]
    },
    {
      "name":"Mapbox",
      "link":"http://a.tiles.mapbox.com/v3/mapbox/maps.html",
      "datasets":[
        {
          "name":"Blue Marble (January)",
          "endpoint":"https://{s}.tiles.mapbox.com/v3/mapbox.blue-marble-topo-bathy-jan/{z}/{x}/{y}.png"
        },
        {
          "name":"Blue Marble (July)",
          "endpoint":"https://{s}.tiles.mapbox.com/v3/mapbox.blue-marble-topo-bathy-jul/{z}/{x}/{y}.png"
        },
        {
          "name":"Blue Marble Topo & Bathy B/W (July)",
          "endpoint":"https://{s}.tiles.mapbox.com/v3/mapbox.blue-marble-topo-bathy-jul-bw/{z}/{x}/{y}.png"
        },
        {
          "name":"Control Room",
          "endpoint":"https://{s}.tiles.mapbox.com/v3/mapbox.control-room/{z}/{x}/{y}.png"
        },
        {
          "name":"Geography Class",
          "endpoint":"https://{s}.tiles.mapbox.com/v3/mapbox.geography-class/{z}/{x}/{y}.png"
        },
        {
          "name":"World Dark",
          "endpoint":"https://{s}.tiles.mapbox.com/v3/mapbox.world-dark/{z}/{x}/{y}.png"
        },
        {
          "name":"World Light",
          "endpoint":"https:{s}.tiles.mapbox.com/v3/mapbox.world-light/{z}/{x}/{y}.png"
        },
        {
          "name":"World Glass",
          "endpoint":"https:{s}.tiles.mapbox.com/v3/mapbox.world-glass/{z}/{x}/{y}.png"
        },
        {
          "name":"World Print",
          "endpoint":"https:{s}.tiles.mapbox.com/v3/mapbox.world-print/{z}/{x}/{y}.png"
        },
        {
          "name":"World Blue",
          "endpoint":"https:{s}.tiles.mapbox.com/v3/mapbox.world-blue/{z}/{x}/{y}.png"
        }
      ],
      "overlays":[
  
      ]
    }
  ]