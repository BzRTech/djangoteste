#!/usr/bin/env python3
"""
Script de Teste QA Completo
Testa todo o fluxo: Escola → Turma → Alunos → Prova → Questões → Aplicação → Respostas → Perfil
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any
import sys

# Configurações
BASE_URL = "http://localhost:8000/api"
HEADERS = {"Content-Type": "application/json"}

# Cores para output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✅ {msg}{Colors.END}")

def print_error(msg):
    print(f"{Colors.RED}❌ {msg}{Colors.END}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.END}")

def print_section(msg):
    print(f"\n{Colors.BOLD}{Colors.YELLOW}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.YELLOW}{msg}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.YELLOW}{'='*60}{Colors.END}\n")

def check_api_health():
    """Verifica se a API está respondendo"""
    try:
        response = requests.get(f"{BASE_URL}/schools/", timeout=5)
        if response.status_code in [200, 401, 403]:
            print_success("API está respondendo")
            return True
        else:
            print_error(f"API retornou status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Não foi possível conectar à API: {e}")
        return False

# ==================== STEP 1: CRIAR ESCOLA ====================
def create_school() -> Dict:
    print_section("STEP 1: CADASTRAR ESCOLA")

    # Primeiro, verificar se existe cidade
    print_info("Verificando cidades disponíveis...")
    response = requests.get(f"{BASE_URL}/cities/")

    if response.status_code != 200:
        print_error(f"Erro ao buscar cidades: {response.status_code}")
        sys.exit(1)

    cities_data = response.json()
    if not cities_data.get('results'):
        print_error("Nenhuma cidade cadastrada. Execute o script de população primeiro.")
        sys.exit(1)

    cities = cities_data['results']
    city_id = cities[0]['id']
    print_info(f"Cidade encontrada: {cities[0]['city']} - {cities[0]['state']} (ID: {city_id})")

    # Criar escola
    school_data = {
        "school": "Escola Municipal QA Test",
        "id_city": city_id,
        "director_name": "Diretora Maria QA",
        "address": "Rua dos Testes, 123"
    }

    print_info("Criando escola...")
    response = requests.post(f"{BASE_URL}/schools/", json=school_data, headers=HEADERS)

    if response.status_code == 201:
        school = response.json()
        print_success(f"Escola criada: {school['school']} (ID: {school['id']})")
        return school
    else:
        print_error(f"Erro ao criar escola: {response.status_code} - {response.text}")
        sys.exit(1)

# ==================== STEP 2: CRIAR PROFESSOR ====================
def create_teacher() -> Dict:
    print_section("STEP 2: CADASTRAR PROFESSOR")

    teacher_data = {
        "teacher_serial": int(datetime.now().strftime('%Y%m%d%H%M%S')),
        "teacher_name": "Professor João QA"
    }

    print_info("Criando professor...")
    response = requests.post(f"{BASE_URL}/teachers/", json=teacher_data, headers=HEADERS)

    if response.status_code == 201:
        teacher = response.json()
        print_success(f"Professor criado: {teacher['teacher_name']} (ID: {teacher['id']})")
        return teacher
    else:
        print_error(f"Erro ao criar professor: {response.status_code} - {response.text}")
        sys.exit(1)

# ==================== STEP 3: CRIAR TURMA ====================
def create_class(school_id: int, teacher_id: int) -> Dict:
    print_section("STEP 3: CADASTRAR TURMA")

    class_data = {
        "class_name": "5º Ano A - QA Test",
        "id_school": school_id,
        "id_teacher": teacher_id,
        "school_year": 2025,
        "grade": "5º Ano",
        "shift": "morning"
    }

    print_info("Criando turma...")
    response = requests.post(f"{BASE_URL}/classes/", json=class_data, headers=HEADERS)

    if response.status_code == 201:
        class_obj = response.json()
        print_success(f"Turma criada: {class_obj['class_name']} - {class_obj['grade']} (ID: {class_obj['id']})")
        return class_obj
    else:
        print_error(f"Erro ao criar turma: {response.status_code} - {response.text}")
        sys.exit(1)

# ==================== STEP 4: CRIAR 10 ALUNOS ====================
def create_students(class_id: int, count: int = 10) -> List[Dict]:
    print_section(f"STEP 4: CADASTRAR {count} ALUNOS")

    student_names = [
        "Ana Paula Silva",
        "Bruno Costa Santos",
        "Carlos Eduardo Lima",
        "Daniela Ferreira",
        "Eduardo Alves",
        "Fernanda Oliveira",
        "Gabriel Pereira",
        "Helena Rodrigues",
        "Igor Martins",
        "Julia Mendes"
    ]

    students = []
    # Use timestamp-based serial to avoid collisions (format: MMDDHHMM + sequential)
    import time
    base_serial = int(time.time() % 100000000)  # Last 8 digits of timestamp

    for i, name in enumerate(student_names[:count], 1):
        student_data = {
            "student_serial": base_serial + i,
            "student_name": name,
            "id_class": class_id,
            "status": "enrolled"
        }

        print_info(f"Criando aluno {i}/{count}: {name}...")
        response = requests.post(f"{BASE_URL}/students/", json=student_data, headers=HEADERS)

        if response.status_code == 201:
            student = response.json()
            student_id = student.get('id_student', student.get('id'))
            print_success(f"Aluno {i} criado: {student['student_name']} (ID: {student_id})")
            students.append(student)
        else:
            print_error(f"Erro ao criar aluno {i}: {response.status_code} - {response.text}")
            sys.exit(1)

    print_success(f"Total de {len(students)} alunos criados com sucesso!")
    return students

# ==================== STEP 5: CRIAR PROVA ====================
def create_exam() -> Dict:
    print_section("STEP 5: CRIAR PROVA")

    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    exam_data = {
        "exam_code": f"MAT-QA-{timestamp}",
        "exam_name": "Prova de Matemática QA - Operações Básicas",
        "subject": "Matemática",
        "school_year": 2025,
        "description": "Prova de teste QA para validar operações básicas"
    }

    print_info("Criando prova...")
    response = requests.post(f"{BASE_URL}/exams/", json=exam_data, headers=HEADERS)

    if response.status_code == 201:
        exam = response.json()
        print_success(f"Prova criada: {exam['exam_name']} (ID: {exam['id']})")
        return exam
    else:
        print_error(f"Erro ao criar prova: {response.status_code} - {response.text}")
        sys.exit(1)

# ==================== STEP 6: CRIAR QUESTÕES ====================
def create_questions(exam_id: int) -> List[Dict]:
    print_section("STEP 6: CRIAR 5 QUESTÕES COM 4 ALTERNATIVAS")

    # Primeiro, pegar descritores disponíveis
    print_info("Buscando descritores de Matemática...")
    response = requests.get(f"{BASE_URL}/descriptors/?subject=Matemática")

    if response.status_code != 200:
        print_error(f"Erro ao buscar descritores: {response.status_code}")
        sys.exit(1)

    descriptors_data = response.json()
    descriptors = descriptors_data.get('results', descriptors_data) if isinstance(descriptors_data, dict) and 'results' in descriptors_data else descriptors_data
    if not descriptors:
        print_error("Nenhum descritor de Matemática encontrado. Execute o script de população primeiro.")
        sys.exit(1)

    print_info(f"Encontrados {len(descriptors)} descritores de Matemática")

    # Questões de matemática
    questions_data = [
        {
            "question_number": 1,
            "question_text": "Quanto é 15 + 27?",
            "question_type": "multiple_choice",
            "difficulty_level": "easy",
            "points": 2.0,
            "id_descriptor": descriptors[0]['id'],
            "alternatives": [
                {"alternative_order": 1, "alternative_text": "40", "is_correct": False},
                {"alternative_order": 2, "alternative_text": "42", "is_correct": True},
                {"alternative_order": 3, "alternative_text": "44", "is_correct": False},
                {"alternative_order": 4, "alternative_text": "46", "is_correct": False}
            ]
        },
        {
            "question_number": 2,
            "question_text": "Qual é o resultado de 8 × 7?",
            "question_type": "multiple_choice",
            "difficulty_level": "medium",
            "points": 2.0,
            "id_descriptor": descriptors[0]['id'],
            "alternatives": [
                {"alternative_order": 1, "alternative_text": "54", "is_correct": False},
                {"alternative_order": 2, "alternative_text": "56", "is_correct": True},
                {"alternative_order": 3, "alternative_text": "58", "is_correct": False},
                {"alternative_order": 4, "alternative_text": "60", "is_correct": False}
            ]
        },
        {
            "question_number": 3,
            "question_text": "Se Maria tinha 50 reais e gastou 18 reais, quanto sobrou?",
            "question_type": "multiple_choice",
            "difficulty_level": "easy",
            "points": 2.0,
            "id_descriptor": descriptors[0]['id'],
            "alternatives": [
                {"alternative_order": 1, "alternative_text": "30 reais", "is_correct": False},
                {"alternative_order": 2, "alternative_text": "32 reais", "is_correct": True},
                {"alternative_order": 3, "alternative_text": "34 reais", "is_correct": False},
                {"alternative_order": 4, "alternative_text": "36 reais", "is_correct": False}
            ]
        },
        {
            "question_number": 4,
            "question_text": "Quanto é 100 ÷ 4?",
            "question_type": "multiple_choice",
            "difficulty_level": "medium",
            "points": 2.0,
            "id_descriptor": descriptors[0]['id'],
            "alternatives": [
                {"alternative_order": 1, "alternative_text": "20", "is_correct": False},
                {"alternative_order": 2, "alternative_text": "22", "is_correct": False},
                {"alternative_order": 3, "alternative_text": "24", "is_correct": False},
                {"alternative_order": 4, "alternative_text": "25", "is_correct": True}
            ]
        },
        {
            "question_number": 5,
            "question_text": "Qual é o dobro de 35?",
            "question_type": "multiple_choice",
            "difficulty_level": "easy",
            "points": 2.0,
            "id_descriptor": descriptors[0]['id'],
            "alternatives": [
                {"alternative_order": 1, "alternative_text": "60", "is_correct": False},
                {"alternative_order": 2, "alternative_text": "65", "is_correct": False},
                {"alternative_order": 3, "alternative_text": "70", "is_correct": True},
                {"alternative_order": 4, "alternative_text": "75", "is_correct": False}
            ]
        }
    ]

    questions = []
    for i, q_data in enumerate(questions_data, 1):
        q_data["id_exam"] = exam_id

        print_info(f"Criando questão {i}/5: {q_data['question_text'][:50]}...")
        response = requests.post(f"{BASE_URL}/questions/", json=q_data, headers=HEADERS)

        if response.status_code == 201:
            question = response.json()
            print_success(f"Questão {i} criada (ID: {question['id']}) com {len(question['alternatives'])} alternativas")
            questions.append(question)
        else:
            print_error(f"Erro ao criar questão {i}: {response.status_code} - {response.text}")
            sys.exit(1)

    print_success(f"Total de {len(questions)} questões criadas com sucesso!")
    return questions

# ==================== STEP 7: APLICAR PROVA ====================
def apply_exam(exam_id: int, class_id: int, teacher_id: int) -> Dict:
    print_section("STEP 7: APLICAR PROVA PARA A TURMA")

    today = datetime.now()
    application_data = {
        "id_exam": exam_id,
        "id_class": class_id,
        "id_teacher": teacher_id,
        "application_date": today.strftime("%Y-%m-%d"),
        "start_time": "08:00:00",
        "end_time": "10:00:00",
        "status": "in_progress",
        "application_type": "diagnostic",
        "assessment_period": "1st_semester",
        "fiscal_year": 2025,
        "observations": "Aplicação de teste QA completo"
    }

    print_info("Criando aplicação da prova...")
    response = requests.post(f"{BASE_URL}/exam-applications/", json=application_data, headers=HEADERS)

    if response.status_code == 201:
        application = response.json()
        print_success(f"Prova aplicada para turma (ID Aplicação: {application['id']})")
        print_info(f"Status: {application['status']} | Data: {application['application_date']}")
        return application
    else:
        print_error(f"Erro ao aplicar prova: {response.status_code} - {response.text}")
        sys.exit(1)

# ==================== STEP 8: PREENCHER RESPOSTAS ====================
def fill_student_answers(students: List[Dict], questions: List[Dict], application_id: int):
    print_section(f"STEP 8: PREENCHER RESPOSTAS DOS {len(students)} ALUNOS")

    # Padrões de resposta para variar os resultados
    # Alunos terão diferentes níveis de acerto: 100%, 80%, 60%, 40%, 20%
    answer_patterns = [
        [True, True, True, True, True],   # Aluno 1: 100% (5/5)
        [True, True, True, True, True],   # Aluno 2: 100% (5/5)
        [True, True, True, True, False],  # Aluno 3: 80% (4/5)
        [True, True, True, False, False], # Aluno 4: 60% (3/5)
        [True, True, True, False, False], # Aluno 5: 60% (3/5)
        [True, True, False, False, False],# Aluno 6: 40% (2/5)
        [True, True, False, False, False],# Aluno 7: 40% (2/5)
        [True, False, False, False, False],# Aluno 8: 20% (1/5)
        [True, False, False, False, False],# Aluno 9: 20% (1/5)
        [False, False, False, False, False]# Aluno 10: 0% (0/5)
    ]

    for idx, student in enumerate(students):
        student_id = student.get('id_student', student.get('id'))
        student_name = student['student_name']
        pattern = answer_patterns[idx]

        print_info(f"\nAluno {idx+1}: {student_name}")

        # Montar array de respostas
        answers = []
        for q_idx, question in enumerate(questions):
            should_answer_correct = pattern[q_idx]

            # Encontrar alternativa correta e incorreta
            correct_alt = None
            incorrect_alt = None
            for alt in question['alternatives']:
                if alt['is_correct']:
                    correct_alt = alt['id']
                else:
                    incorrect_alt = alt['id']

            selected_alt = correct_alt if should_answer_correct else incorrect_alt

            answers.append({
                "id_question": question['id'],
                "id_selected_alternative": selected_alt
            })

            status = "✅ Correta" if should_answer_correct else "❌ Errada"
            print(f"  Q{q_idx+1}: {status}")

        # Submeter respostas em bulk
        payload = {
            "id_student": student_id,
            "id_exam_application": application_id,
            "answers": answers
        }

        response = requests.post(
            f"{BASE_URL}/student-answers/bulk_create/",
            json=payload,
            headers=HEADERS
        )

        if response.status_code == 201:
            result = response.json()
            expected_correct = sum(pattern)
            print_success(f"Respostas registradas! Acertos esperados: {expected_correct}/5")
        else:
            print_error(f"Erro ao registrar respostas: {response.status_code} - {response.text}")
            sys.exit(1)

# ==================== STEP 9: VERIFICAR PERFIS ====================
def verify_student_profiles(students: List[Dict]):
    print_section(f"STEP 9: VERIFICAR PERFIL DE CADA ALUNO")

    expected_scores = [10.0, 10.0, 8.0, 6.0, 6.0, 4.0, 4.0, 2.0, 2.0, 0.0]

    print_info("Aguardando 2 segundos para processamento...")
    import time
    time.sleep(2)

    all_passed = True

    for idx, student in enumerate(students):
        student_id = student.get('id_student', student.get('id'))
        student_name = student['student_name']
        expected_score = expected_scores[idx]

        print_info(f"\n📊 Verificando perfil: {student_name}")

        response = requests.get(f"{BASE_URL}/student-profile/{student_id}/profile/")

        if response.status_code == 200:
            profile = response.json()

            # Verificar dados básicos
            print(f"   Nome: {profile['student_name']}")
            print(f"   Escola: {profile['school_name']}")
            print(f"   Turma: {profile['class_name']}")
            print(f"   Série: {profile['grade']}")

            # Verificar provas recentes
            if 'recent_exams' in profile and len(profile['recent_exams']) > 0:
                last_exam = profile['recent_exams'][0]
                actual_score = last_exam['score']
                max_score = last_exam['max_score']
                percentage = last_exam['percentage']

                print(f"   📝 Última Prova: {last_exam['exam_name']}")
                print(f"   📊 Nota: {actual_score}/{max_score} ({percentage:.1f}%)")

                # Verificar se a nota está correta
                if abs(actual_score - expected_score) < 0.01:
                    print_success(f"   Nota CORRETA! Esperado: {expected_score}, Obtido: {actual_score}")
                else:
                    print_error(f"   Nota INCORRETA! Esperado: {expected_score}, Obtido: {actual_score}")
                    all_passed = False
            else:
                print_error("   Nenhuma prova encontrada no perfil!")
                all_passed = False

            # Verificar descritores
            if 'descriptors' in profile:
                desc_info = profile['descriptors']
                print(f"   🎯 Descritores: {desc_info['achieved_count']}/{desc_info['total_count']} ({desc_info['percentage']:.1f}%)")
        else:
            print_error(f"Erro ao buscar perfil: {response.status_code}")
            all_passed = False

    return all_passed

# ==================== RESUMO FINAL ====================
def print_final_summary(school, teacher, class_obj, students, exam, questions, application):
    print_section("📋 RESUMO FINAL DO TESTE QA")

    print(f"{Colors.BOLD}Escola:{Colors.END}")
    print(f"  • ID: {school['id']}")
    print(f"  • Nome: {school['school']}")

    print(f"\n{Colors.BOLD}Professor:{Colors.END}")
    print(f"  • ID: {teacher['id']}")
    print(f"  • Nome: {teacher['teacher_name']}")

    print(f"\n{Colors.BOLD}Turma:{Colors.END}")
    print(f"  • ID: {class_obj['id']}")
    print(f"  • Nome: {class_obj['class_name']}")
    print(f"  • Série: {class_obj['grade']}")
    print(f"  • Turno: {class_obj['shift']}")

    print(f"\n{Colors.BOLD}Alunos:{Colors.END}")
    print(f"  • Total: {len(students)} alunos cadastrados")
    for i, s in enumerate(students, 1):
        student_id = s.get('id_student', s.get('id'))
        print(f"  • Aluno {i}: {s['student_name']} (ID: {student_id})")

    print(f"\n{Colors.BOLD}Prova:{Colors.END}")
    print(f"  • ID: {exam['id']}")
    print(f"  • Código: {exam['exam_code']}")
    print(f"  • Nome: {exam['exam_name']}")
    print(f"  • Questões: {len(questions)}")

    print(f"\n{Colors.BOLD}Aplicação:{Colors.END}")
    print(f"  • ID: {application['id']}")
    print(f"  • Status: {application['status']}")
    print(f"  • Data: {application['application_date']}")

# ==================== MAIN ====================
def main():
    print_section("🚀 INICIANDO TESTE QA COMPLETO")
    print_info("Este script irá testar todo o fluxo do sistema")

    # Health check
    if not check_api_health():
        print_error("API não está disponível. Inicie o servidor Django primeiro.")
        sys.exit(1)

    # Executar workflow completo
    school = create_school()
    teacher = create_teacher()
    class_obj = create_class(school['id'], teacher['id'])
    students = create_students(class_obj['id'], count=10)
    exam = create_exam()
    questions = create_questions(exam['id'])
    application = apply_exam(exam['id'], class_obj['id'], teacher['id'])
    fill_student_answers(students, questions, application['id'])
    all_passed = verify_student_profiles(students)

    # Resumo final
    print_final_summary(school, teacher, class_obj, students, exam, questions, application)

    # Resultado final
    if all_passed:
        print_section("✅ TESTE QA COMPLETO: SUCESSO!")
        print_success("Todos os dados foram cadastrados e verificados corretamente!")
        return 0
    else:
        print_section("⚠️  TESTE QA COMPLETO: FALHAS DETECTADAS")
        print_error("Algumas verificações falharam. Revise os logs acima.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
