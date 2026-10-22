import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateRepository } from '../scripts/validate.mjs';

const validSkill = '---\nname: example\ndescription: Use when testing a skill.\n---\n\n# Example\n';
const script = fileURLToPath(new URL('../scripts/validate.mjs', import.meta.url));

function fixture(t, content = validSkill) {
  const root = mkdtempSync(join(tmpdir(), 'skills-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'skills/example'), { recursive: true });
  if (content !== null) writeFileSync(join(root, 'skills/example/SKILL.md'), content);
  return root;
}

function addFile(root, path, content) {
  const file = join(root, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

for (const [name, content, error] of [
  ['missing SKILL.md', null, /SKILL\.md.*missing/i],
  ['missing frontmatter', '# Example\n', /frontmatter/i],
  ['malformed YAML', '---\nname: [\n---\n# Example\n', /YAML/i],
  ['non-mapping metadata', '---\n- name\n- example\n---\n# Example\n', /mapping/i],
  ['duplicate fields', validSkill.replace('name: example', 'name: example\nname: other'), /YAML/i],
  ['missing name', validSkill.replace('name: example\n', ''), /name/i],
  ['missing description', validSkill.replace('description: Use when testing a skill.\n', ''), /description/i],
  ['non-string description', validSkill.replace('Use when testing a skill.', '123'), /description/i],
  ['blank description', validSkill.replace('Use when testing a skill.', '"  "'), /description/i],
  ['long description', validSkill.replace('Use when testing a skill.', 'x'.repeat(1025)), /description/i],
  ['uppercase name', validSkill.replace('name: example', 'name: Example'), /name/i],
  ['consecutive hyphens', validSkill.replace('name: example', 'name: ex--ample'), /name/i],
  ['leading hyphen', validSkill.replace('name: example', 'name: -example'), /name/i],
  ['trailing hyphen', validSkill.replace('name: example', 'name: example-'), /name/i],
  ['long name', validSkill.replace('name: example', `name: ${'x'.repeat(65)}`), /name/i],
  ['directory-name mismatch', validSkill.replace('name: example', 'name: other'), /directory/i],
]) {
  test(`rejects ${name}`, (t) => {
    const errors = validateRepository(fixture(t, content));
    assert.match(errors.join('\n'), error);
    assert.match(errors.join('\n'), /skills\/example\/SKILL\.md/);
  });
}

test('rejects a repository without skills', (t) => {
  const root = fixture(t);
  rmSync(join(root, 'skills'), { recursive: true });
  assert.notEqual(validateRepository(root).length, 0);
  mkdirSync(join(root, 'skills'));
  assert.notEqual(validateRepository(root).length, 0);
});

test('accepts valid metadata, local links, and code placeholders', (t) => {
  const root = fixture(t, validSkill + '\n[Guide](references/guide.md#details)\n');
  addFile(root, 'skills/example/references/guide.md', [
    '[Back](../SKILL.md)',
    '[Local space](<../with space.md>)',
    '[Encoded space](../with%20space.md)',
    '[Reference][back]',
    '[back]: ../SKILL.md',
    '[Root](/LICENSE)',
    '[Web](https://example.com/missing)',
    '[Network](//example.com/missing)',
    '[Email](mailto:test@example.com)',
    '[Section](#details)',
    '`[Inline example](missing.md)`',
    '```text',
    '[<destination-name> monorepo](<destination-url>)',
    '```',
    '```html',
    '<a href="<destination-url>"><destination-name></a>',
    '```',
  ].join('\n'));
  addFile(root, 'skills/example/with space.md', '# A local file\n');
  addFile(root, 'LICENSE', 'MIT\n');
  assert.deepEqual(validateRepository(root), []);
});

for (const [name, content] of [
  ['link', '[Guide](missing.md)'],
  ['reference link', '[Guide][missing]\n\n[missing]: missing.md'],
  ['image', '![Diagram](missing.png)'],
  ['encoded link', '[Guide](missing%20file.md)'],
  ['malformed URL escape', '[Guide](bad%ZZ.md)'],
]) {
  test(`rejects a broken local ${name} in a nested reference file`, (t) => {
    const root = fixture(t);
    addFile(root, 'skills/example/references/guide.md', content);
    assert.match(validateRepository(root).join('\n'), /references\/guide\.md.*(missing|bad%ZZ)/);
  });
}

test('checks every skill directory', (t) => {
  const root = fixture(t);
  addFile(root, 'skills/second/SKILL.md', validSkill.replace('name: example', 'name: second'));
  assert.deepEqual(validateRepository(root), []);
  addFile(root, 'skills/second/SKILL.md', '# No metadata\n');
  assert.match(validateRepository(root).join('\n'), /skills\/second\/SKILL\.md/);
});

test('CLI returns a nonzero status for a broken skill', (t) => {
  const root = fixture(t);
  const valid = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
  assert.equal(valid.status, 0, valid.stderr);
  addFile(root, 'skills/example/reference.md', '[Missing](missing.md)\n');
  const invalid = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /reference\.md.*missing\.md/);
});
