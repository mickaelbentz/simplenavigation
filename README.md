# Simple Navigation Web App

This is a simple web-based navigation app that shows the direction to a destination using a compass.

## Features
- **Modern and Intuitive Design**: Clean, responsive interface with smooth animations.
- **Input destination address via text**: Easy-to-use input field with placeholder examples.
- **Autocomplete suggestions for addresses**: Real-time suggestions as you type.
- **Beautiful Compass**: 
  - Clear North, South, East, and West indicators.
  - Elegant directional arrow pointing to your destination.
  - Center circle for better orientation.
- **Distance Display**: Shows the remaining distance to your destination.
- **Paste from Clipboard**: Quickly paste addresses with a single click.
- **Clear Status Messages**: Informative messages for loading, success, and error states.
- **Responsive Design**: Works seamlessly on both mobile and desktop devices.
- **Real-Time Updates**: Automatically updates the direction and distance as you move.
- **Stop Live Updates**: Option to stop the real-time updates with a single click.

## Setup

1. **Clone or Download the Repository**:
   - Clone this repository or download the files to your local machine.

2. **Open the App**:
   - Open the `index.html` file in a web browser.

3. **Allow Location Access**:
   - The app will ask for permission to access your location. Allow it to proceed.

## Usage

1. **Enter Destination Address**:
   - Type the destination address in the text field. Example: `123 Rue de Paris, 75000 Paris`.
   - You can also paste an address from the clipboard by clicking the paste button (📋).

2. **Get Direction**:
   - Click the "Get Direction" button.

3. **View Compass and Distance**:
   - The compass will show the direction to the destination.
   - The distance to the destination will be displayed below the compass.

## Address Format
The app accepts addresses in the following formats:
- `Street Number, Street Name, City` (e.g., `123 Rue de Paris, 75000 Paris`)
- `Street Name, City` (e.g., `Rue de Paris, 75000 Paris`)
- `City, Country` (e.g., `Paris, France`)

## Requirements
- A modern web browser with JavaScript enabled.
- Internet connection for geocoding the address.
- Location services enabled in the browser.

## Notes
- Ensure that location services are enabled in your browser.
- The app uses the OpenStreetMap Nominatim API to convert addresses to coordinates. This is a free service, but it has usage limits. For extensive use, consider using a paid API like Google Maps.

## Testing
To test the app with a specific address, follow these steps:
1. Open the `index.html` file in a web browser.
2. Allow the app to access your location when prompted.
3. Enter the address `12 rue ernestine, 75018 Paris` in the text field.
4. Click the "Get Direction" button.
5. The compass should show the direction to the destination, and the distance should be displayed below.

## License
This project is open-source and free to use.
