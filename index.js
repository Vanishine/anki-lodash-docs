import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import fetch from 'node-fetch';
import { load } from 'cheerio';
import { stringify as toCSV } from 'csv-stringify';

const URL = 'https://lodash.com/docs/';

const content = await fetch(URL).then((res) => res.text());

const $ = load(content);

let result = $('.doc-container h3')
  .map((_, element) => ({
    title: $(element).prop('textContent'),
    desc: $(element).parent().find('p:nth-of-type(2)').prop('outerHTML'),
    code: $(element).parent().find('pre')?.prop('innerText'),
  }))
  .toArray();

const columns = ['title', 'desc', 'code'];
await mkdir('build');

toCSV(result, { header: false, columns }).pipe(
  createWriteStream('build/anki_lodash.csv')
);
