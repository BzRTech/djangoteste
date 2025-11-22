-- ============================================
-- SCRIPT PARA POPULAR DADOS DE TESTE
-- Sistema de Gerenciamento de Provas e Alunos
-- ============================================

-- 1. Verificar dados existentes antes de popular
-- Execute estas queries separadamente para ver o que já existe:
-- SELECT * FROM tb_city;
-- SELECT * FROM tb_school;
-- SELECT * FROM tb_teacher;
-- SELECT * FROM tb_class;
-- SELECT * FROM tb_students;

-- ============================================
-- 2. POPULAR DESCRITORES (se não existirem)
-- ============================================

-- Inserir descritores de Matemática
INSERT INTO tb_descriptors_catalog (subject, learning_field, grade, descriptor_code, descriptor_name, descriptor_description, icon, created_at)
VALUES
  ('Matemática', 'Números e Operações', '5º Ano', 'D1-MAT5', 'Identificar a localização/movimentação de objeto em mapas', 'Identificar a localização/movimentação de objeto em mapas, croquis e outras representações gráficas', '🧮', NOW()),
  ('Matemática', 'Números e Operações', '5º Ano', 'D2-MAT5', 'Identificar propriedades comuns e diferenças entre figuras', 'Identificar propriedades comuns e diferenças entre figuras bidimensionais e tridimensionais', '📐', NOW()),
  ('Matemática', 'Números e Operações', '5º Ano', 'D3-MAT5', 'Identificar propriedades de triângulos', 'Identificar propriedades de triângulos pela comparação de medidas de lados e ângulos', '🔺', NOW()),
  ('Matemática', 'Grandezas e Medidas', '5º Ano', 'D4-MAT5', 'Identificar horas em relógios digitais e analógicos', 'Identificar horas em relógios digitais e analógicos', '⏰', NOW()),
  ('Matemática', 'Tratamento da Informação', '5º Ano', 'D5-MAT5', 'Ler informações em gráficos e tabelas', 'Ler informações e dados apresentados em tabelas e gráficos', '📊', NOW())
ON CONFLICT (descriptor_code) DO NOTHING;

-- Inserir descritores de Português
INSERT INTO tb_descriptors_catalog (subject, learning_field, grade, descriptor_code, descriptor_name, descriptor_description, icon, created_at)
VALUES
  ('Português', 'Leitura', '5º Ano', 'D1-PORT5', 'Localizar informações explícitas em um texto', 'Localizar informações explícitas em um texto', '🔍', NOW()),
  ('Português', 'Leitura', '5º Ano', 'D2-PORT5', 'Inferir o sentido de uma palavra ou expressão', 'Inferir o sentido de uma palavra ou expressão', '💭', NOW()),
  ('Português', 'Leitura', '5º Ano', 'D3-PORT5', 'Inferir uma informação implícita em um texto', 'Inferir uma informação implícita em um texto', '🎯', NOW()),
  ('Português', 'Leitura', '5º Ano', 'D4-PORT5', 'Identificar o tema de um texto', 'Identificar o tema de um texto', '📖', NOW()),
  ('Português', 'Gramática', '5º Ano', 'D5-PORT5', 'Distinguir fato de opinião', 'Distinguir um fato da opinião relativa a esse fato', '💬', NOW())
ON CONFLICT (descriptor_code) DO NOTHING;

-- ============================================
-- 3. POPULAR ALUNOS (associados às turmas existentes)
-- ============================================

-- Buscar uma turma existente para associar alunos
-- Se você já tem turmas, use o ID delas. Caso contrário, este script assume que existe uma turma com id=1

-- Inserir alunos na turma (ajuste id_class conforme suas turmas)
INSERT INTO tb_students (student_serial, student_name, id_class, enrollment_date, status, created_at)
SELECT
  20250001 + seq AS student_serial,
  CASE seq
    WHEN 1 THEN 'Ana Paula Silva'
    WHEN 2 THEN 'Bruno Costa Santos'
    WHEN 3 THEN 'Carlos Eduardo Oliveira'
    WHEN 4 THEN 'Diana Ferreira Lima'
    WHEN 5 THEN 'Eduardo Martins Rocha'
    WHEN 6 THEN 'Fernanda Souza Alves'
    WHEN 7 THEN 'Gabriel Henrique Dias'
    WHEN 8 THEN 'Helena Castro Pires'
    WHEN 9 THEN 'Igor Pereira Nunes'
    WHEN 10 THEN 'Julia Rodrigues Melo'
    WHEN 11 THEN 'Kevin Almeida Torres'
    WHEN 12 THEN 'Larissa Barbosa Ramos'
    WHEN 13 THEN 'Marcos Vinicius Cardoso'
    WHEN 14 THEN 'Natália Gomes Freitas'
    WHEN 15 THEN 'Otávio Ribeiro Moura'
  END AS student_name,
  (SELECT id FROM tb_class LIMIT 1) AS id_class,  -- Pega a primeira turma disponível
  CURRENT_DATE - INTERVAL '6 months' AS enrollment_date,
  'enrolled' AS status,
  NOW() AS created_at
