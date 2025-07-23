import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';

const VersionControl = ({ 
  branches, 
  commits, 
  onCreateBranch, 
  onMergeBranch, 
  onRevertCommit,
  currentBranch 
}) => {
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeBranch, setMergeBranch] = useState("");

  const handleCreateBranch = () => {
    if (newBranchName.trim()) {
      onCreateBranch(newBranchName);
      setNewBranchName("");
      setShowCreateBranch(false);
    }
  };

  const handleMerge = () => {
    if (mergeBranch) {
      onMergeBranch(mergeBranch, currentBranch);
      setMergeBranch("");
      setShowMergeModal(false);
    }
  };

  const getCommitTypeIcon = (type) => {
    switch (type) {
      case 'feature': return { icon: 'Plus', color: 'text-success' };
      case 'fix': return { icon: 'Wrench', color: 'text-warning' };
      case 'update': return { icon: 'Edit', color: 'text-primary' };
      case 'merge': return { icon: 'GitMerge', color: 'text-secondary' };
      default: return { icon: 'GitCommit', color: 'text-muted-foreground' };
    }
  };

  const getBranchStatus = (branch) => {
    if (branch.name === currentBranch) return { status: 'current', color: 'text-success bg-success/10' };
    if (branch.hasConflicts) return { status: 'conflicts', color: 'text-error bg-error/10' };
    if (branch.needsReview) return { status: 'review', color: 'text-warning bg-warning/10' };
    return { status: 'ready', color: 'text-primary bg-primary/10' };
  };

  return (
    <div className="space-y-6">
      {/* Branch Management */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Branches</h3>
            <p className="text-sm text-muted-foreground">Manage project branches</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateBranch(true)}
              iconName="GitBranch"
              iconPosition="left"
            >
              New Branch
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowMergeModal(true)}
              iconName="GitMerge"
              iconPosition="left"
            >
              Merge
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {(branches || []).map((branch) => {
            const statusConfig = getBranchStatus(branch);
            
            return (
              <div key={branch.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Icon name="GitBranch" size={16} className="text-muted-foreground" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{branch.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        {statusConfig.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {branch.commitsAhead} ahead, {branch.commitsBehind} behind • Last updated {branch.lastUpdated}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {(branch.contributors || []).slice(0, 3).map((contributor, index) => (
                      <Image
                        key={index}
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-6 h-6 rounded-full border-2 border-background"
                      />
                    ))}
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    <Icon name="MoreHorizontal" size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Commit History */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Recent Commits</h3>
            <p className="text-sm text-muted-foreground">Latest changes to {currentBranch}</p>
          </div>
          <Button variant="ghost" size="sm" iconName="History">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {(commits || []).map((commit) => {
            const typeConfig = getCommitTypeIcon(commit.type);
            
            return (
              <div 
                key={commit.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedCommit === commit.id 
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedCommit(selectedCommit === commit.id ? null : commit.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center`}>
                    <Icon name={typeConfig.icon} size={14} className={typeConfig.color} />
                  </div>
                  <Image
                    src={commit?.author?.avatar}
                    alt={commit?.author?.name}
                    className="w-6 h-6 rounded-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground truncate">{commit.message}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{commit.timestamp}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRevertCommit?.(commit.id);
                        }}
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="Undo" size={12} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-muted-foreground">{commit?.author?.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{commit.hash}</span>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="text-success">+{commit.additions}</span>
                      <span className="text-error">-{commit.deletions}</span>
                    </div>
                  </div>

                  {selectedCommit === commit.id && (
                    <div className="mt-3 p-3 bg-muted/30 rounded text-sm">
                      <p className="text-muted-foreground mb-2">Changes:</p>
                      <div className="space-y-1">
                        {(commit.files || []).map((file, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Icon name="FileText" size={12} className="text-muted-foreground" />
                            <span className="text-foreground">{file.name}</span>
                            <span className="text-xs text-success">+{file.additions}</span>
                            <span className="text-xs text-error">-{file.deletions}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Branch Modal */}
      {showCreateBranch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Branch</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateBranch(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                label="Branch Name"
                type="text"
                placeholder="feature/new-component"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                description="Use descriptive names like feature/name or fix/issue"
                required
              />

              <div className="flex items-center space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateBranch(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleCreateBranch}
                  className="flex-1 brand-gradient"
                  disabled={!newBranchName.trim()}
                >
                  Create Branch
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Merge Modal */}
      {showMergeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Merge Branch</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMergeModal(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Merge from
                </label>
                <select
                  value={mergeBranch}
                  onChange={(e) => setMergeBranch(e.target.value)}
                  className="w-full p-2 bg-input border border-border rounded-lg text-foreground"
                >
                  <option value="">Select branch to merge</option>
                  {(branches || [])
                    .filter(branch => branch.name !== currentBranch)
                    .map(branch => (
                      <option key={branch.id} value={branch.name}>
                        {branch.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This will merge <span className="font-medium text-foreground">{mergeBranch}</span> into{' '}
                  <span className="font-medium text-foreground">{currentBranch}</span>
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowMergeModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleMerge}
                  className="flex-1 brand-gradient"
                  disabled={!mergeBranch}
                >
                  Merge Branch
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionControl;