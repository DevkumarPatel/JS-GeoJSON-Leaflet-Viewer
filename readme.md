# GeoJSON Leaflet Map Viewer
---

A lightweight web-based tool for visualizing and editing GeoJSON data. This application allows users to paste GeoJSON, beautify it, and render it on an interactive map using **Leaflet** and **CodeMirror**. The interface includes a draggable splitter for adjustable viewing of the map and code editor.

## Features

- **Interactive Map**: Render GeoJSON data on a map with draggable and zoomable functionality powered by **Leaflet**.
- **Code Editor**: A robust JSON editor with syntax highlighting, line numbers, and collapsible sections using **CodeMirror**.
- **Beautify JSON**: Easily format your JSON data with a single click for better readability.
- **Resizable Layout**: Adjust the size of the map and editor dynamically with a draggable splitter.
- **Error Handling**: Displays validation errors for malformed JSON.

## Demo

You can try the live demo [here](#).

## Getting Started

### Prerequisites

To run this project locally, you'll need a modern web browser and a basic local server (optional for enhanced performance).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/geojson-map-viewer.git
   cd geojson-map-viewer
   ```

2. Open the `index.html` file in your browser:
   ```bash
   open index.html
   ```
   Or, serve the files using a local server like **Live Server** in VS Code.

### Folder Structure

```
geojson-map-viewer/
├── index.html       # Main HTML file
├── styles.css       # Custom CSS for styling
├── scripts.js       # Core JavaScript logic
├── README.md        # Documentation
└── assets/          # (Optional) Add custom icons or images here
```

## Usage

1. **Paste GeoJSON**: Copy your GeoJSON data into the editor.
2. **Beautify**: Click the "Beautify" button to format the JSON.
3. **Display on Map**: Click "Display on Map" to render the GeoJSON data on the map.

### Example GeoJSON

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [102.0, 0.5]
      },
      "properties": {
        "name": "Example Point"
      }
    }
  ]
}
```

## Technologies Used

- **[Leaflet](https://leafletjs.com/)**: For interactive maps.
- **[CodeMirror](https://codemirror.net/)**: For a feature-rich JSON editor.
- **[Split.js](https://split.js.org/)**: For resizable panels.

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Submit a pull request.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Author

Developed by **[Devkumar Girishbhai Patel](#DevkumarPatel)**. If you have questions or feedback, feel free to reach out.
