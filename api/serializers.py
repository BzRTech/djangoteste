from rest_framework import serializers
from students.models import TbStudents, TbClass


class TbClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbClass
        fields = ['id', 'class_name']


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