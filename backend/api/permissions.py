from rest_framework import permissions


class IsGestorOrReadOnly(permissions.BasePermission):
    """
    Permissão para Gestor: apenas leitura do dashboard
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.is_administrador:
            return True

        if request.user.is_gestor:
            # Gestor só pode fazer GET
            return request.method in permissions.SAFE_METHODS

        return False


class IsCoordenadorOrAdmin(permissions.BasePermission):
    """
    Permissão para Coordenador: acesso completo aos dados da sua cidade
    Administrador: acesso completo a tudo
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Administrador tem acesso total
        if request.user.is_administrador:
            return True

        # Coordenador tem acesso completo
        if request.user.is_coordenador:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        # Administrador tem acesso total
        if request.user.is_administrador:
            return True

        # Coordenador só tem acesso a objetos da sua cidade
        if request.user.is_coordenador:
            # Verifica se o objeto tem relação com cidade
            if hasattr(obj, 'id_city'):
                return obj.id_city == request.user.city
            elif hasattr(obj, 'city'):
                return obj.city == request.user.city
            elif hasattr(obj, 'school'):
                # Para objetos que têm escola, verifica a cidade da escola
                return obj.school.id_city == request.user.city
            elif hasattr(obj, 'id_school'):
                return obj.id_school.id_city == request.user.city

        return False


class IsGerenteOrAdmin(permissions.BasePermission):
    """
    Permissão para Gerente: pode editar mas não pode criar (cadastrar)
    Administrador: acesso completo
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Administrador tem acesso total
        if request.user.is_administrador:
            return True

        # Gerente pode listar, editar e deletar, mas não pode criar
        if request.user.is_gerente:
            if request.method == 'POST':
                return False  # Não pode criar
            return True  # Pode fazer GET, PUT, PATCH, DELETE

        return False


class IsAdministrador(permissions.BasePermission):
    """
    Permissão apenas para Administrador
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return request.user.is_administrador


class RoleBasedPermission(permissions.BasePermission):
    """
    Permissão baseada em roles que combina todas as regras
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        user = request.user

        # Administrador: acesso total
        if user.is_administrador:
            return True

        # Coordenador: acesso completo aos dados da sua cidade
        if user.is_coordenador:
            return True

        # Gerente: pode editar mas não criar
        if user.is_gerente:
            if request.method == 'POST':
                return False  # Não pode criar
            return True

        # Gestor: apenas leitura
        if user.is_gestor:
            return request.method in permissions.SAFE_METHODS

        return False

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        user = request.user

        # Administrador: acesso total
        if user.is_administrador:
            return True

        # Coordenador: apenas objetos da sua cidade
        if user.is_coordenador:
            # Verifica se o objeto tem relação com cidade
            if hasattr(obj, 'id_city'):
                return obj.id_city == user.city
            elif hasattr(obj, 'city'):
                return obj.city == user.city
            elif hasattr(obj, 'school'):
                return obj.school.id_city == user.city
            elif hasattr(obj, 'id_school'):
                return obj.id_school.id_city == user.city
            # Se não tiver cidade, permite acesso
            return True

        # Gerente: pode ver e editar tudo
        if user.is_gerente:
            return True

        # Gestor: apenas leitura
        if user.is_gestor:
            return request.method in permissions.SAFE_METHODS

        return False


class DashboardPermission(permissions.BasePermission):
    """
    Permissão específica para o Dashboard
    Todos os usuários autenticados podem ver, mas coordenadores veem apenas sua cidade
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Todos os usuários autenticados podem acessar o dashboard
        return True
