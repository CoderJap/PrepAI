"use client";

import { useState } from "react";
import {
  Plus,
  Minus,
  Download,
  Eye,
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
} from "lucide-react";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

const templates = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and contemporary design",
    color: "from-blue-600 to-purple-600",
  },
  {
    id: "classic",
    name: "Classic Executive",
    description: "Traditional and elegant",
    color: "from-gray-700 to-gray-900",
  },
  {
    id: "creative",
    name: "Creative Designer",
    description: "Bold and visually striking",
    color: "from-emerald-600 to-cyan-600",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Simple and focused",
    color: "from-amber-600 to-orange-600",
  },
];

export default function ResumeGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  const steps = [
    { title: "Personal Info", icon: User },
    { title: "Experience", icon: Briefcase },
    { title: "Education", icon: GraduationCap },
    { title: "Skills", icon: Code },
    { title: "Projects", icon: Award },
    { title: "Template", icon: Eye },
    { title: "Generate", icon: Download },
  ];

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: any
  ) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "Intermediate",
    };
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: "",
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const generateResume = async () => {
    try {
      setAnalyzing(true);

      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          template: selectedTemplate,
        }),
      });

      if (response.ok) {
        // Open the professional HTML resume in a new tab
        const htmlContent = await response.text();
        const newWindow = window.open("", "_blank");
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();

          // Focus on the new window
          newWindow.focus();
        } else {
          alert(
            "Please allow pop-ups to view your resume. You can also try again."
          );
        }
      } else {
        console.error("Failed to generate resume:", response.statusText);
        alert("Failed to generate resume. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate resume:", error);
      alert("Failed to generate resume. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-8">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        fullName: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        email: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        phone: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.location}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        location: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York, NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={resumeData.personalInfo.website}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        website: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://johndoe.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        linkedin: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Professional Summary
              </label>
              <textarea
                rows={4}
                value={resumeData.personalInfo.summary}
                onChange={(e) =>
                  setResumeData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      summary: e.target.value,
                    },
                  }))
                }
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief professional summary highlighting your key skills and experience..."
              />
            </div>
          </div>
        );

      case 1: // Experience
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Work Experience</h2>
              <button
                onClick={addExperience}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </button>
            </div>
            {resumeData.experience.map((exp, index) => (
              <div
                key={exp.id}
                className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700"
              >
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.jobTitle}
                    onChange={(e) =>
                      updateExperience(exp.id, "jobTitle", e.target.value)
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) =>
                      updateExperience(exp.id, "location", e.target.value)
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                      className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="month"
                      value={exp.endDate}
                      disabled={exp.current}
                      onChange={(e) =>
                        updateExperience(exp.id, "endDate", e.target.value)
                      }
                      className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) =>
                        updateExperience(exp.id, "current", e.target.checked)
                      }
                      className="mr-2 rounded"
                    />
                    Currently working here
                  </label>
                </div>
                <textarea
                  rows={3}
                  placeholder="Describe your key achievements and responsibilities..."
                  value={exp.description.join("\n")}
                  onChange={(e) =>
                    updateExperience(
                      exp.id,
                      "description",
                      e.target.value.split("\n")
                    )
                  }
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        );

      case 2: // Education
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Education</h2>
              <button
                onClick={addEducation}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </button>
            </div>
            {resumeData.education.map((edu) => (
              <div
                key={edu.id}
                className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Degree (e.g., Bachelor of Science)"
                    value={edu.degree}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id
                            ? { ...item, degree: e.target.value }
                            : item
                        ),
                      }))
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Institution Name"
                    value={edu.institution}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id
                            ? { ...item, institution: e.target.value }
                            : item
                        ),
                      }))
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={edu.location}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id
                            ? { ...item, location: e.target.value }
                            : item
                        ),
                      }))
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="month"
                    placeholder="Graduation Date"
                    value={edu.graduationDate}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id
                            ? { ...item, graduationDate: e.target.value }
                            : item
                        ),
                      }))
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 3: // Skills
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Skills</h2>
              <button
                onClick={addSkill}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {resumeData.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-gray-800/30 rounded-xl p-4 border border-gray-700"
                >
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={skill.name}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: prev.skills.map((s) =>
                          s.id === skill.id ? { ...s, name: e.target.value } : s
                        ),
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  />
                  <select
                    value={skill.level}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: prev.skills.map((s) =>
                          s.id === skill.id
                            ? { ...s, level: e.target.value as Skill["level"] }
                            : s
                        ),
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        );

      case 4: // Projects
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Projects</h2>
              <button
                onClick={addProject}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </button>
            </div>
            {resumeData.projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700"
              >
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        projects: prev.projects.map((p) =>
                          p.id === project.id
                            ? { ...p, name: e.target.value }
                            : p
                        ),
                      }))
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="Project Link (optional)"
                    value={project.link}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        projects: prev.projects.map((p) =>
                          p.id === project.id
                            ? { ...p, link: e.target.value }
                            : p
                        ),
                      }))
                    }
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Technologies used (e.g., React, Node.js, MongoDB)"
                  value={project.technologies}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      projects: prev.projects.map((p) =>
                        p.id === project.id
                          ? { ...p, technologies: e.target.value }
                          : p
                      ),
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <textarea
                  rows={3}
                  placeholder="Project description and key achievements..."
                  value={project.description}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      projects: prev.projects.map((p) =>
                        p.id === project.id
                          ? { ...p, description: e.target.value }
                          : p
                      ),
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        );

      case 5: // Template Selection
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white text-center">
              Choose Your Template
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                  }`}
                >
                  <div
                    className={`w-full h-32 bg-gradient-to-br ${template.color} rounded-xl mb-4 flex items-center justify-center`}
                  >
                    <div className="text-white text-sm font-medium">
                      Preview
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-400">{template.description}</p>
                  {selectedTemplate === template.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 6: // Generate
        return (
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full mb-6">
              <Download className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Generate!
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Your resume is ready to be generated with the{" "}
              {templates.find((t) => t.id === selectedTemplate)?.name} template.
            </p>
            <button
              onClick={generateResume}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold text-xl rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Download className="w-6 h-6 mr-3" />
              Generate & Download Resume
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-12 overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                index <= currentStep
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-600 text-gray-400"
              }`}
            >
              <step.icon className="w-6 h-6" />
            </div>
            <div className="ml-3 min-w-0">
              <p
                className={`text-sm font-medium ${
                  index <= currentStep ? "text-white" : "text-gray-400"
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-4 ${
                  index < currentStep ? "bg-blue-600" : "bg-gray-600"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>

        <button
          onClick={() =>
            setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
          }
          disabled={currentStep === steps.length - 1}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
