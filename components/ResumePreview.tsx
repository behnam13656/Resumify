import React, { forwardRef } from 'react';
import type { ResumeData, Link } from '../types';
import { MailIcon, PhoneIcon, LocationMarkerIcon, LinkedInIcon, GithubIcon, LinkIcon, TwitterIcon, PortfolioIcon } from './icons';
import { useTranslation } from '../App';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ resumeData }, ref) => {
  const { t } = useTranslation();
  const { personalInfo, summary, skills, education, experience, projects } = resumeData;

  const getLinkIcon = (link: Link): React.ReactNode => {
    const label = link.label.toLowerCase();
    const url = link.url.toLowerCase();

    if (label.includes('linkedin') || url.includes('linkedin.com')) {
      return <LinkedInIcon className="mr-1" />;
    }
    if (label.includes('github') || url.includes('github.com')) {
      return <GithubIcon className="mr-1" />;
    }
    if (label.includes('twitter') || url.includes('twitter.com') || url.includes('x.com')) {
      return <TwitterIcon className="mr-1" />;
    }
    if (label.includes('portfolio') || label.includes('website') || label.includes('وبسایت') || label.includes('پورتفولیو')) {
      return <PortfolioIcon className="mr-1" />;
    }
    return <LinkIcon className="mr-1" />;
  };

  const Section: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <div className={`mb-4 ${className}`}>
      <h2 className="text-sm font-bold uppercase text-primary border-b-2 border-primary pb-1 mb-2">{title}</h2>
      {children}
    </div>
  );

  return (
    <div ref={ref} className="p-0">
        <div id="resume-preview-content" className="bg-white text-gray-800 p-8 shadow-2xl a4-aspect-ratio max-w-[8.5in] mx-auto">
            <header className="flex items-center mb-6">
                {personalInfo.pictureUrl && (
                    <img src={personalInfo.pictureUrl} alt={personalInfo.name} className="w-28 h-28 rounded-full mr-6 border-4 border-gray-200" />
                )}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{personalInfo.name}</h1>
                    <p className="text-lg text-primary font-semibold">{personalInfo.title}</p>
                    <div className="flex flex-wrap text-xs mt-2 text-gray-600">
                        <span className="flex items-center mr-4"><MailIcon className="mr-1"/>{personalInfo.email}</span>
                        <span className="flex items-center mr-4"><PhoneIcon className="mr-1"/>{personalInfo.phone}</span>
                        <span className="flex items-center"><LocationMarkerIcon className="mr-1"/>{personalInfo.address}</span>
                    </div>
                </div>
            </header>
             <div className="flex flex-wrap text-xs mb-4 text-gray-600">
                {personalInfo.links.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center mr-4 hover:text-primary">
                        {getLinkIcon(link)}
                        {link.label}
                    </a>
                ))}
            </div>

            <main className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <Section title={t('preview.summary')}>
                        <p className="text-sm text-gray-700">{summary}</p>
                    </Section>

                    <Section title={t('preview.experience')}>
                        {experience.map(exp => (
                            <div key={exp.id} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-gray-800">{exp.role}</h3>
                                    <span className="text-xs font-medium text-gray-500">{exp.duration}</span>
                                </div>
                                <p className="text-sm text-primary font-medium">{exp.company}</p>
                                <p className="text-xs mt-1 text-gray-600 whitespace-pre-wrap">{exp.responsibilities}</p>
                            </div>
                        ))}
                    </Section>
                    
                    <Section title={t('preview.projects')}>
                        {projects.map(proj => (
                            <div key={proj.id} className="mb-3">
                                <h3 className="font-semibold text-gray-800">{proj.name}</h3>
                                <p className="text-xs mt-1 text-gray-600">{proj.description}</p>
                            </div>
                        ))}
                    </Section>
                </div>

                <div className="col-span-1">
                    <Section title={t('preview.skills')}>
                        {skills.map(skill => (
                            <div key={skill.id} className="mb-2">
                                <p className="text-sm font-medium text-gray-700">{skill.name}</p>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </Section>

                    <Section title={t('preview.education')}>
                        {education.map(edu => (
                            <div key={edu.id} className="mb-3">
                                <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                                <p className="text-sm text-gray-600">{edu.institution}</p>
                                <p className="text-xs text-gray-500">{edu.startYear} - {edu.endYear}</p>
                            </div>
                        ))}
                    </Section>
                </div>
            </main>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #resume-preview-content, #resume-preview-content * { visibility: visible; }
                    #resume-preview-content { position: absolute; left: 0; top: 0; width: 100%; }
                }
                .a4-aspect-ratio {
                    width: 8.5in;
                    min-height: 11in;
                    transform-origin: top center;
                }
                @media (max-width: 8.5in) {
                   .a4-aspect-ratio {
                       transform: scale(calc(100vw / 8.5in));
                       min-height: calc(11in * (100vw / 8.5in));
                   }
                }
            `}</style>
        </div>
    </div>
  );
});
ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;