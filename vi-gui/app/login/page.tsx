"use client";
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/Authcontext';
import { useRouter } from "next/navigation"
import { toast } from '@/hooks/use-toast';
import axiosInstance from "@/lib/axios";

export const Login: React.FC<React.ComponentPropsWithoutRef<"div">> = ({ className, ...props }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const router = useRouter();
  const { login, register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login/', {
        username: formData.username,
        password: formData.password
      });
      
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Login successful"
        });
        router.push('/');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Login failed",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Registration successful"
        });
        setFormData({ username: '', password: '', email: '' });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Registration failed",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Tabs defaultValue="Login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Login">Login</TabsTrigger>
          <TabsTrigger value="register">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="Login" className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your username below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={formData.password} 
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register" className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>Register your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">Sign Up</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>      
      </Tabs>
    </div>
  );
};

export default Login;