import React, { useState, useEffect } from 'react';
import { Layers, Puzzle, Plus, Trash2, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/client';

export function ResourcesSettings() {
  const [activeTab, setActiveTab] = useState<'skills' | 'templates'>('skills');
  const [skills, setSkills] = useState<string[]>([]);
  const [templates, setTemplates] = useState<{name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Skill Form
  const [repoUrl, setRepoUrl] = useState('');
  const [skillPath, setSkillPath] = useState('');
  const [isSubmittingSkill, setIsSubmittingSkill] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'skills') {
          const res = await apiClient.get('/api/v1/resource/skill');
          if (mounted) setSkills(res.data.skills || []);
        } else {
          const res = await apiClient.get('/api/v1/resource/workflow_template');
          const tplList = Array.isArray(res.data.templates)
            ? res.data.templates
            : Object.keys(res.data.templates || {}).map(k => ({ name: k }));
          if (mounted) setTemplates(tplList);
        }
      } catch (err) {
        console.error('Failed to fetch resources', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [activeTab]);

  const fetchResources = async (tab: 'skills' | 'templates') => {
    setIsLoading(true);
    try {
      if (tab === 'skills') {
        const res = await apiClient.get('/api/v1/resource/skill');
        setSkills(res.data.skills || []);
      } else {
        const res = await apiClient.get('/api/v1/resource/workflow_template');
        const tplList = Array.isArray(res.data.templates)
          ? res.data.templates
          : Object.keys(res.data.templates || {}).map(k => ({ name: k }));
        setTemplates(tplList);
      }
    } catch (err) {
      console.error('Failed to fetch resources', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSkill(true);
    try {
      await apiClient.post('/api/v1/resource/skill', {
        repo_url: repoUrl,
        path: skillPath || null
      });
      setRepoUrl('');
      setSkillPath('');
      fetchResources(activeTab);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      alert(e.response?.data?.detail || 'Failed to install skill');
    } finally {
      setIsSubmittingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillName: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await apiClient.delete(`/api/v1/resource/skill/${skillName}`);
      fetchResources(activeTab);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      alert(e.response?.data?.detail || 'Failed to delete skill. Requires Super Admin.');
    }
  };

  const handleDeleteTemplate = async (templateName: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await apiClient.delete(`/api/v1/resource/workflow_template/${templateName}`);
      fetchResources(activeTab);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      alert(e.response?.data?.detail || 'Failed to delete template. Requires Super Admin.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Resources Management</h3>
        <p className="text-sm text-slate-500 mt-1">Manage external skills and workflow templates.</p>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'skills' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center">
            <Puzzle size={16} className="mr-2" />
            Skills (Tools)
          </div>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'templates' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center">
            <Layers size={16} className="mr-2" />
            Workflow Templates
          </div>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      ) : activeTab === 'skills' ? (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
              Install New Skill
            </h4>
            <form onSubmit={handleAddSkill} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Git Repository URL</label>
                <input
                  type="text" required value={repoUrl} onChange={e => setRepoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Path (Optional)</label>
                <input
                  type="text" value={skillPath} onChange={e => setSkillPath(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2"
                  placeholder="/src/skills/..."
                />
              </div>
              <button
                type="submit" disabled={isSubmittingSkill}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmittingSkill ? <Loader2 size={16} className="animate-spin mr-2" /> : <Plus size={16} className="mr-2" />}
                Install
              </button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Skill Name</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {skills.length === 0 ? (
                  <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-500">No skills installed</td></tr>
                ) : (
                  skills.map((skill, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 flex items-center">
                        <Puzzle size={16} className="mr-3 text-slate-400" />
                        {skill}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteSkill(skill)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Template Name</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {templates.length === 0 ? (
                  <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-500">No templates found</td></tr>
                ) : (
                  templates.map((tpl, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 flex items-center">
                        <Layers size={16} className="mr-3 text-slate-400" />
                        {tpl.name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteTemplate(tpl.name)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
