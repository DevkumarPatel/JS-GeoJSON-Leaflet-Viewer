// Configuration
const CONFIG = {
    map: {
        defaultView: [-31.95, 115.85],
        defaultZoom: 14,
        defaultTileLayer: 'http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        defaultAttribution: '© OpenStreetMap contributors'
    },
    split: {
        sizes: [70, 30],
        minSize: 30,
        gutterSize: 8
    }
};

// GeoJSON Handler Class
class GeoJSONHandler {
    static convertToFeatureCollection(geojsonData) {
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

    static validate(geojsonString) {
        const parsed = JSON.parse(geojsonString);
        if (!parsed.type) {
            throw new Error('Invalid GeoJSON format. Must have a "type" property.');
        }
        return parsed;
    }
}

// Map Viewer Class
class MapViewer {
    constructor() {
        this.editor = this.initializeEditor();
        this.map = this.initializeMap();
        this.currentLayer = null;
        this.initializeSplitView();
        this.setupTileLayers();
        this.checkUrlParams();
    }

    initializeEditor() {
        return CodeMirror(document.getElementById('editor'), {
            mode: { name: "javascript", json: true },
            theme: "material-darker",
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
    }

    initializeMap() {
        const map = L.map('map').setView(CONFIG.map.defaultView, CONFIG.map.defaultZoom);
        L.tileLayer(CONFIG.map.defaultTileLayer, {
            attribution: CONFIG.map.defaultAttribution
        }).addTo(map);
        return map;
    }

    initializeSplitView() {
        const splitInstance = Split(['#map', '#editor'], {
            sizes: CONFIG.split.sizes,
            minSize: CONFIG.split.minSize,
            gutterSize: CONFIG.split.gutterSize,
            cursor: 'col-resize',
            onDragEnd: () => {
                this.editor.refresh();
                this.map.invalidateSize();
            }
        });

        setTimeout(() => {
            splitInstance.setSizes(CONFIG.split.sizes);
            this.editor.refresh();
            this.map.invalidateSize();
        }, 100);
    }

    setupTileLayers() {
        const baseMaps = {};
        const overlayMaps = {};

        optional_tiles.forEach(source => {
            source.datasets.forEach(dataset => {
                baseMaps[dataset.name] = L.tileLayer(dataset.endpoint, {
                    attribution: dataset.attribution || `Source: <a href="${source.link}" target="_blank">${source.name}</a>`
                });
            });

            source.overlays.forEach(overlay => {
                overlayMaps[overlay.name] = L.tileLayer(overlay.endpoint, {
                    attribution: overlay.attribution || `Source: <a href="${source.link}" target="_blank">${source.name}</a>`
                });
            });
        });

        L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(this.map);
    }

    beautifyCode() {
        try {
            const beautified = JSON.stringify(JSON.parse(this.editor.getValue()), null, 2);
            this.editor.setValue(beautified);
        } catch (e) {
            this.showError('Invalid JSON', e.message);
        }
    }

    displayOnMap() {
        try {
            if (this.currentLayer) {
                this.map.removeLayer(this.currentLayer);
            }

            const geojsonData = GeoJSONHandler.validate(this.editor.getValue());
            const featureCollection = GeoJSONHandler.convertToFeatureCollection(geojsonData);

            this.currentLayer = L.geoJSON(featureCollection, {
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
            }).addTo(this.map);

            this.map.fitBounds(this.currentLayer.getBounds());
        } catch (e) {
            this.showError('Invalid GeoJSON', e.message);
        }
    }

    clearMap() {
        if (this.currentLayer) {
            this.map.removeLayer(this.currentLayer);
            this.currentLayer = null;
        }
        Swal.fire('Map Cleared', 'All features have been removed from the map.', 'success');
    }

    generateShareLink() {
        try {
            const geojsonText = this.editor.getValue();
            const parsedGeoJSON = JSON.parse(geojsonText);
            const encodedGeoJSON = encodeURIComponent(JSON.stringify(parsedGeoJSON));
            const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
            const shareableUrl = `${baseUrl}?geojson=${encodedGeoJSON}`;

            this.showShareModal(shareableUrl);
        } catch (error) {
            this.showError('Invalid GeoJSON', 'Cannot generate a share link for invalid GeoJSON.');
        }
    }

    showShareModal(shareableUrl) {
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
            didOpen: () => this.setupCopyButton()
        });
    }

    setupCopyButton() {
        document.getElementById('copy-button').addEventListener('click', () => {
            const linkInput = document.getElementById('shareable-link');
            linkInput.select();
            navigator.clipboard.writeText(linkInput.value)
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Copied!',
                        text: 'The link has been copied to your clipboard.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                })
                .catch(() => {
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

    showError(title, message) {
        Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonText: 'OK'
        });
    }

    checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const geojsonParam = params.get('geojson');
        
        if (geojsonParam) {
            try {
                const decodedGeoJSON = decodeURIComponent(geojsonParam);
                this.editor.setValue(decodedGeoJSON);
                this.beautifyCode();
                this.displayOnMap();
            } catch (error) {
                console.error("Error decoding GeoJSON parameter:", error.message);
                this.showError('Error', 'Failed to load GeoJSON from URL parameter.');
            }
        }
    }
}

// Initialize the application
const app = new MapViewer();

// Global function bindings
window.beautifyCode = () => app.beautifyCode();
window.displayOnMap = () => app.displayOnMap();
window.clearMap = () => app.clearMap();
window.generateShareLink = () => app.generateShareLink();

