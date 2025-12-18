#!/bin/bash

# ============================================
# Script de Instalação - DjangoTeste
# Sistema Escola - Full Stack (Django + React)
# ============================================

set -e  # Para o script se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Diretório do projeto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

print_header "Instalação do Sistema Escola - DjangoTeste"

echo "Este script irá instalar:"
echo "  - Python 3 e pip"
echo "  - Node.js e npm"
echo "  - PostgreSQL"
echo "  - Dependências do backend (Django)"
echo "  - Dependências do frontend (React)"
echo ""

read -p "Deseja continuar? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Instalação cancelada."
    exit 1
fi

# ============================================
# Detectar Sistema Operacional
# ============================================
print_header "Detectando Sistema Operacional"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v apt-get &> /dev/null; then
        OS="debian"
        print_success "Sistema detectado: Debian/Ubuntu"
    elif command -v dnf &> /dev/null; then
        OS="fedora"
        print_success "Sistema detectado: Fedora/RHEL"
    elif command -v pacman &> /dev/null; then
        OS="arch"
        print_success "Sistema detectado: Arch Linux"
    else
        OS="linux"
        print_warning "Distribuição Linux não identificada"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    print_success "Sistema detectado: macOS"
else
    print_error "Sistema operacional não suportado: $OSTYPE"
    exit 1
fi

# ============================================
# Instalar Dependências do Sistema
# ============================================
print_header "Instalando Dependências do Sistema"

install_debian() {
    echo "Atualizando pacotes..."
    sudo apt-get update

    echo "Instalando Python 3, pip e venv..."
    sudo apt-get install -y python3 python3-pip python3-venv

    echo "Instalando Node.js e npm..."
    # Instala Node.js 20.x LTS
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        print_success "Node.js já está instalado"
    fi

    echo "Instalando PostgreSQL..."
    sudo apt-get install -y postgresql postgresql-contrib libpq-dev
}

install_fedora() {
    echo "Atualizando pacotes..."
    sudo dnf update -y

    echo "Instalando Python 3 e pip..."
    sudo dnf install -y python3 python3-pip python3-virtualenv

    echo "Instalando Node.js e npm..."
    sudo dnf install -y nodejs npm

    echo "Instalando PostgreSQL..."
    sudo dnf install -y postgresql postgresql-server postgresql-contrib libpq-devel
    sudo postgresql-setup --initdb --unit postgresql
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
}

install_arch() {
    echo "Atualizando pacotes..."
    sudo pacman -Syu --noconfirm

    echo "Instalando Python 3 e pip..."
    sudo pacman -S --noconfirm python python-pip python-virtualenv

    echo "Instalando Node.js e npm..."
    sudo pacman -S --noconfirm nodejs npm

    echo "Instalando PostgreSQL..."
    sudo pacman -S --noconfirm postgresql
    sudo -u postgres initdb -D /var/lib/postgres/data
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
}

install_macos() {
    # Verifica se Homebrew está instalado
    if ! command -v brew &> /dev/null; then
        echo "Instalando Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi

    echo "Instalando Python 3..."
    brew install python3

    echo "Instalando Node.js..."
    brew install node

    echo "Instalando PostgreSQL..."
    brew install postgresql@15
    brew services start postgresql@15
}

case $OS in
    debian)
        install_debian
        ;;
    fedora)
        install_fedora
        ;;
    arch)
        install_arch
        ;;
    macos)
        install_macos
        ;;
    *)
        print_warning "Instalação automática não disponível para seu sistema."
        print_warning "Por favor, instale manualmente: Python 3, pip, Node.js, npm e PostgreSQL"
        read -p "Pressione Enter para continuar após instalar as dependências..."
        ;;
esac

# Verificar instalações
print_header "Verificando Instalações"

check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 instalado: $($1 --version 2>&1 | head -n 1)"
        return 0
    else
        print_error "$1 não encontrado"
        return 1
    fi
}

check_command python3
check_command pip3 || check_command pip
check_command node
check_command npm
check_command psql || print_warning "PostgreSQL CLI não encontrado (pode estar ok)"

# ============================================
# Configurar Backend (Django)
# ============================================
print_header "Configurando Backend (Django)"

cd "$PROJECT_DIR/backend"

# Criar ambiente virtual
if [ ! -d "venv" ]; then
    echo "Criando ambiente virtual..."
    python3 -m venv venv
    print_success "Ambiente virtual criado"
else
    print_success "Ambiente virtual já existe"
fi

# Ativar ambiente virtual
echo "Ativando ambiente virtual..."
source venv/bin/activate

# Instalar dependências Python
echo "Instalando dependências Python..."
pip install --upgrade pip
pip install -r requirements.txt
print_success "Dependências Python instaladas"

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
    print_warning "Arquivo .env criado - EDITE COM SUAS CONFIGURAÇÕES DO BANCO DE DADOS"
else
    print_success "Arquivo .env já existe"
fi

# ============================================
# Configurar Frontend (React)
# ============================================
print_header "Configurando Frontend (React)"

cd "$PROJECT_DIR/frontend"

# Instalar dependências Node
echo "Instalando dependências Node.js..."
npm install
print_success "Dependências Node.js instaladas"

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
    print_success "Arquivo .env do frontend criado"
else
    print_success "Arquivo .env já existe"
fi

# ============================================
# Instruções Finais
# ============================================
print_header "Instalação Concluída!"

echo -e "${GREEN}O projeto foi configurado com sucesso!${NC}\n"

echo -e "${YELLOW}PRÓXIMOS PASSOS:${NC}\n"

echo "1. Configure o banco de dados PostgreSQL:"
echo "   - Crie um banco de dados para o projeto"
echo "   - Edite o arquivo ${BLUE}backend/.env${NC} com suas credenciais"
echo ""

echo "2. Execute as migrações do Django:"
echo "   ${BLUE}cd backend${NC}"
echo "   ${BLUE}source venv/bin/activate${NC}"
echo "   ${BLUE}python manage.py migrate${NC}"
echo ""

echo "3. Para rodar o projeto, abra 2 terminais:"
echo ""
echo "   ${GREEN}Terminal 1 (Backend):${NC}"
echo "   ${BLUE}cd $PROJECT_DIR/backend${NC}"
echo "   ${BLUE}source venv/bin/activate${NC}"
echo "   ${BLUE}python manage.py runserver${NC}"
echo ""
echo "   ${GREEN}Terminal 2 (Frontend):${NC}"
echo "   ${BLUE}cd $PROJECT_DIR/frontend${NC}"
echo "   ${BLUE}npm start${NC}"
echo ""

echo -e "${GREEN}URLs:${NC}"
echo "   Backend:  http://127.0.0.1:8000/"
echo "   Frontend: http://localhost:3000/"
echo ""

print_success "Script finalizado!"
