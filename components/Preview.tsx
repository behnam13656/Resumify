import React, { forwardRef } from 'react';
import type { ResumeData } from '../types';
import { EmailIcon, PhoneIcon, LocationIcon, LinkedInIcon, GitHubIcon } from './icons';
import { translations } from '../i18n';
import type { Template } from '../App';
import styles from './Preview.module.css';

type Translation = typeof translations.fa;

interface PreviewProps {
  data: ResumeData;
  t: Translation;
  template: Template;
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ data, t, template }, ref) => {
  const { personalInfo, summary, workExperience, education, skills, projects } = data;

  if (template === 'ats') {
    return (
      <div ref={ref} className={styles.atsContainer} style={{ direction: document.documentElement.dir as 'ltr' | 'rtl' }}>
        <header className={styles.atsHeader}>
            <h1 className={styles.atsName}>{personalInfo.name}</h1>
            <p className={styles.atsTitle}>{personalInfo.title}</p>
            <div className={styles.atsContact}>
                <span>{personalInfo.email}</span>
                <span className={styles.atsContactDivider}>|</span>
                <span>{personalInfo.phone}</span>
                <span className={styles.atsContactDivider}>|</span>
                <span>{personalInfo.location}</span>
                {personalInfo.linkedin && <><span className={styles.atsContactDivider}>|</span><span>{personalInfo.linkedin}</span></>}
                {personalInfo.github && <><span className={styles.atsContactDivider}>|</span><span>{personalInfo.github}</span></>}
            </div>
        </header>

        {summary && <ATSSection title={t.summary}><p className={styles.atsText}>{summary}</p></ATSSection>}

        {skills.length > 0 && <ATSSection title={t.skills}><p className={styles.atsText}>{skills.map(skill => skill.name).join(' • ')}</p></ATSSection>}

        {workExperience.length > 0 && <ATSSection title={t.workExperience}>
            {workExperience.map(exp => (
                <div key={exp.id} className={styles.atsItem}>
                    <div className={styles.atsItemHeader}>
                        <h3 className={styles.atsItemTitle}>{exp.role}</h3>
                        <p className={styles.atsItemMeta}>{exp.period}</p>
                    </div>
                    <p className={styles.atsItemSubtitle}>{exp.company}</p>
                    <ul className={styles.atsList}>
                        {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^•\s*/, '')}</li>)}
                    </ul>
                </div>
            ))}
        </ATSSection>}
        
        {education.length > 0 && <ATSSection title={t.education}>
             {education.map(edu => (
                <div key={edu.id} className={styles.atsItem}>
                    <div className={styles.atsItemHeader}>
                        <h3 className={styles.atsItemTitle}>{edu.degree}</h3>
                        <p className={styles.atsItemMeta}>{edu.period}</p>
                    </div>
                    <p className={styles.atsItemSubtitle}>{edu.institution}</p>
                </div>
            ))}
        </ATSSection>}
        
        {projects.length > 0 && <ATSSection title={t.projects}>
            {projects.map(proj => (
                <div key={proj.id} className={styles.atsItem}>
                    <div className={styles.atsProjectHeader}>
                         <h3 className={styles.atsItemTitle}>{proj.name}</h3>
                         {proj.link && <a href={`//${proj.link.replace(/^https?:\/\//,'')}`} target="_blank" rel="noopener noreferrer" className={styles.atsProjectLink}>({proj.link})</a>}
                    </div>
                    <p className={styles.atsProjectDescription}>{proj.description}</p>
                </div>
            ))}
        </ATSSection>}
      </div>
    );
  }

  // Visual Template
  return (
    <div ref={ref} className={styles.visualContainer}>
        <header className={styles.visualHeader}>
            <img src={personalInfo.avatar} alt="Profile" className={styles.visualAvatar} onError={(e) => (e.currentTarget.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')} />
            <div className={styles.visualHeaderText}>
                <h1 className={styles.visualName}>{personalInfo.name}</h1>
                <h2 className={styles.visualTitle}>{personalInfo.title}</h2>
            </div>
        </header>

        <div className={styles.visualLayout}>
            <main className={styles.visualMain}>
                {summary && <VisualSection title={t.summary}><p className={styles.visualSummaryText}>{summary}</p></VisualSection>}
                
                {workExperience.length > 0 && <VisualSection title={t.workExperience}>
                    {workExperience.map(exp => (
                        <div key={exp.id} className={styles.visualTimelineItem}>
                            <div className={styles.visualTimelineHeader}>
                                <h3 className={styles.visualTimelineTitle}>{exp.role}</h3>
                                <p className={styles.visualTimelineMeta}>{exp.period}</p>
                            </div>
                            <p className={styles.visualTimelineSubtitle}>{exp.company}</p>
                            <ul className={styles.visualTimelineDescription}>
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^•\s*/, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </VisualSection>}
                
                {education.length > 0 && <VisualSection title={t.education}>
                    {education.map(edu => (
                        <div key={edu.id} className={styles.visualTimelineItem}>
                            <div className={styles.visualTimelineHeader}>
                                <h3 className={styles.visualTimelineTitle}>{edu.degree}</h3>
                                <p className={styles.visualTimelineMeta}>{edu.period}</p>
                            </div>
                            <p className={styles.visualTimelineSubtitle}>{edu.institution}</p>
                        </div>
                    ))}
                </VisualSection>}
                
                {projects.length > 0 && <VisualSection title={t.projects}>
                    {projects.map(proj => (
                        <div key={proj.id} className={styles.visualProjectItem}>
                            <div className={styles.visualProjectHeader}>
                                <h3 className={styles.visualProjectTitle}>{proj.name}</h3>
                                {proj.link && <a href={`//${proj.link.replace(/^https?:\/\//,'')}`} target="_blank" rel="noopener noreferrer" className={styles.visualProjectLink}>🔗</a>}
                            </div>
                            <p className={styles.visualProjectDescription}>{proj.description}</p>
                        </div>
                    ))}
                </VisualSection>}
            </main>

            <aside className={styles.visualSidebar}>
                <VisualSection title={t.contactInfo}>
                    <ul className={styles.visualContactList}>
                        {personalInfo.email && <ContactItem icon={<EmailIcon />} text={personalInfo.email} />}
                        {personalInfo.phone && <ContactItem icon={<PhoneIcon />} text={personalInfo.phone} />}
                        {personalInfo.location && <ContactItem icon={<LocationIcon />} text={personalInfo.location} />}
                        {personalInfo.linkedin && <ContactItem icon={<LinkedInIcon />} text={personalInfo.linkedin} link={`//${personalInfo.linkedin.replace(/^https?:\/\//,'')}`} />}
                        {personalInfo.github && <ContactItem icon={<GitHubIcon />} text={personalInfo.github} link={`//github.com/${personalInfo.github.replace(/@/g, '')}`} />}
                    </ul>
                </VisualSection>
                
                {skills.length > 0 && <VisualSection title={t.skills}>
                    <ul className={styles.visualSkillList}>
                        {skills.map(skill => (
                            <li key={skill.id} className={styles.visualSkillItem}>
                                <span className={styles.visualSkillName}>{skill.name}</span>
                                <div className={styles.visualSkillProgressWrapper}>
                                    <div className={styles.visualSkillProgressBar} style={{ width: `${skill.level}%` }}></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </VisualSection>}
            </aside>
        </div>
    </div>
  );
});

const ATSSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className={styles.atsSection}>
        <h2 className={styles.atsSectionTitle}>{title}</h2>
        {children}
    </section>
);

const VisualSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className={styles.visualSection}>
        <h3 className={styles.visualSectionTitle}>{title}</h3>
        <div className={styles.visualSectionContent}>{children}</div>
    </section>
);

const ContactItem: React.FC<{ icon: React.ReactNode; text: string; link?: string }> = ({ icon, text, link }) => (
    <li className={styles.visualContactItem}>
        <span className={styles.visualContactIcon}>{icon}</span>
        {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className={styles.visualContactText}>{text}</a>
        ) : (
            <span className={styles.visualContactText}>{text}</span>
        )}
    </li>
);
