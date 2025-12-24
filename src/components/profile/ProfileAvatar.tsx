import React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import type { UserInfo } from "@/types/user.type"

interface ProfileAvatarProps {
  userInfo: UserInfo | null
  isEditing: boolean
  onAvatarChange?: (file: File | null) => void
  avatarSrc?: string
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  userInfo,
  isEditing,
  onAvatarChange,
  avatarSrc,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      return name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0].toUpperCase())
        .slice(0, 2)
        .join("")
    }
    if (email) return email[0].toUpperCase()
    return "U"
  }

  const handleCameraClick = () => {
    if (isEditing && onAvatarChange) fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onAvatarChange?.(file)
    e.target.value = "" // reset để chọn lại cùng file
  }

  const initials = getInitials(userInfo?.FULL_NAME, userInfo?.EMAIL)
  const resolvedAvatar = avatarSrc ?? userInfo?.AVATAR

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {resolvedAvatar ? (
          <Avatar
            size={70}
            src={resolvedAvatar}
            className="overflow-hidden rounded-full border-2 border-gray-200"
          />
        ) : (
          <AvatarFallback
            size={70}
            className="flex items-center justify-center bg-gradient-to-tr from-emerald-500 to-green-400 text-4xl font-bold text-white"
          >
            {initials}
          </AvatarFallback>
        )}

        {isEditing && onAvatarChange && (
          <>
            <Button
              size="small"
              className="absolute right-0 bottom-0 flex h-9 w-9 translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full border border-gray-300 bg-white p-0 hover:bg-gray-100"
              onClick={handleCameraClick}
            >
              <Camera className="h-4 w-4 text-gray-700" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold">
          {userInfo?.FULL_NAME || "Người dùng"}
        </h3>
        {userInfo?.EMAIL && (
          <p className="text-muted-foreground">{userInfo.EMAIL}</p>
        )}
        <Badge variant="secondary" className="mt-2">
          Tài khoản đã xác thực
        </Badge>
      </div>
    </div>
  )
}

export default ProfileAvatar
