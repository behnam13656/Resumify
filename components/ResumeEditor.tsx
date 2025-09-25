import React, { useCallback } from 'react';
import type { ResumeData, PersonalInfo, Skill, Education, Experience, Project, Link } from '../types';
import { PlusIcon, TrashIcon } from './icons';
import { useTranslation } from '../App';

// Reusable UI Components defined locally for simplicity
const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-xl font-bold text-primary dark:text-primary-400 mb-4">{title}</h2>
    {children}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:text-white"
    />
  </div>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <textarea
      {...props}
      rows={5}
      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:text-white"
    />
  </div>
);

// Editor Section Components
const PersonalInfoForm: React.FC<{ data: PersonalInfo; onChange: (data: PersonalInfo) => void }> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const handleChange = (field: keyof PersonalInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };
  
  const handleLinkChange = (index: number, field: keyof Link, value: string) => {
    const newLinks = [...data.links];
    newLinks[index] = {...newLinks[index], [field]: value};
    onChange({...data, links: newLinks});
  }
  
  const addLink = () => {
    const newLinks = [...data.links, {id: `l${Date.now()}`, label: 'Portfolio', url: ''}];
    onChange({...data, links: newLinks});
  }

  const removeLink = (index: number) => {
    const newLinks = data.links.filter((_, i) => i !== index);
    onChange({...data, links: newLinks});
  }

  return (
    <Card title={t('editor.personalInfo')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label={t('editor.fullName')} value={data.name} onChange={(e) => handleChange('name', e.target.value)} />
        <Input label={t('editor.jobTitle')} value={data.title} onChange={(e) => handleChange('title', e.target.value)} />
        <Input label={t('editor.phone')} value={data.phone} onChange={(e) => handleChange('phone', e.target.value)} />
        <Input label={t('editor.email')} value={data.email} onChange={(e) => handleChange('email', e.target.value)} />
      </div>
      <Input label={t('editor.address')} value={data.address} onChange={(e) => handleChange('address', e.target.value)} />
      <Input label={t('editor.pictureUrl')} value={data.pictureUrl} onChange={(e) => handleChange('pictureUrl', e.target.value)} />
       <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">{t('editor.links')}</h3>
        {data.links.map((link, index) => (
          <div key={link.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end mb-2">
            <div className="col-span-2"><Input label={t('editor.label')} value={link.label} onChange={(e) => handleLinkChange(index, 'label', e.target.value)} /></div>
            <div className="col-span-2"><Input label={t('editor.url')} value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} /></div>
            <button onClick={() => removeLink(index)} className="p-2 h-10 mb-4 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center">
              <TrashIcon />
            </button>
          </div>
        ))}
        <button onClick={addLink} className="mt-2 text-sm text-primary dark:text-primary-400 hover:underline flex items-center space-x-1">
            <PlusIcon /><span>{t('editor.addLink')}</span>
        </button>
    </Card>
  );
};

const SummaryForm: React.FC<{ summary: string; onChange: (summary: string) => void }> = ({ summary, onChange }) => {
    const { t } = useTranslation();
    return (
        <Card title={t('editor.summary')}>
            <Textarea label={t('editor.professionalSummary')} value={summary} onChange={(e) => onChange(e.target.value)} />
        </Card>
    );
};


const SkillsForm: React.FC<{ skills: Skill[]; onChange: (skills: Skill[]) => void }> = ({ skills, onChange }) => {
    const { t } = useTranslation();
    const handleSkillChange = <K extends keyof Skill>(index: number, field: K, value: Skill[K]) => {
        const newSkills = [...skills];
        newSkills[index][field] = value;
        onChange(newSkills);
    };

    const addSkill = () => onChange([...skills, { id: `s${Date.now()}`, name: 'New Skill', level: 50 }]);
    const removeSkill = (index: number) => onChange(skills.filter((_, i) => i !== index));

    return (
        <Card title={t('editor.skills')}>
            {skills.map((skill, index) => (
                <div key={skill.id} className="flex items-center space-x-2 mb-2">
                    <div className="flex-grow"><Input label="" placeholder={t('editor.skillName')} value={skill.name} onChange={(e) => handleSkillChange(index, 'name', e.target.value)} /></div>
                    <input type="range" min="0" max="100" value={skill.level} onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value))} className="w-32 accent-primary"/>
                    <span className="w-10 text-right">{skill.level}%</span>
                    <button onClick={() => removeSkill(index)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center"><TrashIcon /></button>
                </div>
            ))}
            <button onClick={addSkill} className="mt-2 text-sm text-primary dark:text-primary-400 hover:underline flex items-center space-x-1"><PlusIcon /><span>{t('editor.addSkill')}</span></button>
        </Card>
    );
};

