import { test } from 'node:test';
import assert from 'node:assert/strict';
import { words, sources, findWords } from '../src/data.js';

test('every entry has a unique stable link and valid references', () => {
  const slugs = new Set(words.map(w => w.slug));
  assert.equal(slugs.size, words.length);
  for (const word of words) {
    assert.match(word.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(word.definition && word.example && word.note);
    assert.ok(word.source === null || sources[word.source]);
    word.related.forEach(slug => assert.ok(slugs.has(slug), `Missing related word: ${slug}`));
  }
});

test('search is case and accent insensitive, and searches definitions', () => {
  assert.ok(findWords('  ATLANTICA  ').some(w => w.slug === 'de-ruta-atlantica'));
  assert.ok(findWords('rucula').some(w => w.slug === 'de-rucula'));
  assert.ok(findWords('festejo').some(w => w.slug === 'dou'));
  assert.equal(findWords('inexistente123').length, 0);
});

test('category, initial and query filters intersect', () => {
  assert.deepEqual(findWords('bueno', 'Clásicos', 'B').map(w => w.slug), ['buenardo']);
  assert.equal(findWords('', 'Reacciones', 'B').length, 0);
  assert.equal(findWords().length, words.length);
});
