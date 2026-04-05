document.addEventListener('DOMContentLoaded', function() {
    const addressInput = document.getElementById('addressInput');
    const getDirectionButton = document.getElementById('getDirectionButton');
    const compass = document.getElementById('compass');
    const distanceElement = document.getElementById('distance');

    let currentPosition = null;
    let destinationPosition = null;

    // Get the user's current location and watch for updates
    let watchId = null;
    
    if (navigator.geolocation) {
        // Get initial position
        navigator.geolocation.getCurrentPosition(function(position) {
            currentPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
        }, function(error) {
            console.error('Error getting location:', error);
            statusMessage.textContent = '❌ Error getting location: ' + error.message;
            statusMessage.className = 'status-message error';
            setTimeout(function() {
                statusMessage.className = 'status-message';
            }, 5000);
        });
        
        // Watch for position updates
        watchId = navigator.geolocation.watchPosition(
            function(position) {
                if (destinationPosition && !isLoading) {
                    currentPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    
                    const bearing = calculateBearing(
                        currentPosition.latitude,
                        currentPosition.longitude,
                        destinationPosition.latitude,
                        destinationPosition.longitude
                    );
                    const distance = calculateDistance(
                        currentPosition.latitude,
                        currentPosition.longitude,
                        destinationPosition.latitude,
                        destinationPosition.longitude
                    );

                    drawCompass(bearing);
                    distanceElement.textContent = `Distance: ${distance.toFixed(2)} km`;
                }
            },
            function(error) {
                console.error('Error watching location:', error);
            }
        );
    } else {
        statusMessage.textContent = '⚠️ Geolocation is not supported by this browser.';
        statusMessage.className = 'status-message error';
        setTimeout(function() {
            statusMessage.className = 'status-message';
        }, 5000);
    }

    // Function to calculate the bearing between two points
    function calculateBearing(startLat, startLng, destLat, destLng) {
        startLat = startLat * Math.PI / 180;
        startLng = startLng * Math.PI / 180;
        destLat = destLat * Math.PI / 180;
        destLng = destLng * Math.PI / 180;

        const y = Math.sin(destLng - startLng) * Math.cos(destLat);
        const x = Math.cos(startLat) * Math.sin(destLat) -
                  Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
        let bearing = Math.atan2(y, x);
        bearing = bearing * 180 / Math.PI;
        bearing = (bearing + 360) % 360;
        return bearing;
    }

    // Function to calculate the distance between two points
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }

    // Function to geocode an address
    function geocodeAddress(address, callback) {
        // Use a free geocoding API (Nominatim from OpenStreetMap)
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    callback(lat, lon);
                } else {
                    isLoading = false;
                    statusMessage.textContent = '❌ No results found for the address. Please check the address and try again.';
                    statusMessage.className = 'status-message error';
                    setTimeout(function() {
                        statusMessage.className = 'status-message';
                    }, 5000);
                }
            })
            .catch(error => {
                isLoading = false;
                console.error('Error geocoding address:', error);
                statusMessage.textContent = '❌ Error geocoding address. Please check your internet connection and try again.';
                statusMessage.className = 'status-message error';
                setTimeout(function() {
                    statusMessage.className = 'status-message';
                }, 5000);
            });
    }

    // Function to get address suggestions
    function getAddressSuggestions(query, callback) {
        if (query.length < 3) {
            callback([]);
            return;
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const suggestions = data.map(item => item.display_name);
                callback(suggestions);
            })
            .catch(error => {
                console.error('Error fetching suggestions:', error);
                callback([]);
            });
    }

    // Function to draw the compass
    function drawCompass(bearing) {
        const ctx = compass.getContext('2d');
        ctx.clearRect(0, 0, compass.width, compass.height);

        const centerX = compass.width / 2;
        const centerY = compass.height / 2;
        const radius = compass.width / 2 - 30;

        // Draw the compass circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 20, 0, 2 * Math.PI);
        ctx.strokeStyle = 'var(--secondary-color)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Fill the compass background
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        // Draw the compass directions (N, E, S, W) with better positioning
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'var(--secondary-color)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText('N', centerX, centerY - radius - 30);
        ctx.fillText('E', centerX + radius + 30, centerY);
        ctx.fillText('S', centerX, centerY + radius + 40);
        ctx.fillText('W', centerX - radius - 30, centerY);

        // Draw a nice arrow
        const arrowLength = radius - 10;
        const arrowAngle = bearing * Math.PI / 180;

        // Draw the arrow shaft
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const tipX = centerX + arrowLength * Math.sin(arrowAngle);
        const tipY = centerY - arrowLength * Math.cos(arrowAngle);
        ctx.lineTo(tipX, tipY);
        ctx.strokeStyle = 'var(--accent-color)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw the arrowhead as a triangle
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(
            tipX - 15 * Math.cos(arrowAngle - Math.PI / 6),
            tipY - 15 * Math.sin(arrowAngle - Math.PI / 6)
        );
        ctx.lineTo(
            tipX - 15 * Math.cos(arrowAngle + Math.PI / 6),
            tipY - 15 * Math.sin(arrowAngle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = 'var(--accent-color)';
        ctx.fill();

        // Add a small circle at the center
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--secondary-color)';
        ctx.fill();
    }

    // Get the status message element
    const statusMessage = document.getElementById('statusMessage');
    let isLoading = false;

    // Event listener for the paste button
    const pasteButton = document.getElementById('pasteButton');
    pasteButton.addEventListener('click', function() {
        if (isLoading) return;
        
        statusMessage.textContent = 'Pasting address...';
        statusMessage.className = 'status-message';
        
        navigator.clipboard.readText().then(function(text) {
            addressInput.value = text;
            statusMessage.textContent = '✅ Address pasted successfully!';
            statusMessage.className = 'status-message success';
            setTimeout(function() {
                statusMessage.className = 'status-message';
            }, 3000);
        }).catch(function(err) {
            console.error('Failed to read clipboard contents: ', err);
            statusMessage.textContent = '❌ Failed to paste from clipboard. Please grant clipboard permissions.';
            statusMessage.className = 'status-message error';
            setTimeout(function() {
                statusMessage.className = 'status-message';
            }, 5000);
        });
    });

    // Add autocomplete functionality
    let autocompleteTimeout;
    addressInput.addEventListener('input', function() {
        clearTimeout(autocompleteTimeout);
        autocompleteTimeout = setTimeout(function() {
            const query = addressInput.value;
            getAddressSuggestions(query, function(suggestions) {
                // For simplicity, we'll just log the suggestions to the console
                // In a real app, you would display these in a dropdown menu
                console.log('Suggestions:', suggestions);
            });
        }, 300);
    });

    // Get the stop updates button
    const stopUpdatesButton = document.getElementById('stopUpdatesButton');

    // Event listener for the get direction button
    getDirectionButton.addEventListener('click', function() {
        const address = addressInput.value;
        if (address) {
            if (isLoading) return;
            isLoading = true;
            
            statusMessage.textContent = '🔍 Searching for address...';
            statusMessage.className = 'status-message';

            geocodeAddress(address, function(lat, lng) {
                isLoading = false;
                destinationPosition = {
                    latitude: lat,
                    longitude: lng
                };

                if (currentPosition) {
                    const bearing = calculateBearing(
                        currentPosition.latitude,
                        currentPosition.longitude,
                        destinationPosition.latitude,
                        destinationPosition.longitude
                    );
                    const distance = calculateDistance(
                        currentPosition.latitude,
                        currentPosition.longitude,
                        destinationPosition.latitude,
                        destinationPosition.longitude
                    );

                    drawCompass(bearing);
                    distanceElement.textContent = `Distance: ${distance.toFixed(2)} km`;
                    statusMessage.textContent = '✅ Direction calculated successfully! Live updates started.';
                    statusMessage.className = 'status-message success';
                    stopUpdatesButton.style.display = 'inline-block';
                    setTimeout(function() {
                        statusMessage.className = 'status-message';
                    }, 3000);
                }
            });
        } else {
            statusMessage.textContent = '⚠️ Please enter a destination address.';
            statusMessage.className = 'status-message error';
            setTimeout(function() {
                statusMessage.className = 'status-message';
            }, 3000);
        }
    });

    // Event listener for the stop updates button
    stopUpdatesButton.addEventListener('click', function() {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            statusMessage.textContent = '🛑 Live updates stopped.';
            statusMessage.className = 'status-message';
            stopUpdatesButton.style.display = 'none';
            setTimeout(function() {
                statusMessage.className = 'status-message';
            }, 3000);
        }
    });
});