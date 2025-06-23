function showPanel(panel) {
  document.getElementById('textPanel').classList.add('hidden');
  document.getElementById('filePanel').classList.add('hidden');
  document.getElementById(panel + 'Panel').classList.remove('hidden');
}

function convertText(type) {
  const input = document.getElementById('textInput').value;
  let output = '';

  switch (type) {
    case 'upper': output = input.toUpperCase(); break;
    case 'lower': output = input.toLowerCase(); break;
    case 'proper':
      output = input.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
      break;
    case 'sentence':
      output = input.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
      break;
  }

  document.getElementById('textOutput').value = output;

  // Save to Firestore
  db.collection("convertedTexts").add({
    original: input,
    converted: output,
    type: type,
    timestamp: new Date()
  });
}

function convertFile() {
  const file = document.getElementById('fileInput').files[0];
  const type = document.getElementById('fileType').value;
  const downloadArea = document.getElementById('downloadArea');

  if (!file) {
    alert('Please upload a file first.');
    return;
  }

  // Upload original file
  const origRef = storage.ref('uploads/' + file.name);
  origRef.put(file)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(fileURL => {
      // Simulate converted file
      const convertedFileName = file.name.split('.').slice(0, -1).join('.') + '.' + type;
      const blob = new Blob([`Mock converted content to ${type}`], { type: 'text/plain' });

      const convRef = storage.ref('converted/' + convertedFileName);
      return convRef.put(blob).then(snap => snap.ref.getDownloadURL());
    })
    .then(convertedURL => {
      downloadArea.innerHTML = `
        <p>File converted and uploaded successfully.</p>
        <a href="${convertedURL}" download>Download Converted File</a>
      `;
    })
    .catch(error => {
      console.error("File conversion error:", error);
      downloadArea.innerHTML = `<p style="color:red;">Error converting file</p>`;
    });
}

document.getElementById('toggleBtn').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.width = sidebar.style.width === '60px' ? '200px' : '60px';
});
