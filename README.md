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

## ✨ Características Principales

### 🗂️ Sistema de Proyectos
- **Organización Jerárquica**: Agrupa prompts relacionados en proyectos
- **Dashboard de Proyecto**: Vista completa con métricas y estadísticas
- **Configuración por Proyecto**: Modelo por defecto, límites de tokens, temperatura
- **Multi-Proyecto**: Gestiona múltiples proyectos simultáneamente
- **Navegación Intuitiva**: Sidebar con lista de proyectos y cambio rápido

### 📊 Consolidación y Exportación
- **Consolidación Completa**: Agrupa todos los prompts y datos del proyecto
- **Múltiples Formatos de Exportación**:
  - **ZIP Completo**: Archivo con todos los prompts, reportes y datos
  - **JSON Full**: Datos completos del proyecto
  - **Markdown Report**: Reporte detallado con análisis
  - **README.md**: Documentación del proyecto lista para compartir
  - **CSV**: Historial de ejecuciones para análisis en Excel
  - **Prompts Only**: JSON solo con prompts para importar/compartir
- **Estadísticas Detalladas**: Análisis completo de uso, costos y rendimiento
- **Resumen Ejecutivo**: Vista general del proyecto con métricas clave

### 🤖 Catálogo de Modelos de IA
- **15+ Modelos Soportados**: Claude, GPT-4, Gemini, Mistral
- **Comparación de Modelos**: Compara velocidad, calidad y costos
- **Información Detallada**: Capacidades, contexto, precios por token
- **Estimador de Costos**: Calcula costos antes de ejecutar
- **Configuración por Proyecto**: Modelo por defecto personalizable

### 📈 Analytics y Métricas
- **Tracking de Ejecuciones**: Historial completo de uso
- **Análisis de Costos**: Costo total, por modelo, por ejecución
- **Métricas de Rendimiento**: Tokens usados, tiempo de respuesta
- **Prompts Más Usados**: Identifica tus prompts favoritos
- **Distribución por Modelo**: Visualiza uso de cada modelo

### 💎 Gestión de Prompts
- **Editor Markdown Avanzado**: Vista previa en tiempo real
- **Optimización con IA**: Mejora prompts con Claude AI
- **Sistema de Versiones**: Historial completo de cambios
- **Categorías y Tags**: Organización flexible
- **Búsqueda Potente**: Encuentra prompts rápidamente
- **Favoritos y Duplicación**: Gestión eficiente
- **Descripción Rica**: Documenta casos de uso

### 💰 Estimación de Costos
- **Calculadora en Tiempo Real**: Estima costos antes de ejecutar
- **Comparación de Modelos**: Encuentra la opción más económica
- **Tracking de Gastos**: Monitorea costos por proyecto
- **Optimización de Costos**: Tips para reducir gastos

### 🎨 Interfaz y UX
- **Tema Oscuro/Claro**: Interfaz adaptable
- **Diseño Moderno**: Componentes con Shadcn/UI
- **Animaciones Fluidas**: Transiciones con Framer Motion
- **Responsive**: Funciona en desktop, tablet y móvil
- **LocalStorage**: Todo se guarda localmente, sin backend

## 🎯 Casos de Uso

- **Desarrolladores**: Gestiona prompts de código, debugging, documentación
- **Content Creators**: Organiza prompts de escritura, SEO, marketing
- **Investigadores**: Almacena prompts de análisis, investigación, síntesis
- **Equipos**: Comparte proyectos completos con documentación
- **Freelancers**: Mantén bibliotecas de prompts por cliente/proyecto
- **Estudiantes**: Organiza prompts de estudio y aprendizaje

## 📖 Guía de Uso

### Crear un Proyecto

1. Click en el botón "+" en el sidebar de proyectos
2. Ingresa nombre y descripción del proyecto
3. Configura modelo por defecto y límites (opcional)
4. ¡Listo! Tu proyecto está creado

### Agregar Prompts al Proyecto

1. Selecciona el proyecto en el sidebar
2. Click en "New Prompt"
3. Escribe título, contenido, categoría y tags
4. Usa el editor markdown para formatear
5. Click en "Save Prompt"

### Consolidar y Exportar Proyecto

1. Ve al Dashboard del proyecto
2. Click en "Consolidate Project"
3. Revisa las estadísticas generadas
4. Elige el formato de exportación deseado:
   - **ZIP**: Para backup completo
   - **Markdown**: Para documentación
   - **JSON**: Para compartir/importar
   - **CSV**: Para análisis en Excel
5. El archivo se descarga automáticamente

### Estimar Costos

1. En el editor de prompt, selecciona un modelo
2. Usa el estimador de costos
3. Ajusta tokens de entrada/salida
4. Ve el costo estimado en tiempo real

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

## 🛠️ Tecnologías Utilizadas

### Core
- **React 18** + **Vite** - Framework y bundler ultrarrápido
- **TypeScript** - Type safety y mejor DX
- **Tailwind CSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI modernos y accesibles

### Estado y Datos
- **Zustand** - Gestión de estado con persistencia en LocalStorage
- **LocalStorage** - Base de datos local, sin backend necesario

### UI/UX
- **Framer Motion** - Animaciones fluidas y transiciones
- **@uiw/react-md-editor** - Editor markdown con preview
- **Radix UI** - Primitivas de UI accesibles
- **Lucide Icons** - Iconografía moderna

### Análisis y Exportación
- **Recharts** - Gráficos y visualizaciones (preparado para futuro)
- **JSZip** - Creación de archivos ZIP
- **FileSaver** - Descarga de archivos
- **date-fns** - Manejo de fechas

### Búsqueda y Comparación
- **Fuse.js** - Búsqueda fuzzy (preparado para futuro)
- **diff** - Comparación de versiones de prompts

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linting del código
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── prompts/           # Componentes de gestión de prompts
│   │   ├── PromptCard.tsx
│   │   ├── PromptEditor.tsx
│   │   └── PromptGrid.tsx
│   ├── settings/          # Configuración y ajustes
│   │   └── ApiSettings.tsx
│   └── ui/                # Componentes UI base (shadcn)
│
├── features/              # Features modulares (Nuevo!)
│   ├── projects/
│   │   ├── components/
│   │   │   ├── ProjectSidebar.tsx
│   │   │   └── ProjectDashboard.tsx
│   │   └── store/
│   │       └── projectStore.ts
│   ├── consolidation/
│   │   ├── components/
│   │   │   └── ConsolidateButton.tsx
│   │   └── utils/
│   │       ├── consolidate.ts
│   │       └── exporters/
│   │           ├── jsonExporter.ts
│   │           ├── markdownExporter.ts
│   │           └── zipExporter.ts
│   ├── models/
│   │   ├── components/
│   │   │   ├── ModelSelector.tsx
│   │   │   └── CostEstimator.tsx
│   │   └── data/
│   │       └── modelCatalog.ts
│   └── analytics/         # Preparado para futuras visualizaciones
│
├── data/                  # Catálogos y datos estáticos (Nuevo!)
│   └── modelCatalog.ts    # 15+ modelos con precios y specs
│
├── hooks/                 # Custom React hooks
│   └── useTheme.tsx
│
├── store/                 # Estado global (Zustand)
│   └── promptStore.ts     # Store principal de prompts
│
├── types/                 # TypeScript interfaces (Expandido!)
│   └── index.ts           # Project, ExecutionHistory, Metrics, etc.
│
├── utils/                 # Utilidades y helpers
│   └── claudeAPI.ts       # Integración con Claude API
│
├── App.tsx                # Componente principal (Actualizado!)
└── main.tsx               # Entry point
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