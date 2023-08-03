import React from 'react'
import { User } from 'next-auth'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu';


type Props = {
    user: Pick<User , "name" | "image" | "email">;
}

const UserAccountNav = ({user}: Props) => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            
        </DropdownMenuTrigger>
    </DropdownMenu>
  )
}

export default UserAccountNav