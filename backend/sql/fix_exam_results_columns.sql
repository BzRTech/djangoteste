-- Script para adicionar colunas faltantes na tabela tb_exam_results
-- Execute este script no seu banco de dados PostgreSQL

-- Adicionar colunas se elas não existirem
ALTER TABLE tb_exam_results
ADD COLUMN IF NOT EXISTS correct_answers int4 NULL,
ADD COLUMN IF NOT EXISTS wrong_answers int4 NULL,
ADD COLUMN IF NOT EXISTS blank_answers int4 NULL,
ADD COLUMN IF NOT EXISTS started_at timestamptz NULL,
ADD COLUMN IF NOT EXISTS finished_at timestamptz NULL;

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tb_exam_results'
ORDER BY ordinal_position;
