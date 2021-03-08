var fs = require('fs');
var archiver = require('archiver');
var output = fs.createWriteStream('./resume.zip');
var archive = archiver('zip', {
    gzip: true,
    zlib: { level: 9 } // Sets the compression level.
});

archive.on('error', function(err) {
  throw err;
});

// pipe archive data to the output file
archive.pipe(output);

// append files
archive.file('./index.html');
archive.file('./style.css');
archive.file('./ryan.png');

//
archive.finalize().then(() => {


  var pdfcrowd = require("pdfcrowd");
  var client = new pdfcrowd.HtmlToPdfClient("ryanmchenry2", "23aaeed6aa8a060458d3845b72b1856a");
  
  // configure the conversion
  try {
    // client.setPageSize("Letter");
    // client.setOrientation("portrait");
    client.setPageWidth("563pt")
    client.setPageHeight("750pt")
    client.setNoMargins(true);
  } catch(why) {
    // report the error
    console.error("Pdfcrowd Error: " + why);
    process.exit(1);
  }
  
  // run the conversion and write the result to a file
  client.convertFileToFile(
      "resume.zip",
      "resume.pdf",
      function(err, fileName) {
          if (err) return console.error("Pdfcrowd Error: " + err);
          console.log("Success: the file was created " + fileName);
      });
});