FROM generate_series(1, 15) AS seq
WHERE NOT EXISTS (
  SELECT 1 FROM tb_students WHERE student_serial BETWEEN 20250001 AND 20250015
);

-- ============================================
-- 4. CRIAR PROVA DE EXEMPLO
-- ============================================

-- Inserir prova de Matemática
INSERT INTO tb_exams (exam_code, exam_name, subject, school_year, total_questions, description, created_at)
VALUES
  ('MAT-2025-01', 'Avaliação Diagnóstica - Matemática 5º Ano', 'Matemática', 2025, 5,
   'Avaliação diagnóstica para identificar o nível de conhecimento dos alunos em Matemática', NOW())
ON CONFLICT (exam_code) DO NOTHING;

-- Buscar o ID da prova criada
DO $$
DECLARE
  v_exam_id INTEGER;
  v_descriptor1_id INTEGER;
  v_descriptor2_id INTEGER;
  v_descriptor3_id INTEGER;
  v_descriptor4_id INTEGER;
  v_descriptor5_id INTEGER;
BEGIN
  -- Buscar ID da prova
  SELECT id INTO v_exam_id FROM tb_exams WHERE exam_code = 'MAT-2025-01' LIMIT 1;

  -- Buscar IDs dos descritores
  SELECT id INTO v_descriptor1_id FROM tb_descriptors_catalog WHERE descriptor_code = 'D1-MAT5' LIMIT 1;
  SELECT id INTO v_descriptor2_id FROM tb_descriptors_catalog WHERE descriptor_code = 'D2-MAT5' LIMIT 1;
  SELECT id INTO v_descriptor3_id FROM tb_descriptors_catalog WHERE descriptor_code = 'D3-MAT5' LIMIT 1;
  SELECT id INTO v_descriptor4_id FROM tb_descriptors_catalog WHERE descriptor_code = 'D4-MAT5' LIMIT 1;
  SELECT id INTO v_descriptor5_id FROM tb_descriptors_catalog WHERE descriptor_code = 'D5-MAT5' LIMIT 1;

  -- Inserir questões apenas se a prova existe e não tem questões
  IF v_exam_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM tb_questions WHERE id_exam = v_exam_id) THEN

    -- Questão 1
    INSERT INTO tb_questions (id_exam, question_number, question_text, question_type, difficulty_level, points, id_descriptor, created_at)
    VALUES (v_exam_id, 1,
      'João está na posição (3, 2) do mapa da escola. Se ele andar 2 casas para a direita e 1 casa para cima, em qual posição ele ficará?',
      'multiple_choice', 'easy', 1.0, v_descriptor1_id, NOW());

    -- Alternativas da Questão 1
    INSERT INTO tb_alternatives (id_question, alternative_order, alternative_text, is_correct, created_at)
    VALUES
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 1), 1, '(5, 3)', true, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 1), 2, '(4, 3)', false, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 1), 3, '(5, 2)', false, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 1), 4, '(3, 4)', false, NOW());

    -- Questão 2
    INSERT INTO tb_questions (id_exam, question_number, question_text, question_type, difficulty_level, points, id_descriptor, created_at)
    VALUES (v_exam_id, 2,
      'Qual das figuras abaixo é uma figura tridimensional?',
      'multiple_choice', 'easy', 1.0, v_descriptor2_id, NOW());

    -- Alternativas da Questão 2
    INSERT INTO tb_alternatives (id_question, alternative_order, alternative_text, is_correct, created_at)
    VALUES
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 2), 1, 'Quadrado', false, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 2), 2, 'Cubo', true, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 2), 3, 'Triângulo', false, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 2), 4, 'Círculo', false, NOW());

    -- Questão 3
    INSERT INTO tb_questions (id_exam, question_number, question_text, question_type, difficulty_level, points, id_descriptor, created_at)
    VALUES (v_exam_id, 3,
      'Um triângulo possui três lados medindo 5cm, 5cm e 8cm. Esse triângulo é:',
      'multiple_choice', 'medium', 1.0, v_descriptor3_id, NOW());

    -- Alternativas da Questão 3
    INSERT INTO tb_alternatives (id_question, alternative_order, alternative_text, is_correct, created_at)
    VALUES
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 3), 1, 'Equilátero', false, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 3), 2, 'Isósceles', true, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 3), 3, 'Escaleno', false, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 3), 4, 'Retângulo', false, NOW());

    -- Questão 4
    INSERT INTO tb_questions (id_exam, question_number, question_text, question_type, difficulty_level, points, id_descriptor, created_at)
    VALUES (v_exam_id, 4,
      'Maria começou a fazer a lição às 14:30. Se ela levou 45 minutos para terminar, que horas ela terminou?',
      'multiple_choice', 'medium', 1.0, v_descriptor4_id, NOW());

    -- Alternativas da Questão 4
    INSERT INTO tb_alternatives (id_question, alternative_order, alternative_text, is_correct, created_at)
    VALUES
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 4), 1, '15:00', false, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 4), 2, '15:15', true, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 4), 3, '15:30', false, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 4), 4, '15:45', false, NOW());

    -- Questão 5
    INSERT INTO tb_questions (id_exam, question_number, question_text, question_type, difficulty_level, points, id_descriptor, created_at)
    VALUES (v_exam_id, 5,
      'Observe o gráfico que mostra a quantidade de livros lidos por 4 alunos em um mês:\nJoão: 5 livros\nMaria: 8 livros\nPedro: 3 livros\nAna: 6 livros\n\nQuem leu mais livros?',
      'multiple_choice', 'easy', 1.0, v_descriptor5_id, NOW());

    -- Alternativas da Questão 5
    INSERT INTO tb_alternatives (id_question, alternative_order, alternative_text, is_correct, created_at)
    VALUES
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 5), 1, 'João', false, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 5), 2, 'Maria', true, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 5), 3, 'Pedro', false, NOW()),
      ((SELECT id FROM tb_questions WHERE id_exam = v_exam_id AND question_number = 5), 4, 'Ana', false, NOW());

  END IF;
