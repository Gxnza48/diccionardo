import { test } from 'node:test';
import assert from 'node:assert/strict';
import { words, sources, findWords } from '../src/data.js';
import { communityWords } from '../src/community-words.js';

test('every entry has a unique stable link and valid references', () => {
  const slugs = new Set(words.map(w => w.slug));
  assert.equal(slugs.size, words.length);
  for (const word of words) {
    assert.match(word.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(word.definition && word.note);
    assert.ok(word.example === null || typeof word.example === 'string');
    assert.ok(word.source === null || sources[word.source]);
    word.related.forEach(slug => assert.ok(slugs.has(slug), `Missing related word: ${slug}`));
  }
});

test('every supplied term is present once, preserving existing links', () => {
  const key = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  for (const entry of communityWords) {
    const matches = words.filter(w => key(w.word) === key(entry.termino));
    assert.equal(matches.length, 1, entry.termino);
    assert.deepEqual(matches[0].variants, entry.variantes);
  }
  assert.equal(words.length, 73);
  assert.equal(words.find(w => w.slug === 'buenardo').source, 'filo');
  assert.ok(words.some(w => w.slug === 'de-ruta-atlantica'));
});

test('variants are searchable and suffixes can be found by initial', () => {
  assert.ok(findWords('Pezzuti').some(w => w.slug === 'pesuti'));
  assert.ok(findWords('anashei').some(w => w.slug === 'anashe'));
  assert.ok(findWords('turbo sakado').some(w => w.slug === 'turbo-sacado'));
  assert.ok(findWords('', 'Sufijos', 'A').some(w => w.slug === 'ardo'));
  assert.ok(findWords('', 'Actuales').some(w => w.slug === 'turbo-chupete-en-el-anubius'));
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
