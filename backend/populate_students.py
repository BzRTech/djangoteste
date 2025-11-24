#!/usr/bin/env python
"""
Script para popular mais alunos no banco de dados
Execute com: python manage.py shell < populate_students.py
ou: python populate_students.py
"""

import os
import sys
import django
from datetime import datetime, timedelta
import random

# Configurar Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

def populate_students():
    """Popula o banco com mais alunos"""

    sql = """
    -- Inserir mais 50 alunos distribuídos nas turmas existentes
    INSERT INTO tb_students (student_serial, student_name, id_class, enrollment_date, status, created_at)
    SELECT
      20250100 + seq AS student_serial,
      CASE seq
        WHEN 1 THEN 'Alice Monteiro da Silva'
        WHEN 2 THEN 'Bernardo Santos Costa'
        WHEN 3 THEN 'Camila Oliveira Pereira'
        WHEN 4 THEN 'Daniel Ferreira Souza'
        WHEN 5 THEN 'Eduarda Lima Alves'
        WHEN 6 THEN 'Felipe Rodrigues Barbosa'
        WHEN 7 THEN 'Giovanna Almeida Santos'
        WHEN 8 THEN 'Henrique Costa Martins'
        WHEN 9 THEN 'Isabela Souza Ribeiro'
        WHEN 10 THEN 'João Pedro Dias Moreira'
        WHEN 11 THEN 'Kauã Silva Carvalho'
        WHEN 12 THEN 'Laura Ferreira Rocha'
        WHEN 13 THEN 'Miguel Oliveira Gomes'
        WHEN 14 THEN 'Nina Pereira Cardoso'
        WHEN 15 THEN 'Otávio Santos Freitas'
        WHEN 16 THEN 'Paula Costa Nunes'
        WHEN 17 THEN 'Rafael Almeida Torres'
        WHEN 18 THEN 'Sofia Rodrigues Pinto'
        WHEN 19 THEN 'Thiago Lima Castro'
        WHEN 20 THEN 'Valentina Souza Ramos'
        WHEN 21 THEN 'William Ferreira Barros'
        WHEN 22 THEN 'Yasmin Santos Moura'
        WHEN 23 THEN 'Arthur Costa Teixeira'
        WHEN 24 THEN 'Beatriz Oliveira Campos'
        WHEN 25 THEN 'Caio Silva Monteiro'
        WHEN 26 THEN 'Débora Pereira Viana'
        WHEN 27 THEN 'Enzo Almeida Correia'
        WHEN 28 THEN 'Flávia Rodrigues Lopes'
        WHEN 29 THEN 'Gustavo Costa Mendes'
        WHEN 30 THEN 'Heloísa Santos Araújo'
        WHEN 31 THEN 'Igor Lima Batista'
        WHEN 32 THEN 'Júlia Ferreira Rezende'
        WHEN 33 THEN 'Leonardo Souza Cunha'
        WHEN 34 THEN 'Manuela Oliveira Duarte'
        WHEN 35 THEN 'Nicolas Costa Machado'
        WHEN 36 THEN 'Olívia Pereira Guimarães'
        WHEN 37 THEN 'Pedro Henrique Silva Fernandes'
        WHEN 38 THEN 'Rafaela Santos Cavalcanti'
        WHEN 39 THEN 'Samuel Almeida Nogueira'
        WHEN 40 THEN 'Taís Costa Brito'
        WHEN 41 THEN 'Victor Rodrigues Miranda'
        WHEN 42 THEN 'Wesley Lima Vargas'
        WHEN 43 THEN 'Yasmin Ferreira Matos'
        WHEN 44 THEN 'Zara Souza Fonseca'
        WHEN 45 THEN 'André Oliveira Prado'
        WHEN 46 THEN 'Bruna Costa Vieira'
        WHEN 47 THEN 'César Pereira Andrade'
        WHEN 48 THEN 'Daniela Santos Bezerra'
        WHEN 49 THEN 'Elias Silva Siqueira'
        WHEN 50 THEN 'Fernanda Almeida Coelho'
      END AS student_name,
      -- Distribui os alunos entre as turmas existentes de forma circular
      (SELECT id FROM tb_class ORDER BY id LIMIT 1 OFFSET (seq - 1) % (SELECT COUNT(*) FROM tb_class)) AS id_class,
      CURRENT_DATE - INTERVAL '3 months' * (random() * 12)::INTEGER AS enrollment_date,
      CASE
        WHEN random() < 0.95 THEN 'enrolled'
        ELSE 'inactive'
      END AS status,
      NOW() AS created_at
    FROM generate_series(1, 50) AS seq
    WHERE NOT EXISTS (
      SELECT 1 FROM tb_students WHERE student_serial BETWEEN 20250100 AND 20250150
    );
    """

    with connection.cursor() as cursor:
        try:
            print("Inserindo novos alunos...")
            cursor.execute(sql)

            # Verificar quantos alunos foram adicionados
            cursor.execute("SELECT COUNT(*) FROM tb_students WHERE student_serial BETWEEN 20250100 AND 20250150")
            count = cursor.fetchone()[0]
            print(f"✅ {count} novos alunos adicionados com sucesso!")

            # Mostrar total de alunos
            cursor.execute("SELECT COUNT(*) FROM tb_students")
            total = cursor.fetchone()[0]
            print(f"📊 Total de alunos no sistema: {total}")

            # Mostrar distribuição por turma
            cursor.execute("""
                SELECT
                  c.class_name,
                  c.school_name,
                  COUNT(s.id_student) as total_alunos
                FROM tb_class c
                LEFT JOIN tb_students s ON s.id_class = c.id
                GROUP BY c.id, c.class_name, c.school_name
                ORDER BY total_alunos DESC
            """)

            print("\n📚 Distribuição de alunos por turma:")
            print("-" * 60)
            for row in cursor.fetchall():
                print(f"{row[0]} ({row[1]}): {row[2]} alunos")

        except Exception as e:
            print(f"❌ Erro ao inserir alunos: {e}")
            raise

if __name__ == "__main__":
    populate_students()
