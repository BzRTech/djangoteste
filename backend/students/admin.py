from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Register your models here.

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Admin para usuários customizados com controle de acesso"""
    list_display = ['username', 'email', 'role', 'city', 'is_active', 'is_staff']
    list_filter = ['role', 'city', 'is_active', 'is_staff', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']

    fieldsets = UserAdmin.fieldsets + (
        ('Informações Adicionais', {
            'fields': ('role', 'city', 'phone')
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informações Adicionais', {
            'fields': ('role', 'city', 'phone', 'email', 'first_name', 'last_name')
        }),
    )
