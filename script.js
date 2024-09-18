document.getElementById('processButton').addEventListener('click', function() {
    let fileInput = document.getElementById('fileInput');
    if (!fileInput.files[0]) {
        alert('Please select a CSV file.');
        return;
    }
    let file = fileInput.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        let contents = e.target.result;
        processCSV(contents);
    };
    reader.readAsText(file);
});

function processCSV(contents) {
    let lines = contents.split('\n');
    if (lines.length < 2) {
        alert('CSV file is too short.');
        return;
    }
    // Ignore the first row (header)
    lines.shift();

    let jsonObject = {};
    let keyCounts = {};

    lines.forEach(function(line) {
        if (line.trim() === '') return; // Skip empty lines
        let parts = line.split(',');
        if (parts.length < 2) return; // Skip lines with insufficient columns
        let key = parts[0].trim();
        let value = parts.slice(1).join(',').trim(); // Handle commas in value

        if (jsonObject.hasOwnProperty(key)) {
            jsonObject[key] += '\n' + value;
            keyCounts[key]++;
        } else {
            jsonObject[key] = value;
            keyCounts[key] = 1;
        }
    });

    // Display the counts on the web page
    let outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';
    for (let key in keyCounts) {
        if (keyCounts[key] > 1) {
            let p = document.createElement('p');
            p.textContent = `Key "${key}" repeated ${keyCounts[key]} times.`;
            outputDiv.appendChild(p);
        }
    }

    // Create JSON file for download
    let jsonContent = JSON.stringify(jsonObject, null, 4);
    downloadJSON(jsonContent);
}

function downloadJSON(content) {
    let a = document.createElement('a');
    let file = new Blob([content], {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
