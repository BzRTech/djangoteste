from rest_framework import serializers
from students.models import *


# ============================================
# SERIALIZERS DE LOCALIZAÇÃO E ESTRUTURA
# ============================================

class TbCitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TbCity
        fields = '__all__'


class TbSchoolSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='id_city.city', read_only=True)
    state = serializers.CharField(source='id_city.state', read_only=True)
    
    class Meta:
        model = TbSchool
        fields = ['id', 'school', 'director_name', 'id_city', 'city_name', 'state', 'address', 'created_at']


class TbTeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbTeacher
        fields = '__all__'


class TbTeacherSchoolSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True)
    school_name = serializers.CharField(source='id_school.school', read_only=True)
    
    class Meta:
        model = TbTeacherSchool
        fields = [
            'id', 'id_teacher', 'teacher_name', 'id_school', 
            'school_name', 'assignment_date', 'status', 'created_at'
        ]


class TbClassSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True)
    school_name = serializers.CharField(source='id_school.school', read_only=True)
    
    class Meta:
        model = TbClass
        fields = [
            'id', 'class_name', 'id_teacher', 'teacher_name', 
            'id_school', 'school_name', 'school_year', 'grade', 
            'shift', 'created_at'
        ]


class TbStudentsSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)
    
    class Meta:
        model = TbStudents
        fields = [
            'id_student', 'student_serial', 'student_name', 
            'id_class', 'class_name', 'enrollment_date', 
            'status', 'created_at'
        ]


# ============================================
# SERIALIZERS DE INDICADORES IDEB
# ============================================

class TbSchoolIdebIndicatorsSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='id_school.school', read_only=True)
    
    class Meta:
        model = TbSchoolIdebIndicators
        fields = [
            'id', 'id_school', 'school_name', 'fiscal_year',
            'ideb_target', 'regional_average', 'state_average',
            'critical_threshold', 'created_at'
        ]


class TbClassIdebIndicatorsSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)
    
    class Meta:
        model = TbClassIdebIndicators
        fields = [
            'id', 'id_class', 'class_name', 'fiscal_year',
            'class_ideb_target', 'expected_avg_score', 'created_at'
        ]


# ============================================
# SERIALIZERS DE COMPETÊNCIAS E DESCRITORES
# ============================================

class TbCompetencyIdebSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbCompetencyIdeb
        fields = '__all__'


# ✅ CORREÇÃO: Renomeado para DescriptorsCatalog
class TbDescriptorsCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbDescriptorsCatalog
        fields = '__all__'


# ============================================
# SERIALIZERS DE EXAMES E QUESTÕES
# ============================================

class TbExamsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbExams
        fields = '__all__'


class TbAlternativesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbAlternatives
        fields = '__all__'


class TbQuestionsSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='id_exam.exam_name', read_only=True)
    descriptor_name = serializers.CharField(source='id_descriptor.descriptor_name', read_only=True)  # ✅ Corrigido
    alternatives = TbAlternativesSerializer(many=True, read_only=True, source='tbalternatives_set')
    
    class Meta:
        model = TbQuestions
        fields = [
            'id', 'id_exam', 'exam_name', 'question_number',
            'question_text', 'question_type', 'correct_answer',
            'skill_assessed', 'difficulty_level', 'points',
            'id_descriptor', 'descriptor_name', 'alternatives', 'created_at'  # ✅ Corrigido
        ]


class TbQuestionCompetencySerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='id_question.question_text', read_only=True)
    competency_name = serializers.CharField(source='id_competency.competency_name', read_only=True)
    
    class Meta:
        model = TbQuestionCompetency
        fields = ['id_question', 'question_text', 'id_competency', 'competency_name']


# ============================================
# SERIALIZERS DE APLICAÇÕES E RESULTADOS
# ============================================

class TbExamApplicationsSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='id_exam.exam_name', read_only=True)
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True)
    
    class Meta:
        model = TbExamApplications
        fields = [
            'id', 'id_exam', 'exam_name', 'id_class', 'class_name',
            'id_teacher', 'teacher_name', 'application_date',
            'start_time', 'end_time', 'status', 'observations',
            'application_type', 'assessment_period', 'fiscal_year', 'created_at'
        ]


class TbAssessmentMetadataSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='id_exam_application.id_exam.exam_name', read_only=True)
    
    class Meta:
        model = TbAssessmentMetadata
        fields = [
            'id', 'id_exam_application', 'exam_name', 'application_type',
            'assessment_period', 'fiscal_year', 'notes', 'created_at'
        ]


class TbStudentAnswersSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    question_text = serializers.CharField(source='id_question.question_text', read_only=True)
    alternative_text = serializers.CharField(source='id_selected_alternative.alternative_text', read_only=True)
    
    class Meta:
        model = TbStudentAnswers
        fields = [
            'id', 'id_student', 'student_name', 'id_exam_application',
            'id_question', 'question_text', 'id_selected_alternative',
            'alternative_text', 'answer_text', 'is_correct',
            'response_time_seconds', 'answered_at'
        ]


class TbExamResultsSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    exam_name = serializers.CharField(source='id_exam_application.id_exam.exam_name', read_only=True)
    
    class Meta:
        model = TbExamResults
        fields = [
            'id', 'id_student', 'student_name', 'id_exam_application',
            'exam_name', 'total_score', 'max_score', 'correct_answers',
            'wrong_answers', 'blank_answers', 'completion_time_minutes',
            'started_at', 'finished_at', 'created_at'
        ]


# ============================================
# SERIALIZERS DE PROGRESSO E CONQUISTAS
# ============================================

# ✅ CORREÇÃO: Renomeado para DescriptorAchievements
class TbStudentDescriptorAchievementsSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    descriptor_name = serializers.CharField(source='id_descriptor.descriptor_name', read_only=True)  # ✅ Corrigido
    
    class Meta:
        model = TbStudentDescriptorAchievements
        fields = [
            'id', 'id_student', 'student_name', 'id_descriptor',  # ✅ Corrigido
            'descriptor_name', 'id_exam_application', 'achieved_at'  # ✅ Corrigido
        ]


class TbStudentLearningProgressSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    competency_name = serializers.CharField(source='id_competency.competency_name', read_only=True)
    
    class Meta:
        model = TbStudentLearningProgress
        fields = [
            'id', 'id_student', 'student_name', 'id_competency',
            'competency_name', 'id_exam_application', 'score',
            'max_score', 'competency_mastery', 'assessment_date', 'created_at'
        ]