'use client'

import { signOut } from '@/api/sign-out'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useProfile } from '@/api/hooks/use-profile'

export function UserMenu() {
  const navigate = useNavigate()
  const { data: profile } = useProfile()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            asChild
            className="flex flex-row gap-2 items-center p-2"
          >
            <Link to="/account/me">
              <User className="w-6 h-6" />

              <div className="flex flex-col">
                <span className="text-sm">Perfil</span>
                <span className="text-muted-foreground text-xs">
                  Visualize seu perfil e compartilhe com outros
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="flex flex-row gap-2 items-center p-2"
          >
            <Link to="/app/account">
              <Settings className="w-6 h-6" />

              <div className="flex flex-col">
                <span className="text-sm">Configurações</span>
                <span className="text-muted-foreground text-xs">
                  Acesse os seus dados
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex flex-row gap-2 items-center p-2"
          onClick={() => signOut().then(() => navigate('/sign-in'))}
        >
          <LogOut className="w-6 h-6" />

          <div className="flex flex-col">
            <span className="text-sm">Sair</span>
            <span className="text-muted-foreground text-xs">
              Saia da sua conta
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
