// components/Users/UsersList.tsx
"use client"

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from "lucide-react"
import { useDarkMode } from "@/hooks/useDarkMode"
import { cn } from "@/lib/utils"

// Static user data
const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor", status: "Active" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User", status: "Active" },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "Moderator", status: "Inactive" },
]

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState("")
  const { isDarkMode } = useDarkMode()

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={cn(
      "p-4 rounded-lg",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <h1 className={cn(
        "text-2xl font-bold mb-4",
        isDarkMode ? "text-white" : "text-gray-800"
      )}>
        All Users
      </h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10",
              isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
            )}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <Button className={cn(
          isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
        )}>
          Add New User
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}