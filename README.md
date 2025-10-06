# Prompt Library - AI Prompt Management Application

Una hermosa aplicación para gestionar tu biblioteca personal de prompts de IA con editor markdown avanzado y optimización mediante Claude AI.

## 🚀 Quick Start

### Instalación

```bash
# 1. Clonar el repositorio
git clone <your-repo-url>
cd "Prompt Library"

# 2. Instalar dependencias
npm install

# 3. Configurar API Key
# Copia el template de variables de entorno
cp .env.example .env.local

# 4. Editar .env.local y agregar tu API key
# VITE_CLAUDE_API_KEY=tu_api_key_aqui

# 5. Iniciar el servidor de desarrollo
npm run dev
```

### Obtener tu API Key de Claude

1. Ve a [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Inicia sesión o crea una cuenta
3. Click en "Create Key"
4. Copia tu API key (empieza con `sk-ant-api...`)
5. Pégala en tu archivo `.env.local`

**Nota:** El archivo `.env.local` está ignorado por Git y nunca se subirá al repositorio. Tu API key está segura.

## Características

### Core Features
- **Gestión de Prompts**: Crea, edita, duplica y elimina prompts
- **Editor Markdown**: Editor completo con vista previa en tiempo real
- **Optimización con IA**: Optimiza tus prompts usando la API de Claude
- **Categorías y Tags**: Organiza tus prompts con categorías coloridas y etiquetas
- **Búsqueda y Filtros**: Encuentra rápidamente cualquier prompt
- **Favoritos**: Marca tus prompts más utilizados
- **Historial de Versiones**: Mantén un registro de las diferentes versiones de tus prompts
- **Tema Oscuro/Claro**: Interfaz adaptable a tu preferencia
- **Import/Export**: Guarda y comparte tu biblioteca en formato JSON
- **LocalStorage**: Persistencia de datos sin necesidad de backend

### Diseño UI/UX
- Interfaz moderna con gradientes vibrantes
- Animaciones fluidas con Framer Motion
- Tarjetas con efectos glassmorphism
- Grid responsivo estilo masonry
- Transiciones suaves entre vistas

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/prompt-library.git

# Entrar al directorio
cd prompt-library

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🔒 Seguridad de la API Key

Tu API key está completamente segura:

- ✅ Se almacena en `.env.local` (ignorado por Git)
- ✅ Nunca se commitea al repositorio
- ✅ No se expone en el código del repositorio
- ✅ Cada desarrollador usa su propia key
- ✅ Configuración local única por máquina

### Verificar Configuración

Para verificar que tu API key está configurada:

1. Abre la aplicación
2. Click en el ícono Settings (⚙️)
3. Verás el estado de configuración
4. Si está configurada, verás un ✓ verde

### Antes de Hacer Push a GitHub

El `.gitignore` ya está configurado para proteger tu API key, pero verifica:

```bash
# Ver qué archivos se van a commitear
git status

# Verificar que .env.local NO aparece en la lista
# Si aparece, NO hagas commit

# Ver el contenido del gitignore
cat .gitignore | grep .env
```

## Uso

### Crear un Prompt
1. Click en "New Prompt"
2. Ingresa título, contenido, categoría y tags
3. Usa el editor markdown para formatear tu prompt
4. Click en "Save Prompt"

### Optimizar con IA
1. En el editor, click en "Optimize with AI"
2. Si no tienes API key configurada, se abrirá el diálogo de configuración
3. La IA optimizará tu prompt mejorando claridad y especificidad
4. Revisa los cambios y acepta si estás conforme

### Organización
- **Categorías**: General, Development, Writing, Analysis, Creative
- **Tags**: Agrega tags personalizados para mejor organización
- **Favoritos**: Marca con ⭐ tus prompts más importantes
- **Búsqueda**: Busca por título, contenido o tags

### Import/Export
- **Export**: Click en ⬇️ para descargar tu biblioteca como JSON
- **Import**: Click en ⬆️ para cargar una biblioteca desde archivo JSON

## Tecnologías Utilizadas

- **React 18** + **Vite** - Framework y bundler
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI modernos
- **Zustand** - Gestión de estado
- **Framer Motion** - Animaciones
- **MDXEditor** - Editor markdown
- **date-fns** - Manejo de fechas
- **Lucide Icons** - Iconografía

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linting del código
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── prompts/      # Componentes de prompts
│   ├── settings/     # Configuración
│   └── ui/           # Componentes UI base
├── hooks/            # Custom hooks
├── store/            # Estado global (Zustand)
├── types/            # TypeScript types
└── utils/            # Utilidades
```

## Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

MIT License - siéntete libre de usar este proyecto para cualquier propósito.

## Autor

Desarrollado con 💜 para la comunidad de IA