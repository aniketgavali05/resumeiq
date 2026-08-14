import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateATSReport(resume: any) {

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("ResumeIQ ATS Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`ATS Score: ${resume.atsScore}`, 14, 35);
    doc.text(`Rating: ${resume.scoreLevel}`, 14, 43);

    autoTable(doc, {
        startY: 55,
        head: [["Category", "Score"]],
        body: [
            ["Skill", resume.skillScore],
            ["Keyword", resume.keywordScore],
            ["Experience", resume.experienceScore],
            ["Education", resume.educationScore],
            ["Projects", resume.projectScore],
            ["Certification", resume.certificationScore],
            ["Sections", resume.sectionScore],
            ["Formatting", resume.formattingScore]
        ]
    });

    let y = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(16);
    doc.text("Matched Skills", 14, y);

    y += 8;

    resume.matchedSkills?.forEach((skill: string) => {

        doc.text(`• ${skill}`, 20, y);

        y += 7;

    });

    y += 5;

    doc.text("Missing Skills", 14, y);

    y += 8;

    resume.missingSkills?.forEach((skill: string) => {

        doc.text(`• ${skill}`, 20, y);

        y += 7;

    });

    y += 5;

    doc.text("AI Suggestions", 14, y);

    y += 8;

    resume.suggestions?.forEach((item: string) => {

        doc.text(`• ${item}`, 20, y);

        y += 7;

    });

    doc.save("ResumeIQ_ATS_Report.pdf");
}