"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, FolderGit2, Plus, Save, Trash2, Upload, User } from "lucide-react";
import { useState } from "react";

// Shadcn UI Components (Giả định bạn đã import đúng đường dẫn)
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// --- Dữ liệu mẫu (Mock Data) ---
const TABS = [
  { id: "profile", label: "Hồ sơ cá nhân", icon: User },
  { id: "experience", label: "Kinh nghiệm", icon: Briefcase },
  { id: "projects", label: "Dự án", icon: FolderGit2 },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Cài đặt Portfolio</h1>
          <p className="text-muted-foreground">Quản lý thông tin cá nhân và nội dung hiển thị.</p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar Navigation */}
          <nav className="w-full md:w-64 flex-shrink-0">
            <div className="flex flex-col gap-2 sticky top-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {/* Active Background Animation */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg bg-muted"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <tab.icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "profile" && <ProfileSettings />}
                {activeTab === "experience" && <ExperienceSettings />}
                {activeTab === "projects" && <ProjectSettings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components cho từng phần ---

function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
        <CardDescription>Thông tin này sẽ hiển thị công khai trên trang chủ.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 cursor-pointer border-2 border-border hover:opacity-80 transition-opacity">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" /> Thay đổi ảnh
            </Button>
            <p className="text-xs text-muted-foreground">JPG, PNG tối đa 2MB.</p>
          </div>
        </div>

        <Separator />

        {/* Form Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input id="name" placeholder="Ví dụ: Nguyễn Văn A" defaultValue="Nguyễn Văn A" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Chức danh (Job Title)</Label>
            <Input id="title" placeholder="Ví dụ: Frontend Developer" defaultValue="Software Engineer" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Giới thiệu ngắn (Bio)</Label>
          <Textarea 
            id="bio" 
            placeholder="Viết một chút về bản thân bạn..." 
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website / LinkedIn</Label>
          <Input id="website" placeholder="https://..." />
        </div>

        <div className="flex justify-end pt-4">
          <Button className="gap-2">
            <Save className="h-4 w-4" /> Lưu thay đổi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExperienceSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Kinh nghiệm làm việc</h2>
          <p className="text-sm text-muted-foreground">Quản lý lịch sử làm việc của bạn.</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Thêm mới</Button>
      </div>

      {/* List Item 1 */}
      <Card className="group relative overflow-hidden transition-all hover:border-primary/50">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Senior Frontend Developer</h3>
              <p className="text-sm text-muted-foreground">Tech Corp Inc. • 2021 - Hiện tại</p>
              <p className="text-sm mt-2 text-muted-foreground/80 line-clamp-2">
                Phát triển hệ thống Design System, tối ưu hóa hiệu năng React app...
              </p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon"><span className="sr-only">Edit</span>✎</Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List Item 2 */}
      <Card className="group relative overflow-hidden transition-all hover:border-primary/50">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Junior Web Developer</h3>
              <p className="text-sm text-muted-foreground">Creative Agency • 2019 - 2021</p>
              <p className="text-sm mt-2 text-muted-foreground/80 line-clamp-2">
                Xây dựng landing page cho khách hàng sử dụng Next.js và Tailwind...
              </p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon">✎</Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Dự án nổi bật</h2>
          <p className="text-sm text-muted-foreground">Các dự án bạn đã tham gia hoặc phát triển.</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Thêm dự án</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Card 1 */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-32 w-full bg-muted/50 flex items-center justify-center text-muted-foreground">
             

[Image of Project Thumbnail]

          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">E-commerce Dashboard</h3>
              <Badge variant="secondary">Next.js</Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
              Một dashboard quản lý bán hàng tích hợp AI để phân tích dữ liệu...
            </p>
            <div className="flex gap-2 justify-end">
               <Button variant="outline" size="sm" className="h-8">Sửa</Button>
               <Button variant="ghost" size="sm" className="h-8 text-destructive">Xóa</Button>
            </div>
          </CardContent>
        </Card>

        {/* Project Card 2 */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-32 w-full bg-muted/50 flex items-center justify-center text-muted-foreground">
             

[Image of Project Thumbnail]

          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Personal Portfolio</h3>
              <Badge variant="secondary">React</Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
              Trang web cá nhân giới thiệu bản thân với animation mượt mà...
            </p>
            <div className="flex gap-2 justify-end">
               <Button variant="outline" size="sm" className="h-8">Sửa</Button>
               <Button variant="ghost" size="sm" className="h-8 text-destructive">Xóa</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}