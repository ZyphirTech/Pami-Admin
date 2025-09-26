"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  HeartPulse,
  Baby,
  Stethoscope,
  Milk,
  Activity,
  BookOpen,
  GraduationCap,
  User,
  UserCheck,
  Syringe,
  CalendarClock,
  ChevronRight,
  ChevronLeft,
  Shield,
  Users,
  MapPin,
  Landmark,
  MapPinned,
  Home,
  Hospital,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  section: string;
}

const navItems: NavItem[] = [
  {
    label: "Inicio",
    icon: LayoutDashboard,
    href: "/dashboard",
    section: "Administración",
  },
  {
    label: "Usuarios",
    icon: Users,
    href: "/dashboard/users",
    section: "Administración",
  },
  {
    label: "Roles",
    icon: Shield,
    href: "/dashboard/users",
    section: "Administración",
  },
  {
    label: "Pregestantes",
    icon: HeartPulse,
    href: "/dashboard/pregestantes",
    section: "PAMI",
  },
  {
    label: "Gestantes",
    icon: Baby,
    href: "/dashboard/gestantes",
    section: "PAMI",
  },
  {
    label: "Posgestantes",
    icon: Stethoscope,
    href: "/dashboard/posgestantes",
    section: "PAMI",
  },
  {
    label: "Lactantes",
    icon: Milk,
    href: "/dashboard/lactantes",
    section: "PAMI",
  },
  {
    label: "Transicional",
    icon: Activity,
    href: "/dashboard/transicional",
    section: "PAMI",
  },
  {
    label: "Preescolar",
    icon: BookOpen,
    href: "/dashboard/preescolar",
    section: "PAMI",
  },
  {
    label: "Escolar",
    icon: GraduationCap,
    href: "/dashboard/escolar",
    section: "PAMI",
  },
  {
    label: "Adolescentes",
    icon: User,
    href: "/dashboard/adolescentes",
    section: "PAMI",
  },
  {
    label: "Adultos",
    icon: UserCheck,
    href: "/dashboard/adultos",
    section: "PAMI",
  },

  {
    label: "Ficha de Vacunacion",
    icon: Syringe,
    href: "/dashboard/ficha-vacunacion",
    section: "Vacunacion",
  },
  {
    label: "Gestion de Guardias",
    icon: CalendarClock,
    href: "/dashboard/guardias",
    section: "Guardias",
  },
  {
    label: "Provincias",
    icon: Map,
    href: "/dashboard/provincias",
    section: "Gestion",
  },
  {
    label: "Municipios",
    icon: MapPin,
    href: "/dashboard/municipios",
    section: "Gestion",
  },
  {
    label: "Consejos Populares",
    icon: Landmark,
    href: "/dashboard/consejo-popular",
    section: "Gestion",
  },
  {
    label: "Circunscripciones",
    icon: MapPinned,
    href: "/dashboard/circunscripcion",
    section: "Gestion",
  },
  {
    label: "CDR",
    icon: Home,
    href: "/dashboard/cdr",
    section: "Gestion",
  },
  {
    label: "Policlinicos",
    icon: Hospital,
    href: "/dashboard/policlinico",
    section: "Gestion",
  },
  {
    label: "Consultorios",
    icon: Stethoscope,
    href: "/dashboard/consultorio",
    section: "Gestion",
  },
];

function Sidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const sections = Array.from(new Set(navItems.map((item) => item.section)));

  return (
    <aside
      className={cn(
        "h-screen border-r bg-background transition-all duration-300 fle flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="sticky top-0 flex items-center gap-2">
          <Image src="/logo.png" width={40} height={40} alt="Logo MINSAP" />
          {!collapsed && <span className="font-semibold text-sm">MINSAP</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="px-2 py-4 text-sm">
          {sections.map((section, idx) => (
            <div key={section} className="mb-4">
              {!collapsed && (
                <h3 className="text-muted-foreground font-semibold uppercase text-xs mb-2">
                  {section}
                </h3>
              )}
              <ul className="space-y-1">
                {navItems
                  .filter((item) => item.section === section)
                  .map(({ label, icon: Icon, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted transition",
                          pathname === href &&
                            "bg-muted font-medium text-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {!collapsed && <span>{label}</span>}
                      </a>
                    </li>
                  ))}
              </ul>
              {idx < sections.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}

export default Sidebar;
