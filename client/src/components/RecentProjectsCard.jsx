import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/services/authService';
import { getWizardWorkflows } from '@/services/wizardService';

export default function RecentProjectsCard({ title = 'Recent Projects', onOpen }) {
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getWizardWorkflows({ limit: 10, sort: '-updatedAt' });
        const workflows = response?.data?.workflows || [];
        setRecentProjects(workflows);
      } catch (err) {
        console.error('Error fetching recent projects:', err);
        setError('Failed to load recent projects');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="rounded-2xl border border-[#DED6CC] bg-[#FCFAF6] shadow-xs">
      <div className="px-4 py-3 border-b border-[#DED6CC] bg-[#F5F0E8]/50">
        <h3 className="text-lg font-semibold text-[#342744]">{title}</h3>
        <p className="text-xs text-[#342744]/60">Your latest wizard workflows</p>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="text-center py-6">
            <div className="w-5 h-5 border-2 border-[#68538C] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-[#68538C] mt-2">Loading projects...</p>
          </div>
        ) : error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : recentProjects.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentProjects.map((project) => (
              <button
                key={project._id}
                onClick={() => onOpen?.(project._id)}
                className="w-full text-left p-3 rounded-xl border border-[#DED6CC] hover:border-[#68538C] hover:bg-[#F5F0E8] transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[#342744] truncate group-hover:text-[#68538C]">
                      {project.name}
                    </h4>
                    <p className="text-xs text-[#342744]/70 mt-1 line-clamp-2">
                      {project.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#342744]/50">
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                      <span>{project.completionPercentage || 0}% complete</span>
                    </div>
                  </div>
                  <div className="ml-2 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      project.status === 'completed' ? 'bg-[#8FAF9A]' :
                      project.status === 'submitted' ? 'bg-[#526B91]' :
                      project.completionPercentage > 0 ? 'bg-[#C9A96E]' : 'bg-[#DED6CC]'
                    }`} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-xs text-[#342744]/70">No recent projects</p>
            <p className="text-xs text-[#342744]/50 mt-1">Create a project to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
