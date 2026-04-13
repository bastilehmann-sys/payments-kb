-- Drop chat tables (lookup-only mode)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chats CASCADE;

-- Drop embedding column and index from chunks (no longer needed)
DROP INDEX IF EXISTS chunks_embedding_idx;
ALTER TABLE chunks DROP COLUMN IF EXISTS embedding;
