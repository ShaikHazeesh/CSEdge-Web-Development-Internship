tinymce.init({
    selector: 'textarea',
    plugins: 'lists link image code spellchecker',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code | spellchecker',
    menubar: false,
    statusbar: false
});

document.getElementById('resume-form').addEventListener('submit', function(event) {
    event.preventDefault();
    updatePreview();

    const format = document.getElementById('format-choice').value;
    if (format === 'pdf') {
        generatePDF();
    } else if (format === 'docx') {
        generateDocx();
    } else {
        generateTxt();
    }
});

function updatePreview() {
    const preview = document.getElementById('resume-preview');
    preview.innerHTML = generateResumeHTML();
}

function generateResumeHTML() {
    let html = `
        <h1>${document.getElementById('name').value}</h1>
        <p>${document.getElementById('email').value} | ${document.getElementById('phone').value} | ${document.getElementById('linkedin').value}</p>
        <h2>Professional Summary</h2>
        <p>${document.getElementById('summary').value}</p>
        <h2>Skills</h2>
        <p>${document.getElementById('skills').value}</p>
        ${generateSectionHTML('Education')}
        ${generateSectionHTML('Experience')}
        ${generateSectionHTML('Project')}
        ${generateSectionHTML('Certification')}
        ${generateSectionHTML('Language')}
        ${generateSectionHTML('Reference')}
    `;
    return html;
}

function generateSectionHTML(section) {
    const sectionId = section.toLowerCase() + '-section';
    const sectionDiv = document.getElementById(sectionId);
    let html = `<h2>${section}</h2>`;
    for (let i = 0; i < sectionDiv.children.length; i += 4) {
        html += `<p><strong>${sectionDiv.children[i].value}</strong> - ${sectionDiv.children[i + 1].value} (${sectionDiv.children[i + 2].value})<br>${sectionDiv.children[i + 3].value}</p>`;
    }
    return html;
}

function addSection(sectionId, section) {
    const sectionDiv = document.getElementById(sectionId);
    sectionDiv.innerHTML += `
        <div class="${sectionId}-entry">
            <input type="text" placeholder="${section} Title" required>
            <input type="text" placeholder="${section === 'Education' ? 'Institution' : 'Company'}" required>
            <input type="text" placeholder="${section === 'Education' ? 'Year of Graduation' : 'Duration'}" required>
            <textarea placeholder="${section === 'Project' ? 'Description' : 'Responsibilities and achievements'}" required></textarea>
        </div>
    `;
}

function generatePDF() {
    const element = document.getElementById('resume-preview');
    html2pdf().from(element).save('resume.pdf');
}

function generateDocx() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const linkedin = document.getElementById('linkedin').value;
    const summary = document.getElementById('summary').value;
    const skills = document.getElementById('skills').value;
    const keywords = document.getElementById('keywords').value;
    const education = generateSectionHTML('Education');
    const experience = generateSectionHTML('Experience');
    const project = generateSectionHTML('Project');

    const docContent = `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        LinkedIn: ${linkedin}
        
        Professional Summary:
        ${summary}
        
        Skills:
        ${skills}
        
        Keywords (ATS-Friendly):
        ${keywords}
        
        Education:
        ${education}
        
        Experience:
        ${experience}
        
        Projects:
        ${project}
    `;

    var zip = new PizZip();
    var doc = new Docxtemplater().loadZip(zip);

    doc.setData({
        name: name,
        email: email,
        phone: phone,
        linkedin: linkedin,
        summary: summary,
        skills: skills,
        keywords: keywords,
        education: education,
        experience: experience,
        project: project
    });

    try {
        doc.render();
        var blob = doc.getZip().generate({ type: "blob" });
        saveAs(blob, "resume.docx");

    } catch (error) {
        console.log(error);
    }
}

function generateTxt() {
    const element = document.createElement('a');
    const resumeHTML = generateResumeHTML();
    const blob = new Blob([resumeHTML], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = 'resume.txt';
    document.body.appendChild(element);
    element.click();
}