END $$;

-- ============================================
-- 5. CRIAR APLICAÇÃO DA PROVA
-- ============================================

-- Inserir aplicação da prova para a turma
INSERT INTO tb_exam_applications (id_exam, id_class, id_teacher, application_date, start_time, end_time, fiscal_year, status, application_type, assessment_period, created_at)
SELECT
  (SELECT id FROM tb_exams WHERE exam_code = 'MAT-2025-01' LIMIT 1),
  (SELECT id FROM tb_class LIMIT 1),
  (SELECT id_teacher FROM tb_class LIMIT 1),
  CURRENT_DATE,
  '08:00:00',
  '09:00:00',
  2025,
  'completed',
  'diagnostic',
  'Q1',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM tb_exam_applications
  WHERE id_exam = (SELECT id FROM tb_exams WHERE exam_code = 'MAT-2025-01' LIMIT 1)
);

-- ============================================
-- 6. GERAR RESPOSTAS DOS ALUNOS (SIMULADAS)
-- ============================================

DO $$
DECLARE
  v_application_id INTEGER;
  v_exam_id INTEGER;
  v_student RECORD;
  v_question RECORD;
  v_correct_alt_id INTEGER;
  v_selected_alt_id INTEGER;
  v_random_num INTEGER;
  v_total_score DECIMAL(5,2);
  v_max_score DECIMAL(5,2);
  v_correct_count INTEGER;
  v_wrong_count INTEGER;
