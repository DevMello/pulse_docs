import fs from 'node:fs';
import path from 'node:path';
import { Shell } from '../shell';

export default function McpPage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'mcp.html'), 'utf8');
  return (
    <Shell currentPath="/mcp/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
