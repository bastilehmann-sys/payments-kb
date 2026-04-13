import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { reindex } from '@/lib/ingest/reindex';

reindex()
  .then(r => {
    console.log(JSON.stringify(r, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
