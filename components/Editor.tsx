import React from 'react';
import type { ResumeData, WorkExperience, Education, Project, Skill } from '../types';
import { translations } from '../i18n';
import styles from "./Editor.module.css";

type Translation = typeof translations.fa;

interface EditorProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  t: Translation;
}

export const Editor: React.FC<EditorProps> = ({ data, setData, t }) => {
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
  };
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setData(prev => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    avatar: reader.result as string,
                },
            }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prev => ({ ...prev, summary: e.target.value }));
  };
  
  const handleSkillsChange = (index: number, field: keyof Omit<Skill, 'id'>, value: string) => {
    const newSkills = [...data.skills];
    const skill = { ...newSkills[index] };
    if (field === 'level') {
      skill[field] = Math.max(0, Math.min(100, Number(value))); // Clamp between 0-100
    } else {
      skill[field] = value;
    }
    newSkills[index] = skill;
    setData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setData(prev => ({...prev, skills: [...prev.skills, {id: crypto.randomUUID(), name: '', level: 50}]}));
  }

  const removeSkill = (index: number) => {
    setData(prev => ({...prev, skills: prev.skills.filter((_, i) => i !== index)}));
  }

  const handleDynamicChange = <T extends { id: string }>(section: 'workExperience' | 'education' | 'projects', index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const items = [...(data[section] as unknown as T[])];
    items[index] = { ...items[index], [name]: value };
    setData(prev => ({ ...prev, [section]: items }));
  };

  const addDynamicItem = (section: 'workExperience' | 'education' | 'projects') => {
      const newItem = {
          id: crypto.randomUUID(),
          ...(section === 'workExperience' && { company: '', role: '', period: '', description: '' }),
          ...(section === 'education' && { institution: '', degree: '', period: '' }),
          ...(section === 'projects' && { name: '', description: '', link: '' }),
      };
      setData(prev => ({ ...prev, [section]: [...(prev[section] as any[]), newItem] }));
  };

  const removeDynamicItem = (section: 'workExperience' | 'education' | 'projects', index: number) => {
    const items = (data[section] as any[]).filter((_, i) => i !== index);
    setData(prev => ({ ...prev, [section]: items }));
  };

  return (
    <div className={styles.container}>
      <Section title={t.personalInfo}>
        <div className={styles.grid2Col}>
          <Input label={t.fullName} name="name" value={data.personalInfo.name} onChange={handlePersonalInfoChange} />
          <Input label={t.jobTitle} name="title" value={data.personalInfo.title} onChange={handlePersonalInfoChange} />
          <Input label={t.email} name="email" type="email" value={data.personalInfo.email} onChange={handlePersonalInfoChange} />
          <Input label={t.phone} name="phone" type="tel" value={data.personalInfo.phone} onChange={handlePersonalInfoChange} />
          <Input label={t.address} name="location" value={data.personalInfo.location} onChange={handlePersonalInfoChange} />
          <Input label={t.linkedin} name="linkedin" value={data.personalInfo.linkedin} onChange={handlePersonalInfoChange} />
          <Input label={t.github} name="github" value={data.personalInfo.github} onChange={handlePersonalInfoChange} />
          <div className={styles.avatarGroup}>
            <div className={styles.avatarGroupGrow}>
              <Input
                label={t.profilePicture}
                name="avatar"
                type="text"
                value={data.personalInfo.avatar}
                onChange={handlePersonalInfoChange}
              />
            </div>
            <input
              type="file"
              id="avatar-upload"
              className={styles.hiddenInput}
              accept="image/*"
              onChange={handleAvatarUpload}
            />
            <label
              htmlFor="avatar-upload"
              title={t.uploadTooltip}
              className={styles.avatarUploadLabel}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </label>
          </div>
        </div>
      </Section>

      <Section title={t.summary}>
        <textarea
          className={styles.textarea}
          rows={5}
          value={data.summary}
          onChange={handleSummaryChange}
          placeholder={t.summary}
        ></textarea>
      </Section>

      <Section title={t.skills}>
        <div className={styles.skillsList}>
            {data.skills.map((skill, index) => (
                <div key={skill.id} className={styles.skillItem}>
                    <div className={styles.skillItemGrow}>
                        <Input
                            label={t.skillName}
                            type="text"
                            name={`skill-${skill.id}`}
                            value={skill.name}
                            onChange={(e) => handleSkillsChange(index, 'name', e.target.value)}
                        />
                    </div>
                    <div className={styles.skillLevel}>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => handleSkillsChange(index, 'level', e.target.value)}
                            className={styles.rangeInput}
                        />
                        <span className={styles.skillLevelText}>{skill.level}%</span>
                    </div>
                    <button onClick={() => removeSkill(index)} className={styles.buttonRemoveItem}>-</button>
                </div>
            ))}
        </div>
        <button onClick={addSkill} className={styles.buttonAdd}>{t.addSkill}</button>
      </Section>

      <Section title={t.workExperience}>
        {data.workExperience.map((exp, index) => (
          <div key={exp.id} className={styles.dynamicItem}>
            <button onClick={() => removeDynamicItem('workExperience', index)} className={styles.dynamicItemRemoveButton}>{t.remove}</button>
            <div className={styles.grid2Col}>
                <Input label={t.company} name="company" value={exp.company} onChange={(e) => handleDynamicChange<WorkExperience>('workExperience', index, e)} />
                <Input label={t.role} name="role" value={exp.role} onChange={(e) => handleDynamicChange<WorkExperience>('workExperience', index, e)} />
                <Input label={t.period} name="period" value={exp.period} onChange={(e) => handleDynamicChange<WorkExperience>('workExperience', index, e)} />
            </div>
            <div className={styles.dynamicItemTextareaWrapper}>
                <label className={styles.dynamicItemTextareaLabel}>{t.description}</label>
                <textarea
                    name="description"
                    className={styles.textarea}
                    rows={4}
                    value={exp.description}
                    onChange={(e) => handleDynamicChange<WorkExperience>('workExperience', index, e)}
                ></textarea>
            </div>
          </div>
        ))}
        <button onClick={() => addDynamicItem('workExperience')} className={styles.buttonAdd}>{t.addWorkExperience}</button>
      </Section>
      
      <Section title={t.education}>
        {data.education.map((edu, index) => (
          <div key={edu.id} className={styles.dynamicItem}>
            <button onClick={() => removeDynamicItem('education', index)} className={styles.dynamicItemRemoveButton}>{t.remove}</button>
            <div className={styles.grid2Col}>
                <Input label={t.institution} name="institution" value={edu.institution} onChange={(e) => handleDynamicChange<Education>('education', index, e)} />
                <Input label={t.degree} name="degree" value={edu.degree} onChange={(e) => handleDynamicChange<Education>('education', index, e)} />
                <Input label={t.period} name="period" value={edu.period} onChange={(e) => handleDynamicChange<Education>('education', index, e)} />
            </div>
          </div>
        ))}
        <button onClick={() => addDynamicItem('education')} className={styles.buttonAdd}>{t.addEducation}</button>
      </Section>

      <Section title={t.projects}>
        {data.projects.map((proj, index) => (
          <div key={proj.id} className={styles.dynamicItem}>
            <button onClick={() => removeDynamicItem('projects', index)} className={styles.dynamicItemRemoveButton}>{t.remove}</button>
            <div className={styles.grid2Col}>
                <Input label={t.projectName} name="name" value={proj.name} onChange={(e) => handleDynamicChange<Project>('projects', index, e)} />
                <Input label={t.link} name="link" value={proj.link} onChange={(e) => handleDynamicChange<Project>('projects', index, e)} />
            </div>
            <div className={styles.dynamicItemTextareaWrapper}>
                <label className={styles.dynamicItemTextareaLabel}>{t.description}</label>
                <textarea
                    name="description"
                    className={styles.textarea}
                    rows={3}
                    value={proj.description}
                    onChange={(e) => handleDynamicChange<Project>('projects', index, e)}
                ></textarea>
            </div>
          </div>
        ))}
        <button onClick={() => addDynamicItem('projects')} className={styles.buttonAdd}>{t.addProject}</button>
      </Section>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {children}
    </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className={styles.inputWrapper}>
    <input
      id={props.name}
      placeholder=" " 
      {...props}
      className={styles.input}
    />
    <label
      htmlFor={props.name}
      className={styles.inputLabel}
    >
      {label}
    </label>
  </div>
);