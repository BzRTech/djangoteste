-- Migration: Adiciona campo exam_file na tabela tb_exams
-- Data: 2024-12-02
-- Descrição: Campo para armazenar URL do arquivo da prova no S3

-- Adiciona coluna exam_file (URL do arquivo no S3 ou local)
ALTER TABLE tb_exams
ADD COLUMN exam_file VARCHAR(500) NULL;

-- Adiciona comentário na coluna
COMMENT ON COLUMN tb_exams.exam_file IS 'URL do arquivo da prova (PDF, imagem, etc) armazenado no S3 ou storage local';

-- Adiciona índice para buscas mais rápidas (opcional)
CREATE INDEX idx_tb_exams_exam_file ON tb_exams(exam_file) WHERE exam_file IS NOT NULL;
