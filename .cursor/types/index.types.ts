export type IndexKind = 'tasks' | 'rules' | 'procedures' | 'lessons' | 'decisions';

export interface IndexEntry {
  file: string;
  header: Record<string, unknown>;
}

export interface IndexJson {
  generatedAt: string;
  kind: IndexKind;
  count: number;
  entries: IndexEntry[];
}

export interface TaskHeader {
  name: string;
  number: number; // 3-digit integer, e.g. 1..999 mapped to 001..999 in filename
  status: 'idea' | 'backlog' | 'ready-to-do' | 'task' | 'wip' | 'done' | 'deferred';
  type?: 'feature' | 'bugfix' | 'refactor' | 'chore' | 'docs' | 'test' | 'style' | 'perf';
  scope?: 'docs' | 'design' | 'deploy' | 'build' | 'content' | 'code';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  effort?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  created?: string; // ISO date YYYY-MM-DD
  modified?: string; // ISO date YYYY-MM-DD
  dependencies?: string[]; // ["type:id", ...]
  related_tasks?: string[]; // ["task:NNN", ...]
  context_files?: string[]; // ["path/to/file.mdc", ...]
  tags?: string[];
  resolution?: 'accepted' | 'rejected' | 'deferred' | 'completed';
}



