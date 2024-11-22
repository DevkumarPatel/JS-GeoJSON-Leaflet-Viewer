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
const map = L.map('map').setView([-31.95, 115.85], 14);
const baseLayer = L.tileLayer('http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let currentLayer = null;



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

// Utility function to parse URL query parameters
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Function to display GeoJSON on the map
function displayGeoJSON(geojson) {
    try {
        const parsedGeoJSON = JSON.parse(geojson);

        // Remove existing layer
        if (currentLayer) {
            map.removeLayer(currentLayer);
        }

        // Add new GeoJSON layer
        currentLayer = L.geoJSON(parsedGeoJSON).addTo(map);
        map.fitBounds(currentLayer.getBounds());
    } catch (error) {
        console.error("Invalid GeoJSON:", error.message);
        alert("Invalid GeoJSON provided.");
    }
}

// Check for GeoJSON query parameter
// Check for GeoJSON query parameter
const geojsonParam = getQueryParam('geojson');
if (geojsonParam) {
    try {
        const decodedGeoJSON = decodeURIComponent(geojsonParam);
        editor.setValue(decodedGeoJSON);

        // Beautify the code
        beautifyCode();

        // Display the GeoJSON on the map
        displayGeoJSON(decodedGeoJSON);
    } catch (error) {
        console.error("Error decoding GeoJSON parameter:", error.message);
    }
}


// Listen for editor changes and update map
editor.on('change', () => {
    const geojsonText = editor.getValue();
    displayGeoJSON(geojsonText);
});

// Generate a shareable link with the current GeoJSON
function generateShareLink() {
    const geojsonText = editor.getValue();

    try {
        // Validate the GeoJSON
        const parsedGeoJSON = JSON.parse(geojsonText);

        // Encode the GeoJSON into a query parameter
        const encodedGeoJSON = encodeURIComponent(JSON.stringify(parsedGeoJSON));

        // Get the current domain and path
        const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

        // Create the shareable URL
        const shareableUrl = `${baseUrl}?geojson=${encodedGeoJSON}`;

        // Display the modal with a copy button
        Swal.fire({
            icon: 'success',
            title: 'Shareable Link',
            html: `
                <p>Click the button below to copy the link:</p>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input id="shareable-link" type="text" value="${shareableUrl}" readonly style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 4px;" />
                    <button id="copy-button" style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Copy
                    </button>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            didOpen: () => {
                // Add click event to the Copy button
                document.getElementById('copy-button').addEventListener('click', () => {
                    const linkInput = document.getElementById('shareable-link');
                    linkInput.select();
                    navigator.clipboard.writeText(linkInput.value).then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Copied!',
                            text: 'The link has been copied to your clipboard.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }).catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to copy the link. Please try again.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    });
                });
            }
        });
    } catch (error) {
        // Handle invalid GeoJSON
        showError('Invalid GeoJSON', 'Cannot generate a share link for invalid GeoJSON.');
    }
}

