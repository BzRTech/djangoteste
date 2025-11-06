# students/models.py

from django.db import models


# Modelo para a tabela de Cidades (tb_city)
class TbCity(models.Model):
    id = models.AutoField(primary_key=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_city'

    def __str__(self):
        return f"{self.city} - {self.state}"


# Modelo para a tabela de Escolas (tb_school)
class TbSchool(models.Model):
    id = models.AutoField(primary_key=True)
    school = models.CharField(max_length=255)
    director_name = models.CharField(max_length=255)
    id_city = models.ForeignKey(TbCity, models.DO_NOTHING, db_column='id_city')
    address = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_school'

    def __str__(self):
        return self.school


# Modelo para a tabela de Professores (tb_teacher)
class TbTeacher(models.Model):
    id = models.AutoField(primary_key=True)
    teacher_serial = models.CharField(max_length=64)
    teacher_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_teacher'

    def __str__(self):
        return self.teacher_name


# Modelo para a tabela de Turmas (tb_class)
class TbClass(models.Model):
    id = models.AutoField(primary_key=True)
    class_name = models.CharField(max_length=100)
    id_teacher = models.ForeignKey(TbTeacher, models.DO_NOTHING, db_column='id_teacher', blank=True, null=True)
    id_school = models.ForeignKey(TbSchool, models.DO_NOTHING, db_column='id_school', blank=True, null=True)
    school_year = models.IntegerField(blank=True, null=True)
    grade = models.CharField(max_length=50, blank=True, null=True)
    shift = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_class'

    def __str__(self):
        return self.class_name


# Modelo para a tabela de Alunos (tb_students)
class TbStudents(models.Model):
    id_student = models.AutoField(primary_key=True)
    student_serial = models.IntegerField(unique=True)
    student_name = models.CharField(max_length=255)
    id_class = models.ForeignKey(TbClass, models.DO_NOTHING, db_column='id_class')
    enrollment_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_students'

    def __str__(self):
        return self.student_name


# Modelo para a tabela de Catálogo de Distratores (tb_distractor_catalog)
class TbDistractorCatalog(models.Model):
    id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=100)
    learning_field = models.CharField(max_length=255)
    grade = models.CharField(max_length=50)
    distractor_code = models.CharField(max_length=50)
    distractor_name = models.CharField(max_length=255)
    distractor_description = models.TextField()
    icon = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_distractor_catalog'

    def __str__(self):
        return f"{self.distractor_code} - {self.distractor_name}"


# Modelo para a tabela de Respostas dos Alunos (tb_student_answers)
class TbStudentAnswers(models.Model):
    id = models.AutoField(primary_key=True)
    id_student = models.ForeignKey(TbStudents, models.DO_NOTHING, db_column='id_student')
    answers = models.TextField()  # Pode ser JSON armazenado como texto
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_student_answers'

    def __str__(self):
        return f"Respostas de {self.id_student.student_name}"


# Modelo para a tabela de Conquistas dos Alunos (tb_student_factor_achievements)
class TbStudentFactorAchievements(models.Model):
    id = models.AutoField(primary_key=True)
    id_student = models.ForeignKey(TbStudents, models.DO_NOTHING, db_column='id_student')
    achievements = models.TextField()  # Pode ser JSON armazenado como texto
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tb_student_factor_achievements'

    def __str__(self):
        return f"Conquistas de {self.id_student.student_name}"