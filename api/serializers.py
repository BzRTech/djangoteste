from rest_framework import serializers
from students.models import (
    TbStudents, TbClass, TbCity, TbSchool, 
    TbTeacher, TbDistractorCatalog, TbStudentAnswers,
    TbStudentFactorAchievements
)


class TbCitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TbCity
        fields = ['id', 'city', 'state', 'created_at']


class TbSchoolSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='id_city.city', read_only=True)
    
    class Meta:
        model = TbSchool
        fields = ['id', 'school', 'director_name', 'id_city', 'city_name', 'address', 'created_at']


class TbTeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbTeacher
        fields = ['id', 'teacher_serial', 'teacher_name', 'status', 'created_at']


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
            'id_student',
            'student_serial',
            'student_name',
            'id_class',
            'class_name',
            'enrollment_date',
            'status',
            'created_at'
        ]
        read_only_fields = ['id_student', 'created_at']
    
    def validate_student_serial(self, value):
        """Valida se o número de matrícula é único"""
        instance = self.instance
        if instance and TbStudents.objects.exclude(pk=instance.pk).filter(student_serial=value).exists():
            raise serializers.ValidationError("Já existe um aluno com este número de matrícula.")
        elif not instance and TbStudents.objects.filter(student_serial=value).exists():
            raise serializers.ValidationError("Já existe um aluno com este número de matrícula.")
        return value


class TbDistractorCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbDistractorCatalog
        fields = [
            'id', 'subject', 'learning_field', 'grade', 
            'distractor_code', 'distractor_name', 
            'distractor_description', 'icon', 'created_at'
        ]


class TbStudentAnswersSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    
    class Meta:
        model = TbStudentAnswers
        fields = ['id', 'id_student', 'student_name', 'answers', 'created_at']


class TbStudentFactorAchievementsSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    
    class Meta:
        model = TbStudentFactorAchievements
        fields = ['id', 'id_student', 'student_name', 'achievements', 'created_at']