// Generic Section for Education, Experience, Projects
const SectionForm = <T extends {id: string}>(
    { title, items, onChange, defaultItem, renderItem, addItemLabel }:
    {
        title: string;
        items: T[];
        onChange: (items: T[]) => void;
        defaultItem: T;
        renderItem: (item: T, index: number, handleChange: (index: number, field: keyof T, value: any) => void) => React.ReactNode;
        addItemLabel: string;
    }
) => {
    const handleChange = useCallback((index: number, field: keyof T, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    }, [items, onChange]);

    const addItem = () => onChange([...items, { ...defaultItem, id: `${title.charAt(0).toLowerCase()}${Date.now()}` }]);
    const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));

    return (
        <Card title={title}>
            {items.map((item, index) => (
                <div key={item.id} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md relative">
                    {renderItem(item, index, handleChange)}
                    <button onClick={() => removeItem(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"><TrashIcon className="h-4 w-4" /></button>
                </div>
            ))}
            <button onClick={addItem} className="mt-2 text-sm text-primary dark:text-primary-400 hover:underline flex items-center space-x-1"><PlusIcon /><span>{addItemLabel}</span></button>
        </Card>
    );
};


interface ResumeEditorProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeData, setResumeData }) => {
  const { t } = useTranslation();
  const handleUpdate = <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => {
    setResumeData(prev => ({ ...prev, [section]: data }));
  };

  return (
    <div className="p-4 md:p-8">
      <PersonalInfoForm data={resumeData.personalInfo} onChange={(data) => handleUpdate('personalInfo', data)} />
      <SummaryForm summary={resumeData.summary} onChange={(data) => handleUpdate('summary', data)} />
      <SkillsForm skills={resumeData.skills} onChange={(data) => handleUpdate('skills', data)} />
      
      <SectionForm<Education>
        title={t('editor.education')}
        addItemLabel={t('editor.addEducation')}
        items={resumeData.education}
        onChange={(data) => handleUpdate('education', data)}
        defaultItem={{ id: '', institution: '', degree: '', startYear: '', endYear: '' }}
        renderItem={(item, index, handleChange) => (
          <>
            <Input label={t('editor.institution')} value={item.institution} onChange={(e) => handleChange(index, 'institution', e.target.value)} />
            <Input label={t('editor.degree')} value={item.degree} onChange={(e) => handleChange(index, 'degree', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label={t('editor.startYear')} value={item.startYear} onChange={(e) => handleChange(index, 'startYear', e.target.value)} />
              <Input label={t('editor.endYear')} value={item.endYear} onChange={(e) => handleChange(index, 'endYear', e.target.value)} />
            </div>
          </>
        )}
      />
      
      <SectionForm<Experience>
        title={t('editor.experience')}
        addItemLabel={t('editor.addExperience')}
        items={resumeData.experience}
        onChange={(data) => handleUpdate('experience', data)}
        defaultItem={{ id: '', company: '', role: '', duration: '', responsibilities: '' }}
        renderItem={(item, index, handleChange) => (
          <>
            <Input label={t('editor.company')} value={item.company} onChange={(e) => handleChange(index, 'company', e.target.value)} />
            <Input label={t('editor.role')} value={item.role} onChange={(e) => handleChange(index, 'role', e.target.value)} />
            <Input label={t('editor.duration')} value={item.duration} onChange={(e) => handleChange(index, 'duration', e.target.value)} />
            <Textarea label={t('editor.responsibilities')} value={item.responsibilities} onChange={(e) => handleChange(index, 'responsibilities', e.target.value)} />
          </>
        )}
      />

       <SectionForm<Project>
        title={t('editor.projects')}
        addItemLabel={t('editor.addProject')}
        items={resumeData.projects}
        onChange={(data) => handleUpdate('projects', data)}
        defaultItem={{ id: '', name: '', description: '' }}
        renderItem={(item, index, handleChange) => (
          <>
            <Input label={t('editor.projectName')} value={item.name} onChange={(e) => handleChange(index, 'name', e.target.value)} />
            <Textarea label={t('editor.description')} value={item.description} onChange={(e) => handleChange(index, 'description', e.target.value)} />
          </>
        )}
      />
    </div>
  );
};

export default ResumeEditor;