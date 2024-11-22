// Initialize CodeMirror
const editor = CodeMirror(document.getElementById('editor'), {
    mode: { name: "javascript", json: true },
    theme: "material-darker",
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
});

// Initialize the map
const map = L.map('map').setView([-31.95, 115.95], 6);
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let currentLayer = null;

// Add a default base layer (optional fallback)
const defaultBaseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Containers for base and overlay maps
const baseMaps = {};
const overlayMaps = {};


optional_tiles.forEach(source => {
    // Process datasets (base maps)
    source.datasets.forEach(dataset => {
        const tileLayer = L.tileLayer(dataset.endpoint, {
            attribution: dataset.attribution || `Source: <a href="${source.link}" target="_blank">${source.name}</a>`
        });
        baseMaps[dataset.name] = tileLayer; // Add to baseMaps
    });

    // Process overlays
    source.overlays.forEach(overlay => {
        const overlayLayer = L.tileLayer(overlay.endpoint, {
            attribution: overlay.attribution || `Source: <a href="${source.link}" target="_blank">${source.name}</a>`
        });
        overlayMaps[overlay.name] = overlayLayer; // Add to overlayMaps
    });
});

// Add layer control
L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);



// Split.js initialization
const splitInstance = Split(['#map', '#editor'], {
    sizes: [70, 30], // Initial sizes in percentage
    minSize: 30, // Minimum size for both panes
    gutterSize: 8, // Gutter width
    cursor: 'col-resize', // Cursor style
    onDragEnd: () => {
        editor.refresh(); // Refresh CodeMirror
        map.invalidateSize(); // Refresh Leaflet map
    }
});

// Force a "drag" adjustment at start
setTimeout(() => {
    // Adjust sizes programmatically
    splitInstance.setSizes([70, 30]); // Reset to initial sizes
    editor.refresh(); // Ensure CodeMirror is updated
    map.invalidateSize(); // Ensure Leaflet map resizes
}, 100); // Timeout ensures DOM is fully rendered before adjustment

// Beautify JSON
function beautifyCode() {
    try {
        const beautified = JSON.stringify(JSON.parse(editor.getValue()), null, 2);
        editor.setValue(beautified);
    } catch (e) {
        showError('Invalid JSON', e.message);
    }
}

// Convert to FeatureCollection
function convertToFeatureCollection(geojsonData) {
    if (geojsonData.type === 'FeatureCollection') {
        return geojsonData;
    }
    if (geojsonData.type === 'Feature') {
        return { type: 'FeatureCollection', features: [geojsonData] };
    }
    if (['Point', 'MultiPoint', 'LineString', 'MultiLineString', 
         'Polygon', 'MultiPolygon', 'GeometryCollection'].includes(geojsonData.type)) {
        return {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: geojsonData,
                properties: {}
            }]
        };
    }
    throw new Error('Invalid GeoJSON type');
}

// Display GeoJSON on the map
function displayOnMap() {
    try {
        if (currentLayer) {
            map.removeLayer(currentLayer);
        }

        const geojsonData = JSON.parse(editor.getValue());
        if (!geojsonData.type) {
            throw new Error('Invalid GeoJSON format. Must have a "type" property.');
        }

        const featureCollection = convertToFeatureCollection(geojsonData);

        currentLayer = L.geoJSON(featureCollection, {
            style: {
                color: '#2196F3',
                weight: 2,
                opacity: 0.9
            },
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: '#2196F3',
                    color: '#fff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(map);

        map.fitBounds(currentLayer.getBounds());
    } catch (e) {
        showError('Invalid GeoJSON', e.message);
    }
}

// Clear the map
function clearMap() {
    if (currentLayer) {
        map.removeLayer(currentLayer);
        currentLayer = null;
    }
    Swal.fire('Map Cleared', 'All features have been removed from the map.', 'success');
}

// Display errors using SweetAlert2
function showError(title, message) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonText: 'OK'
    });
}
