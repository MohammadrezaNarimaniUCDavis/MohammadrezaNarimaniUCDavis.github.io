var S2 = ee.ImageCollection("COPERNICUS/S2_HARMONIZED");
var ROI = ee.Geometry.Point(-122.673, 39.776);

// Define the size of the rectangle in degrees
var rectSize = 0.02;

// Define a FeatureCollection to store the rectangle geometries
var rectangles = ee.FeatureCollection([]);

// Define a callback function for the Map.onClick() event
// Define a callback function for the Map.onClick() event
var drawRectangle = function(coords) {
  // Create a rectangle geometry centered at the clicked coordinates
  var rectangle = ee.Geometry.Rectangle(coords.lon - (rectSize/2), coords.lat - (rectSize/2), coords.lon + (rectSize/2), coords.lat + (rectSize/2));
  
  // Get the centroid of the rectangle
  var centroid = rectangle.centroid();
  var lon = centroid.coordinates().get(0);
  var lat = centroid.coordinates().get(1);
  
  // Add the rectangle to the FeatureCollection
  rectangles = rectangles.merge(ee.Feature(rectangle));

  // Add the rectangle as a new layer to the map
  Map.addLayer(rectangle, {color: 'red'}, 'Rectangle');
};

// Add the click event listener to the map
Map.onClick(drawRectangle);

// Wait for the user to finish drawing the rectangles
ui.root.widgets().get(0).add(
  ui.Button({
    label: 'Finish Drawing',
    onClick: function() {
      // Print the FeatureCollection of rectangle geometries to the console
      print(rectangles);

      // Clip the image to the selected rectangles
      var clippedImage = image.clip(rectangles);

// Get the latitude, longitude, and date of the image
      var lat, lon;
      var rectCentroid = rectangles.geometry().centroid();
      lat = rectCentroid.coordinates().get(1);
      lon = rectCentroid.coordinates().get(0);
      
      var date = ee.Date(image.get('system:time_start')).format('yyyy-MM-dd');

      // Construct the output file name using the latitude, longitude, and date
      var filename = 'S2__' + lat.getInfo().toString().replace(".", "_") + '__' + lon.getInfo().toString().replace(".", "_") + '__' + date.getInfo();


// Download the clipped images to Google Drive
Export.image.toDrive({
   image: clippedImage,
        description: filename,
        folder: 'GEE_clipped_images',
        region: rectangles,
        scale: 1,
});
    }
  })
);

// Let’s define the image collection we are working with by writing this command.
// We are creating a new variable 'image' that will come from the S2 collection we have imported
var image = ee.Image(S2 

 // We will then include a filter to get only images in the date range we are interested in
.filterDate("2020-08-16", "2020-08-29")

 // Next we include a geographic filter to narrow the search to images at the location of our ROI point
.filterBounds(ROI).select(['B1','B2','B3','B4','B5','B6','B7','B8','B8A','B9','B11','B12'])

 // Next we will also sort the collection by a metadata property, in our case cloud cover is a very useful one
.sort("CLOUD_COVERAGE_ASSESSMENT") 

 // Now lets select the first image out of this collection - i.e. the most cloud free image in the date range
.first());

// And let's print the image to the console.
print("A Sentinel scene:", image);

// Centre the scene to the ROI
Map.centerObject(ROI, 12);


// Add the image to the map, using the visualization parameters.
  // Define visualization parameters in a JavaScript dictionary for true colour rendering. 
// Bands 12,11,4 are needed for RGB (false colour composite).
    var falseColour = {
        bands: ["B12", "B11", "B4"],
        min: 0,
        max: 3000
        }; 

// Add the image to the map, using the visualization parameters.
  Map.addLayer(image, falseColour, "false-colour image");