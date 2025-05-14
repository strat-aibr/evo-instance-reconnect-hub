
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronRight, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

type SidebarContextType = {
  isSidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
  isMobileMenuOpen: boolean
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type SidebarProviderProps = {
  children: React.ReactNode
}

export const SidebarContext = React.createContext<SidebarContextType | null>(
  null
)

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true)
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        setSidebarOpen,
        isMobile,
        isMobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

const sidebarVariants = cva("", {
  variants: {
    default: {
      true: "lg:ml-0 lg:translate-x-0",
    },
    open: {
      true: "lg:ml-0 lg:translate-x-0",
      false: "-ml-[270px]",
    },
  },
  defaultVariants: {
    open: true,
  },
})

const sidebarContentVariants = cva("", {
  variants: {
    default: {
      true: "w-[270px]",
      false: "w-16 p-2 py-4",
    },
  },
})

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { isSidebarOpen, isMobile, isMobileMenuOpen, setMobileMenuOpen } =
    useSidebar()

  if (isMobile) {
    return (
      <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          className={cn(
            "fixed left-0 top-0 h-full w-[270px] border-r p-0",
            className
          )}
          data-sidebar="true"
          data-mobile="true"
          style={{ paddingRight: 0 }}
        >
          <div className="w-full">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "h-screen overflow-hidden bg-background transition-[margin] duration-300 ease-in-out",
        sidebarVariants({
          open: isSidebarOpen,
        }),
        className
      )}
      data-sidebar="true"
      data-open={isSidebarOpen}
      {...props}
    >
      {children}
    </div>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof sidebarContentVariants>
>(({ children, className, ...props }, ref) => {
  const { isSidebarOpen } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full flex-col border-r bg-background px-2 py-5 transition-[width] duration-300 ease-in-out",
        sidebarContentVariants({
          default: isSidebarOpen,
        }),
        className
      )}
      data-sidebar-content="true"
      data-open={isSidebarOpen}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const { isMobile, setMobileMenuOpen, isSidebarOpen, setSidebarOpen } =
    useSidebar()

  const onTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      setMobileMenuOpen(true)
    } else {
      setSidebarOpen(!isSidebarOpen)
    }

    props.onClick?.(event)
  }

  return (
    <Button
      ref={ref}
      className={cn(className)}
      variant="ghost"
      size="icon"
      onClick={onTriggerClick}
      {...props}
    >
      <Menu />
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mb-6 flex items-center", className)}
      data-sidebar-header
      {...props}
    >
      {children}
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto", className)}
      data-sidebar-footer
      {...props}
    >
      {children}
    </div>
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isSidebarOpen } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "mb-4 px-2",
        !isSidebarOpen && "items-center",
        className
      )}
      data-sidebar-group
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isSidebarOpen } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(!isSidebarOpen && "hidden", className)}
      data-sidebar-group-content
      data-open={isSidebarOpen}
      {...props}
    />
  )
})
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarGroupLabel = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { isSidebarOpen } = useSidebar()

  if (!isSidebarOpen) return null

  return (
    <p
      ref={ref}
      className={cn(
        "mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        className
      )}
      data-sidebar-group-label
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupToggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group flex w-full cursor-pointer items-center rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      data-sidebar-group-toggle
      {...props}
    >
      <span className="flex-1 truncate text-sm capitalize">{children}</span>
      <ChevronRight className="h-4 w-4 opacity-50 group-data-[state=open]:rotate-90" />
    </button>
  )
})
SidebarGroupToggle.displayName = "SidebarGroupToggle"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-1", className)}
      data-sidebar-menu
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isSidebarOpen } = useSidebar()

  return (
    <div
      ref={ref}
      data-sidebar-menu-item
      className={cn(
        "relative",
        !isSidebarOpen &&
          "flex items-center justify-center rounded hover:bg-accent",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const { isSidebarOpen } = useSidebar()
  const Comp = asChild ? "span" : "button"

  return (
    <Comp
      ref={ref}
      className={cn(
        "block w-full rounded-md px-2 py-1.5 text-sm outline-none focus-visible:bg-accent focus-visible:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        !isSidebarOpen && "flex items-center justify-center",
        className
      )}
      data-sidebar-menu-button
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const sidebarMenuItemTextVariants = cva("flex items-center gap-2", {
  variants: {
    open: {
      true: "opacity-100",
      false: "opacity-0 hidden",
    },
  },
  defaultVariants: {
    open: true,
  },
})

const SidebarMenuItemText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isSidebarOpen } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "truncate text-sm",
        sidebarMenuItemTextVariants({ open: isSidebarOpen }),
        className
      )}
      data-sidebar-menu-item-text
      {...props}
    />
  )
})
SidebarMenuItemText.displayName = "SidebarMenuItemText"

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupToggle,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuItemText,
}
