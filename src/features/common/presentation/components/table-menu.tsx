"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Pencil, Trash2, Languages, CheckSquare, Mail, DollarSign } from "lucide-react"

interface MenuProps {
  onEdit?: () => void
  onViewDetails?: () => void
  onDelete?: () => void
  onPay?: () => void
  onActive?: () => void
  onMessage?: () => void
  onTranslate?: () => void
  onView?: () => void
  isActive?: boolean
}

const TableMenu = ({
  onDelete,
  onEdit,
  onViewDetails,
  onPay,
  onActive,
  onMessage,
  isActive,
  onTranslate,
  onView,
}: MenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {onViewDetails && (
          <DropdownMenuItem onClick={onViewDetails}>
            <Eye className="mr-2 h-4 w-4" /> Ver detalles
          </DropdownMenuItem>
        )}

        {onTranslate && (
          <DropdownMenuItem onClick={onTranslate}>
            <Languages className="mr-2 h-4 w-4" /> Traducir
          </DropdownMenuItem>
        )}

        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" /> Ver
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
        )}

        {onPay && (
          <DropdownMenuItem onClick={onPay}>
            <DollarSign className="mr-2 h-4 w-4" /> Pagar
          </DropdownMenuItem>
        )}

        {onActive && (
          <DropdownMenuItem onClick={onActive}>
            <CheckSquare className="mr-2 h-4 w-4" />
            {isActive ? "Desactivar" : "Activar"}
          </DropdownMenuItem>
        )}

        {onMessage && (
          <DropdownMenuItem onClick={onMessage}>
            <Mail className="mr-2 h-4 w-4" /> Enviar mensaje
          </DropdownMenuItem>
        )}

        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TableMenu
