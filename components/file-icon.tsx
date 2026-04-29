"use client"

import { useMemo } from 'react'

interface FileIconProps {
  filename: string
  isFolder?: boolean
  isOpen?: boolean
  size?: number
  className?: string
}

// Base URL for vscode-icons SVGs (served from CDN)
const ICON_BASE_URL = 'https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons'

// Extension to icon name mapping (most common file types from VS Code icons)
const extensionToIcon: Record<string, string> = {
  // JavaScript/TypeScript
  'js': 'file_type_js.svg',
  'mjs': 'file_type_js.svg',
  'cjs': 'file_type_js.svg',
  'jsx': 'file_type_reactjs.svg',
  'ts': 'file_type_typescript.svg',
  'tsx': 'file_type_reactts.svg',
  'mts': 'file_type_typescript.svg',
  'd.ts': 'file_type_typescriptdef.svg',
  
  // Web
  'html': 'file_type_html.svg',
  'htm': 'file_type_html.svg',
  'css': 'file_type_css.svg',
  'scss': 'file_type_scss.svg',
  'sass': 'file_type_sass.svg',
  'less': 'file_type_less.svg',
  'svg': 'file_type_svg.svg',
  
  // Data/Config
  'json': 'file_type_json.svg',
  'yaml': 'file_type_yaml.svg',
  'yml': 'file_type_yaml.svg',
  'xml': 'file_type_xml.svg',
  'toml': 'file_type_toml.svg',
  'ini': 'file_type_ini.svg',
  'env': 'file_type_dotenv.svg',
  
  // Documentation
  'md': 'file_type_markdown.svg',
  'mdx': 'file_type_mdx.svg',
  'txt': 'file_type_text.svg',
  'pdf': 'file_type_pdf.svg',
  
  // Images
  'png': 'file_type_image.svg',
  'jpg': 'file_type_image.svg',
  'jpeg': 'file_type_image.svg',
  'gif': 'file_type_image.svg',
  'webp': 'file_type_image.svg',
  'ico': 'file_type_image.svg',
  
  // Languages
  'py': 'file_type_python.svg',
  'rb': 'file_type_ruby.svg',
  'go': 'file_type_go.svg',
  'rs': 'file_type_rust.svg',
  'java': 'file_type_java.svg',
  'kt': 'file_type_kotlin.svg',
  'swift': 'file_type_swift.svg',
  'c': 'file_type_c.svg',
  'cpp': 'file_type_cpp.svg',
  'h': 'file_type_c.svg',
  'hpp': 'file_type_cpp.svg',
  'cs': 'file_type_csharp.svg',
  'php': 'file_type_php.svg',
  'sh': 'file_type_shell.svg',
  'bash': 'file_type_shell.svg',
  'zsh': 'file_type_shell.svg',
  'sql': 'file_type_sql.svg',
  'graphql': 'file_type_graphql.svg',
  'gql': 'file_type_graphql.svg',
  
  // Build/Tools
  'lock': 'file_type_lock.svg',
  'prisma': 'file_type_prisma.svg',
  'dockerfile': 'file_type_docker.svg',
  'dockerignore': 'file_type_docker.svg',
  'gitignore': 'file_type_git.svg',
  'gitattributes': 'file_type_git.svg',
  'eslintrc': 'file_type_eslint.svg',
  'prettierrc': 'file_type_prettier.svg',
  'babelrc': 'file_type_babel.svg',
  'webpack': 'file_type_webpack.svg',
  'vite': 'file_type_vite.svg',
}

// Special filename mappings (exact matches)
const filenameToIcon: Record<string, string> = {
  'package.json': 'file_type_npm.svg',
  'package-lock.json': 'file_type_npm.svg',
  'pnpm-lock.yaml': 'file_type_pnpm.svg',
  'yarn.lock': 'file_type_yarn.svg',
  'bun.lockb': 'file_type_bun.svg',
  'tsconfig.json': 'file_type_tsconfig.svg',
  'jsconfig.json': 'file_type_jsconfig.svg',
  'next.config.js': 'file_type_next.svg',
  'next.config.mjs': 'file_type_next.svg',
  'next.config.ts': 'file_type_next.svg',
  'tailwind.config.js': 'file_type_tailwind.svg',
  'tailwind.config.ts': 'file_type_tailwind.svg',
  'postcss.config.js': 'file_type_postcss.svg',
  'postcss.config.mjs': 'file_type_postcss.svg',
  'vite.config.js': 'file_type_vite.svg',
  'vite.config.ts': 'file_type_vite.svg',
  '.env': 'file_type_dotenv.svg',
  '.env.local': 'file_type_dotenv.svg',
  '.env.development': 'file_type_dotenv.svg',
  '.env.production': 'file_type_dotenv.svg',
  '.gitignore': 'file_type_git.svg',
  '.eslintrc.js': 'file_type_eslint.svg',
  '.eslintrc.json': 'file_type_eslint.svg',
  '.prettierrc': 'file_type_prettier.svg',
  'dockerfile': 'file_type_docker.svg',
  'docker-compose.yml': 'file_type_docker.svg',
  'docker-compose.yaml': 'file_type_docker.svg',
  'readme.md': 'file_type_markdown.svg',
  'readme': 'file_type_markdown.svg',
  'license': 'file_type_license.svg',
  'license.md': 'file_type_license.svg',
  'makefile': 'file_type_makefile.svg',
  'schema.prisma': 'file_type_prisma.svg',
}

function getIconName(filename: string, isFolder: boolean = false): string {
  if (isFolder) {
    return 'default_folder.svg'
  }
  
  const lowerFilename = filename.toLowerCase()
  
  // Check exact filename match first
  if (filenameToIcon[lowerFilename]) {
    return filenameToIcon[lowerFilename]
  }
  
  // Check for d.ts files
  if (lowerFilename.endsWith('.d.ts')) {
    return extensionToIcon['d.ts']
  }
  
  // Get extension
  const lastDot = lowerFilename.lastIndexOf('.')
  if (lastDot !== -1) {
    const ext = lowerFilename.substring(lastDot + 1)
    if (extensionToIcon[ext]) {
      return extensionToIcon[ext]
    }
  }
  
  return 'default_file.svg'
}

export function FileIcon({ 
  filename, 
  isFolder = false, 
  size = 16, 
  className = '' 
}: FileIconProps) {
  const iconUrl = useMemo(() => {
    const iconName = getIconName(filename, isFolder)
    return `${ICON_BASE_URL}/${iconName}`
  }, [filename, isFolder])

  return (
    <img 
      src={iconUrl}
      alt=""
      width={size}
      height={size}
      className={`flex-shrink-0 ${className}`}
      loading="lazy"
      onError={(e) => {
        // Fallback to default file icon on error
        const target = e.target as HTMLImageElement
        if (!target.src.includes('default_file.svg')) {
          target.src = `${ICON_BASE_URL}/default_file.svg`
        }
      }}
    />
  )
}

// Compact version for inline use
export function FileIconInline({ filename, size = 14 }: { filename: string; size?: number }) {
  return <FileIcon filename={filename} size={size} className="inline-block" />
}