BEGIN
  -- Buscar ID da aplicação
  SELECT id INTO v_application_id FROM tb_exam_applications
  WHERE id_exam = (SELECT id FROM tb_exams WHERE exam_code = 'MAT-2025-01' LIMIT 1) LIMIT 1;

  SELECT id INTO v_exam_id FROM tb_exams WHERE exam_code = 'MAT-2025-01' LIMIT 1;

  IF v_application_id IS NOT NULL THEN
    -- Para cada aluno
    FOR v_student IN (SELECT id_student FROM tb_students ORDER BY id_student LIMIT 15) LOOP
      v_total_score := 0;
      v_max_score := 0;
      v_correct_count := 0;
      v_wrong_count := 0;

      -- Para cada questão da prova
      FOR v_question IN (SELECT id, points FROM tb_questions WHERE id_exam = v_exam_id ORDER BY question_number) LOOP
        v_max_score := v_max_score + v_question.points;

        -- Buscar alternativa correta
        SELECT id INTO v_correct_alt_id
        FROM tb_alternatives
        WHERE id_question = v_question.id AND is_correct = true
        LIMIT 1;

        -- Simular resposta (70% de chance de acertar)
        v_random_num := floor(random() * 100)::INTEGER;

        IF v_random_num < 70 THEN
          -- Acertou
          v_selected_alt_id := v_correct_alt_id;
          v_total_score := v_total_score + v_question.points;
          v_correct_count := v_correct_count + 1;
        ELSE
          -- Errou - selecionar alternativa errada aleatória
          SELECT id INTO v_selected_alt_id
          FROM tb_alternatives
          WHERE id_question = v_question.id AND is_correct = false
          ORDER BY random()
          LIMIT 1;
          v_wrong_count := v_wrong_count + 1;
        END IF;

        -- Inserir resposta do aluno
        INSERT INTO tb_student_answers (id_student, id_exam_application, id_question, id_selected_alternative, is_correct, answered_at)
        VALUES (
          v_student.id_student,
          v_application_id,
          v_question.id,
          v_selected_alt_id,
          (v_selected_alt_id = v_correct_alt_id),
          NOW()
        )
        ON CONFLICT (id_student, id_exam_application, id_question) DO NOTHING;
      END LOOP;

      -- Criar resultado do aluno
      INSERT INTO tb_exam_results (id_student, id_exam_application, total_score, max_score, correct_answers, wrong_answers, blank_answers, created_at)
      VALUES (
        v_student.id_student,
        v_application_id,
        v_total_score,
        v_max_score,
        v_correct_count,
        v_wrong_count,
        0,
        NOW()
      )
      ON CONFLICT (id_student, id_exam_application) DO NOTHING;

      -- Registrar conquistas de descritores (acertou a questão = conquistou o descritor)
      FOR v_question IN (
        SELECT q.id, q.id_descriptor
        FROM tb_questions q
        INNER JOIN tb_student_answers sa ON sa.id_question = q.id
        WHERE sa.id_student = v_student.id_student
          AND sa.id_exam_application = v_application_id
          AND sa.is_correct = true
          AND q.id_descriptor IS NOT NULL
      ) LOOP
        INSERT INTO tb_student_descriptor_achievements (id_student, id_descriptor, id_exam_application, achieved_at)
        VALUES (
          v_student.id_student,
          v_question.id_descriptor,
          v_application_id,
          NOW()
        )
        ON CONFLICT (id_student, id_descriptor, id_exam_application) DO NOTHING;

        -- Registrar progresso de aprendizagem
        INSERT INTO tb_student_learning_progress (
          id_student, id_descriptor, id_exam_application,
          score, max_score, descriptor_mastery, assessment_date, created_at
        )
        VALUES (
          v_student.id_student,
          v_question.id_descriptor,
          v_application_id,
          1.0,
          1.0,
          100.0,
          CURRENT_DATE,
          NOW()
        )
        ON CONFLICT DO NOTHING;
      END LOOP;

    END LOOP;
  END IF;
END $$;

-- ============================================
-- 7. VERIFICAR DADOS CRIADOS
-- ============================================

-- Execute estas queries para verificar se os dados foram inseridos corretamente:
SELECT 'Descritores cadastrados:', COUNT(*) FROM tb_descriptors_catalog;
SELECT 'Alunos cadastrados:', COUNT(*) FROM tb_students WHERE student_serial BETWEEN 20250001 AND 20250015;
SELECT 'Provas cadastradas:', COUNT(*) FROM tb_exams WHERE exam_code = 'MAT-2025-01';
SELECT 'Questões cadastradas:', COUNT(*) FROM tb_questions WHERE id_exam = (SELECT id FROM tb_exams WHERE exam_code = 'MAT-2025-01' LIMIT 1);
SELECT 'Aplicações cadastradas:', COUNT(*) FROM tb_exam_applications;
SELECT 'Respostas registradas:', COUNT(*) FROM tb_student_answers;
SELECT 'Resultados registrados:', COUNT(*) FROM tb_exam_results;
SELECT 'Descritores conquistados:', COUNT(*) FROM tb_student_descriptor_achievements;

-- Para ver os dados detalhadamente:
-- SELECT * FROM tb_students ORDER BY id_student DESC LIMIT 15;
-- SELECT * FROM tb_exam_results ORDER BY id DESC;
-- SELECT * FROM tb_student_descriptor_achievements ORDER BY id DESC;
