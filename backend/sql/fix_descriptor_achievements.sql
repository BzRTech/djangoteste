-- Migração para permitir NULL em id_exam_application
-- Permite atribuição manual de descritores aos alunos

-- Alterar a coluna id_exam_application para permitir NULL
ALTER TABLE tb_student_descriptor_achievements
ALTER COLUMN id_exam_application DROP NOT NULL;

-- Adicionar constraint de unicidade para evitar duplicatas
-- Remove constraint antiga se existir
ALTER TABLE tb_student_descriptor_achievements
DROP CONSTRAINT IF EXISTS tb_student_descriptor_achievements_id_student_id_descriptor_key;

-- Adiciona nova constraint
ALTER TABLE tb_student_descriptor_achievements
ADD CONSTRAINT tb_student_descriptor_achievements_id_student_id_descriptor_key
UNIQUE (id_student, id_descriptor);

-- Verificar as alterações
\d tb_student_descriptor_achievements;
