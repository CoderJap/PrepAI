// app/api/resume/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    summary: string;
  };
  experience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const {
      resumeData,
      template,
    }: { resumeData: ResumeData; template: string } = await req.json();

    console.log("Resume generation request received");
    console.log("Template:", template);
    console.log("Name:", resumeData.personalInfo.fullName);

    const htmlContent = generateResumeHTML(resumeData, template);

    // Return HTML that can be easily printed to PDF
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Resume generation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to generate resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function generateResumeHTML(data: ResumeData, template: string): string {
  const { personalInfo, experience, education, skills, projects } = data;

  const templateStyles = {
    modern: {
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#60a5fa",
      background: "#f8fafc",
      cardBg: "#ffffff",
    },
    classic: {
      primary: "#1f2937",
      secondary: "#374151",
      accent: "#6b7280",
      background: "#ffffff",
      cardBg: "#f9fafb",
    },
    creative: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#34d399",
      background: "#f0fdf4",
      cardBg: "#ffffff",
    },
    minimal: {
      primary: "#d97706",
      secondary: "#b45309",
      accent: "#fbbf24",
      background: "#fffbeb",
      cardBg: "#ffffff",
    },
  };

  const colors =
    templateStyles[template as keyof typeof templateStyles] ||
    templateStyles.modern;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Professional Resume</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.5;
            color: #1f2937;
            background: white;
            font-size: 14px;
        }
        
        .resume-container {
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
            min-height: 11in;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${
    colors.secondary
  } 100%);
            color: white;
            padding: 40px;
            position: relative;
            text-align: center;
        }
        
        .name {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin: 20px 0;
            font-size: 14px;
            opacity: 0.95;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .summary {
            background: rgba(255,255,255,0.15);
            padding: 20px;
            border-radius: 12px;
            margin-top: 20px;
            font-size: 15px;
            line-height: 1.6;
            text-align: left;
            border-left: 4px solid rgba(255,255,255,0.3);
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 35px;
            break-inside: avoid;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 700;
            color: ${colors.primary};
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            padding-bottom: 8px;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 3px;
            background: ${colors.accent};
        }
        
        .item {
            margin-bottom: 25px;
            padding: 20px;
            background: ${colors.cardBg};
            border-radius: 8px;
            border-left: 4px solid ${colors.accent};
            break-inside: avoid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .item-header {
            margin-bottom: 12px;
        }
        
        .item-title {
            font-size: 18px;
            font-weight: 600;
            color: ${colors.primary};
            margin-bottom: 6px;
        }
        
        .item-subtitle {
            font-size: 15px;
            font-weight: 500;
            color: ${colors.secondary};
            margin-bottom: 6px;
        }
        
        .item-meta {
            font-size: 13px;
            color: #6b7280;
            font-style: italic;
        }
        
        .description ul {
            list-style: none;
            margin-top: 12px;
        }
        
        .description li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 6px;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .description li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: ${colors.accent};
            font-weight: bold;
            font-size: 16px;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .skill-group {
            background: ${colors.cardBg};
            padding: 20px;
            border-radius: 8px;
            border-top: 3px solid ${colors.accent};
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .skill-level {
            font-size: 16px;
            font-weight: 600;
            color: ${colors.primary};
            margin-bottom: 10px;
        }
        
        .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background: ${colors.accent}30;
            color: ${colors.secondary};
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .tech-stack {
            display: inline-block;
            background: ${colors.accent}20;
            color: ${colors.primary};
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 10px;
        }
        
        .project-link {
            color: ${colors.accent};
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
        }
        
        .project-link:hover {
            text-decoration: underline;
        }
        
        .print-instructions {
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors.primary};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @media print {
            body {
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .resume-container {
                box-shadow: none;
                max-width: 100%;
                margin: 0;
            }
            
            .print-instructions {
                display: none;
            }
            
            .section {
                break-inside: avoid;
            }
            
            .item {
                break-inside: avoid;
            }
        }
        
        @media screen and (max-width: 768px) {
            .resume-container {
                margin: 10px;
                max-width: calc(100% - 20px);
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="print-instructions" id="printInstructions">
        📄 Press Ctrl+P (or Cmd+P on Mac) to save as PDF
    </div>
    
    <div class="resume-container">
        <header class="header">
            <h1 class="name">${personalInfo.fullName}</h1>
            <div class="contact-info">
                ${
                  personalInfo.email
                    ? `<div class="contact-item">📧 ${personalInfo.email}</div>`
                    : ""
                }
                ${
                  personalInfo.phone
                    ? `<div class="contact-item">📱 ${personalInfo.phone}</div>`
                    : ""
                }
                ${
                  personalInfo.location
                    ? `<div class="contact-item">📍 ${personalInfo.location}</div>`
                    : ""
                }
                ${
                  personalInfo.website
                    ? `<div class="contact-item">🌐 ${personalInfo.website}</div>`
                    : ""
                }
                ${
                  personalInfo.linkedin
                    ? `<div class="contact-item">💼 LinkedIn</div>`
                    : ""
                }
            </div>
            ${
              personalInfo.summary
                ? `<div class="summary">${personalInfo.summary}</div>`
                : ""
            }
        </header>

        <main class="content">
            ${
              experience.length > 0
                ? `
            <section class="section">
                <h2 class="section-title">Professional Experience</h2>
                ${experience
                  .map(
                    (exp) => `
                    <div class="item">
                        <div class="item-header">
                            <div class="item-title">${exp.jobTitle}</div>
                            <div class="item-subtitle">${exp.company}, ${
                      exp.location
                    }</div>
                            <div class="item-meta">${exp.startDate} - ${
                      exp.current ? "Present" : exp.endDate
                    }</div>
                        </div>
                        ${
                          exp.description.some((desc) => desc.trim())
                            ? `
                            <div class="description">
                                <ul>
                                    ${exp.description
                                      .filter((desc) => desc.trim())
                                      .map((desc) => `<li>${desc}</li>`)
                                      .join("")}
                                </ul>
                            </div>
                        `
                            : ""
                        }
                    </div>
                `
                  )
                  .join("")}
            </section>
            `
                : ""
            }

            ${
              education.length > 0
                ? `
            <section class="section">
                <h2 class="section-title">Education</h2>
                ${education
                  .map(
                    (edu) => `
                    <div class="item">
                        <div class="item-title">${edu.degree}</div>
                        <div class="item-subtitle">${edu.institution}, ${edu.location}</div>
                        <div class="item-meta">Graduated: ${edu.graduationDate}</div>
                    </div>
                `
                  )
                  .join("")}
            </section>
            `
                : ""
            }

            ${
              skills.length > 0
                ? `
            <section class="section">
                <h2 class="section-title">Skills & Technologies</h2>
                <div class="skills-grid">
                    ${Object.entries(
                      skills.reduce((acc: any, skill: any) => {
                        if (!acc[skill.level]) acc[skill.level] = [];
                        acc[skill.level].push(skill.name);
                        return acc;
                      }, {})
                    )
                      .map(
                        ([level, skillNames]: [string, any]) => `
                        <div class="skill-group">
                            <div class="skill-level">${level}</div>
                            <div class="skill-tags">
                                ${skillNames
                                  .map(
                                    (skill: string) =>
                                      `<span class="skill-tag">${skill}</span>`
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </section>
            `
                : ""
            }

            ${
              projects.length > 0
                ? `
            <section class="section">
                <h2 class="section-title">Notable Projects</h2>
                ${projects
                  .map(
                    (project) => `
                    <div class="item">
                        <div class="item-header">
                            <div class="item-title">${project.name}</div>
                            ${
                              project.link
                                ? `<a href="${project.link}" class="project-link" target="_blank">View Project →</a>`
                                : ""
                            }
                        </div>
                        ${
                          project.technologies
                            ? `<div class="tech-stack">Technologies: ${project.technologies}</div>`
                            : ""
                        }
                        <p style="margin-top: 10px; line-height: 1.6;">${
                          project.description
                        }</p>
                    </div>
                `
                  )
                  .join("")}
            </section>
            `
                : ""
            }
        </main>
    </div>

    <script>
        // Auto-hide print instructions after 5 seconds
        setTimeout(() => {
            const instructions = document.getElementById('printInstructions');
            if (instructions) {
                instructions.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => instructions.remove(), 300);
            }
        }, 5000);
        
        // Auto-open print dialog after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (confirm('Ready to save your resume as PDF?')) {
                    window.print();
                }
            }, 1000);
        });
    </script>
</body>
</html>`;
}
