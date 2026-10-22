import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { parse } from 'yaml';

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && entry.name.endsWith('.md') ? [path] : [];
  });
}

function checkMetadata(source, directory, report) {
  const frontmatter = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) {
    report('Missing YAML frontmatter.');
    return source;
  }
  const body = source.slice(frontmatter[0].length);
  let metadata;
  try {
    metadata = parse(frontmatter[1]);
  } catch (error) {
    report(`Invalid YAML: ${error.message}`);
    return body;
  }
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    report('Metadata must be a YAML mapping.');
    return body;
  }
  const { name, description } = metadata;
  if (typeof name !== 'string' || name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    report('The name must use 1–64 lowercase letters, digits, or single hyphens between words.');
  }
  if (name !== basename(directory)) report('The name must match the skill directory.');
  if (typeof description !== 'string' || !description.trim() || description.length > 1024) {
    report('The description must contain 1–1024 characters and must not be blank.');
  }
  return body;
}

function checkLinks(source, file, root, report) {
  function visit(node) {
    if (['link', 'image', 'definition'].includes(node.type)) {
      const url = node.url;
      if (!/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) {
        try {
          const path = decodeURIComponent(url.split(/[?#]/)[0]);
          const target = path.startsWith('/') ? resolve(root, `.${path}`) : resolve(dirname(file), path);
          if (path && !existsSync(target)) report(`Missing local link target: ${url}`);
        } catch {
          report(`Invalid local link target: ${url}`);
        }
      }
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(fromMarkdown(source));
}

export function validateRepository(root) {
  const errors = [];
  const skillsPath = join(root, 'skills');
  if (!existsSync(skillsPath)) return ['skills/: Missing skills directory.'];
  const skills = readdirSync(skillsPath, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  if (!skills.length) return ['skills/: No skill directories found.'];

  for (const skill of skills) {
    const directory = join(skillsPath, skill.name);
    const entrypoint = join(directory, 'SKILL.md');
    if (!existsSync(entrypoint)) {
      errors.push(`${relative(root, entrypoint)}: Missing SKILL.md.`);
      continue;
    }
    if (!lstatSync(entrypoint).isFile()) {
      errors.push(`${relative(root, entrypoint)}: SKILL.md must be a regular file, not a directory or symlink.`);
      continue;
    }
    for (const file of markdownFiles(directory)) {
      const report = (message) => errors.push(`${relative(root, file)}: ${message}`);
      let source;
      try {
        source = readFileSync(file, 'utf8');
      } catch (error) {
        report(`Cannot read Markdown file: ${error.message}`);
        continue;
      }
      if (file === entrypoint) source = checkMetadata(source, directory, report);
      checkLinks(source, file, root, report);
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const errors = validateRepository(process.cwd());
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Skill metadata and local Markdown links are valid.');
  }
}
