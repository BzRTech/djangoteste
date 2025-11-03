# students/models.py

from django.db import models

# Modelo para a tabela de Turmas (tb_class)
# Precisamos dele para que o relacionamento ForeignKey no modelo de Alunos funcione.
class TbClass(models.Model):
    id = models.AutoField(primary_key=True)
    class_name = models.CharField(max_length=100)
    # Não precisamos dos outros campos da tabela de turmas para este exemplo.

    class Meta:
        managed = False  # Diz ao Django para NÃO gerenciar esta tabela
        db_table = 'tb_class'

    def __str__(self):
        return self.class_name

# Modelo para a tabela de Alunos (tb_students)
# Este é o modelo principal que estamos usando no nosso CRUD.
class TbStudents(models.Model):
    id_student = models.AutoField(primary_key=True)
    student_serial = models.IntegerField(unique=True)
    student_name = models.CharField(max_length=255)
    
    # Aqui definimos o relacionamento com a tabela de Turmas.
    id_class = models.ForeignKey(TbClass, models.DO_NOTHING, db_column='id_class')
    
    enrollment_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False  # MUITO IMPORTANTE: Diz ao Django que esta tabela já existe
        db_table = 'tb_students'

    def __str__(self):
        return self.student_name
