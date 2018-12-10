fs.readFile('./index.html', 'utf8', function(err, data) {
  if (err) return;
  else htmlData = data;
});

fs.readFile('./scripts.js', 'utf8', function(err, data) {
  if (err) return;
  else jsData = data;
});
