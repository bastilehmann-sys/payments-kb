import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { reindex } from '@/lib/ingest/reindex';

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error('Set OPENAI_API_KEY in env to run local reindex');
  process.exit(1);
}

reindex({ openaiKey: key })
  .then(r => {
    console.log(JSON.stringify(r, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
