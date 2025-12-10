# Migration to add exam_file column to tb_exams table

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            # Add column
            sql="""
                ALTER TABLE tb_exams
                ADD COLUMN IF NOT EXISTS exam_file VARCHAR(500);
            """,
            # Reverse migration (remove column)
            reverse_sql="""
                ALTER TABLE tb_exams
                DROP COLUMN IF EXISTS exam_file;
            """
        ),
    ]
